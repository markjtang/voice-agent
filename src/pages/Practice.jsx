import React, { useState, useEffect, useCallback } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import { useConversation } from '@11labs/react';

const SCENARIOS = {
  restaurant: "Restaurant Ordering",
  directions: "Asking for Directions",
  shopping: "Shopping Conversation"
};

const SCENARIO_PROMPTS = {
  restaurant: `You are a helpful language tutor focused on helping users practice restaurant conversations.
- Guide users through ordering food, asking about menu items, making special requests
- Provide specific feedback on pronunciation and intonation
- Help with common restaurant vocabulary and phrases
- Be encouraging and supportive
- Keep responses concise and natural`,
  directions: `You are a helpful language tutor focused on helping users practice asking for and giving directions.
- Guide users through asking for locations, understanding directions, confirming routes
- Provide specific feedback on pronunciation and intonation
- Help with spatial vocabulary and direction-related phrases
- Be encouraging and supportive
- Keep responses concise and natural`,
  shopping: `You are a helpful language tutor focused on helping users practice shopping conversations.
- Guide users through asking about products, prices, sizes, and making purchases
- Provide specific feedback on pronunciation and intonation
- Help with shopping-related vocabulary and phrases
- Be encouraging and supportive
- Keep responses concise and natural`
};

async function requestMicrophonePermission() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch {
    console.error("Microphone permission denied");
    return false;
  }
}

async function getSignedUrl() {
  const response = await fetch('http://localhost:3001/api/get-signed-url');
  if (!response.ok) {
    throw Error("Failed to get signed url");
  }
  const data = await response.json();
  console.log('Received signed URL:', data.signedUrl);
  return data.signedUrl;
}

export default function Practice() {
  const [selectedScenario, setSelectedScenario] = useState('restaurant');
  const [messages, setMessages] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const conversation = useConversation({
    overrides: {
      agent: {
        prompt: {
          prompt: SCENARIO_PROMPTS[selectedScenario]
        },
      },
    },
    onConnect: () => {
      console.log("Connected to conversation");
      setError('');
    },
    onDisconnect: () => {
      console.log("Disconnected from conversation");
      setFeedback("Great job! Your diction was clear and your pronunciation improved significantly. Keep practicing to enhance your fluency!");
    },
    onError: (err) => {
      console.error('Conversation error:', err);
      setError(err.message);
    },
    onMessage: (message) => {
      console.log('Message received:', message);
      if (message.source === 'user') {
        // Handle user's speech
        console.log('User message:', message.message);
        if (message.message.trim()) {  // Only add non-empty messages
          setMessages(prev => {
            console.log('Previous messages:', prev);
            const newMessages = [...prev, {
              role: 'user',
              content: message.message
            }];
            console.log('New messages:', newMessages);
            return newMessages;
          });
        }
      } else if (message.source === 'ai') {
        // Handle agent's response
        console.log('AI message:', message.message);
        if (message.message.trim()) {  // Only add non-empty messages
          setMessages(prev => {
            const newMessages = [...prev.filter(m => !m.interim), {
              role: 'assistant',
              content: message.message
            }];
            console.log('Updated messages:', newMessages);
            return newMessages;
          });
        }
      }
    }
  });

  const handleStartSession = useCallback(async () => {
    try {
      setError('');
      setMessages([]);
      
      // Request microphone permission
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        setError('Microphone permission denied');
        return;
      }
      
      // Get signed URL
      const signedUrl = await getSignedUrl();
      
      // Start the conversation session
      const conversationId = await conversation.startSession({ signedUrl });
      
      console.log('Conversation started:', conversationId);
    } catch (err) {
      console.error('Session start error:', err);
      setError(err.message || 'Failed to start session');
    }
  }, [conversation]);

  const handleStopSession = useCallback(async () => {
    try {
      if (conversation?.endSession) {
        await conversation.endSession();
      }
      conversation.isSpeaking = false; // Clear the isSpeaking state
    } catch (err) {
      console.error('Session end error:', err);
      setError('Failed to end session properly.');
    }
  }, [conversation]);

  const handleScenarioChange = (e) => {
    if (conversation?.status === 'connected') {
      handleStopSession();
    }
    setSelectedScenario(e.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Scenario
          </label>
          <select
            value={selectedScenario}
            onChange={handleScenarioChange}
            className="w-full p-2 border rounded-md"
            disabled={conversation?.status === 'connected'}
          >
            {Object.entries(SCENARIOS).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
          {messages.length === 0 && (
            <div className="text-gray-500 text-center">
              Start speaking to begin the conversation
            </div>
          )}
          {messages.map((message, index) => {
            console.log('Rendering message:', message);
            return (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  message.role === 'assistant'
                    ? 'bg-blue-100 ml-4'
                    : message.interim
                    ? 'bg-gray-50 mr-4 italic'
                    : 'bg-gray-100 mr-4'
                }`}
              >
                <div className="text-xs text-gray-500 mb-1">
                  {message.role} {message.interim ? '(typing...)' : ''}
                </div>
                {message.content}
                {message.interim && '...'}
              </div>
            );
          })}
          {conversation?.isSpeaking && (
            <div className="bg-blue-50 p-3 rounded-lg text-blue-500">
              Agent is speaking...
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleStartSession}
            disabled={conversation?.status === 'connected'}
            className="p-4 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors disabled:opacity-50"
          >
            <FaMicrophone className="w-6 h-6" />
          </button>
          <button
            onClick={handleStopSession}
            disabled={!conversation || conversation.status !== 'connected'}
            className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50"
          >
            <FaStop className="w-6 h-6" />
          </button>
        </div>
      </div>

      {feedback && (
        <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-4">
          <p className="text-green-700 whitespace-pre-line">{feedback}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {conversation?.status && (
        <div className="text-center text-sm text-gray-500">
          Status: {conversation.status}
        </div>
      )}
    </div>
  );
}
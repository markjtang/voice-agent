import Navigation from './components/Navigation';
import Practice from './pages/Practice';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="p-4">
        <Practice />
      </main>
    </div>
  );
}

export default App;

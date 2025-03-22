import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get("/api/get-signed-url", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=" + process.env.VITE_AGENT_ID,
      {
        headers: {
          "xi-api-key": process.env.VITE_ELEVEN_LABS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get signed URL");
    }

    const data = await response.json();
    res.json({ signedUrl: data.signed_url });
  } catch (error) {
    console.error('Error getting signed URL:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
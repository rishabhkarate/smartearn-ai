const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

// Setup environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
    res.send('SmartEarn Backend is Running Successfully! 🚀');
});

// Asli AI Video Generation Route (Using Hugging Face Free API)
app.post('/api/generate-video', async (req, res) => {
    try {
        const { prompt } = req.body;
        console.log("User ka prompt aaya:", prompt);

        const HF_API_KEY = process.env.HF_API_KEY;
        if (!HF_API_KEY) {
            return res.status(500).json({ success: false, message: "API Key is missing in Render settings." });
        }

        // Calling Hugging Face's Free Text-to-Video Model
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/ali-vilab/text-to-video-ms-1.0m",
            { inputs: prompt },
            {
                headers: { Authorization: `Bearer ${HF_API_KEY}` },
                responseType: 'arraybuffer' // Video file receive karne ke liye
            }
        );

        // Raw video data ko base64 link mein convert karna
        const base64Video = Buffer.from(response.data, 'binary').toString('base64');
        const videoUrl = `data:video/mp4;base64,${base64Video}`;

        res.json({ 
            success: true, 
            message: "Video generated successfully!",
            videoUrl: videoUrl 
        });

    } catch (error) {
        console.error("Video Error:", error.message);
        
        // Hugging face par kabhi kabhi model "load" hone me time lagta hai (Error 503)
        if (error.response && error.response.status === 503) {
            return res.status(503).json({ 
                success: false, 
                message: "AI model is warming up. Please wait 1-2 minutes and click Generate again!" 
            });
        }
        
        res.status(500).json({ success: false, message: "Failed to generate video. Server is busy." });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

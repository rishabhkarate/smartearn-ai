const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Setup environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Test Route - Check karne ke liye ki server chal raha hai ya nahi
app.get('/', (req, res) => {
    res.send('SmartEarn Backend is Running Successfully! 🚀');
});

// 2. Video Generation API Route (Abhi ye dummy hai, next step mein isme Asli AI jogenge)
app.post('/api/generate-video', async (req, res) => {
    try {
        const { prompt } = req.body;
        console.log("User ka prompt aaya:", prompt);

        // Yahan par hum aage chal kar Fal.ai, Runway ya Replicate ka API code daalenge.
        // Abhi test karne ke liye ek dummy video bhej rahe hain.
        
        res.json({ 
            success: true, 
            message: "Video generated successfully!",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Video generate hone mein error aayi." });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

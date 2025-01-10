const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Initialize AWS Polly
AWS.config.update({
    accessKeyId: 'your-access-key-here',       // Replace with your AWS Access Key
    secretAccessKey: 'your-secret-key-here',   // Replace with your AWS Secret Key
    region: 'ap-south-1'                   // Change region if necessary
});
const polly = new AWS.Polly();

// Middleware to parse JSON request and serve static files
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve files from 'public' folder

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// POST endpoint to handle text-to-speech conversion
app.post('/synthesize', async (req, res) => {
  const text = req.body.text;

  // Polly Synthesize Speech parameters
  const params = {
    Text: text,
    OutputFormat: 'mp3',
    VoiceId: 'Joanna',  // You can choose any voice from AWS Polly
  };

  try {
    // Call Polly API to synthesize speech
    const data = await polly.synthesizeSpeech(params).promise();

    // Ensure 'public' folder exists
    const outputDir = path.join(__dirname, 'public');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Save the audio file to public directory
    const filePath = path.join(outputDir, 'output.mp3');
    fs.writeFileSync(filePath, data.AudioStream);

    // Send the file URL back as a response
    res.json({ audioUrl: '/output.mp3' }); // Ensure correct path to the file
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({ error: 'Failed to synthesize speech' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

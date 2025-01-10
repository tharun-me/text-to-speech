const form = document.getElementById('speech-form');
const audioElement = document.getElementById('audio');
const downloadBtn = document.getElementById('download-btn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = document.getElementById('text').value;

  try {
    // Send text to backend for text-to-speech conversion
    const response = await fetch('/synthesize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    if (data.audioUrl) {
      // Set the audio source to the generated MP3
      audioElement.src = data.audioUrl;
      audioElement.style.display = 'block';
      downloadBtn.style.display = 'inline-block';

      // Enable the download button
      downloadBtn.onclick = () => {
        const link = document.createElement('a');
        link.href = data.audioUrl;
        link.download = 'output.mp3';
        link.click();
      };
    }
  } catch (err) {
    console.log('Error:', err);
  }
});

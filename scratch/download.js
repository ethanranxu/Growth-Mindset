const fs = require('fs');
const https = require('https');
const path = require('path');

// Target file
const dest = path.join(__dirname, '..', 'public', 'audio', 'success.mp3');

// Ensure parent dir exists
const dir = path.dirname(dest);
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const file = fs.createWriteStream(dest);

const url = 'https://raw.githubusercontent.com/bradtraversy/50projects50days/master/sound-board/sounds/applause.mp3';

const options = {
  headers: {
    // A normal browser User-Agent avoids bot-traffic blocks on Wikimedia Commons
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
};

console.log('Downloading applause sound from:', url);

https.get(url, options, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Failed to download: Status Code ${response.statusCode}`);
    response.resume();
    return;
  }
  
  response.pipe(file);
  
  file.on('finish', () => {
    file.close();
    console.log('Download completed successfully. Saved to:', dest);
  });
}).on('error', (err) => {
  fs.unlink(dest, () => {}); // Delete the file on error
  console.error('Error downloading file:', err.message);
});

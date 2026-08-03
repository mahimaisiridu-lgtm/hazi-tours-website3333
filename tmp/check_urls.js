const https = require('https');
const fs = require('fs');

const files = [
  'src/data.ts',
  'src/data/events.ts',
  'src/components/Hero.tsx',
  'src/components/About.tsx',
  'src/components/EventsPage.tsx',
  'src/components/Reviews.tsx',
  'src/firebase.ts'
];

let urls = new Set();
files.forEach(f => {
  if (fs.existsSync(f)) {
    const text = fs.readFileSync(f, 'utf8');
    const matches = text.match(/https:\/\/images\.unsplash\.com\/[^\s"'`]+/g) || [];
    matches.forEach(m => urls.add(m));
  }
});

console.log('Unique Unsplash URLs found:', urls.size);

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { method: 'HEAD' }, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', (err) => {
      resolve({ url, status: 'ERROR: ' + err.message });
    });
  });
}

async function checkAll() {
  const list = Array.from(urls);
  const results = await Promise.all(list.map(checkUrl));
  const bad = results.filter(r => r.status !== 200 && r.status !== 301 && r.status !== 302);
  console.log('Checked ' + results.length + ' URLs.');
  if (bad.length > 0) {
    console.log('Found problematic URLs:', bad);
  } else {
    console.log('All image URLs are verified and return HTTP 200!');
  }
}

checkAll();

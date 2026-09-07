const https = require('https');

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({
        url,
        statusCode: res.statusCode,
        contentType: res.headers['content-type'],
        contentLength: res.headers['content-length']
      });
    }).on('error', (e) => {
      resolve({ url, error: e.message });
    });
  });
}

async function main() {
  const urls = [
    'https://greenpreneur.in/uploads/nominations/CampusDean(Gold%20Sponsor).jpg',
    'https://greenpreneur.in/uploads/nominations/Broghar%20Realty.png',
    'https://greenpreneur.in/uploads/nominations/Aerolam.png',
    'https://greenpreneur.in/uploads/nominations/Fempreneur.png',
    'https://greenpreneur.in/uploads/nominations/1%20Million.png',
    'https://greenpreneur.in/uploads/nominations/Peers%20Global.png',
    'https://greenpreneur.in/uploads/nominations/VyapaarJagat.com.png'
  ];

  for (const url of urls) {
    const res = await checkUrl(url);
    console.log(`${res.url} -> Status: ${res.statusCode}, Type: ${res.contentType}, Length: ${res.contentLength}`);
  }
}

main();

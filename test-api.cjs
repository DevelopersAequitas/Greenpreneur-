const http = require('http');

const TEST_PORT = process.env.TEST_PORT ? parseInt(process.env.TEST_PORT, 10) : 5000;
const BASE_URL = `http://localhost:${TEST_PORT}/api`;

const makeRequest = (path, method, data) => {
  return new Promise((resolve, reject) => {
    const dataString = data ? JSON.stringify(data) : '';
    const options = {
      hostname: 'localhost',
      port: TEST_PORT,
      path: '/api' + path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataString)
      }
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseBody);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: responseBody });
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (data) req.write(dataString);
    req.end();
  });
};

const runTests = async () => {
  console.log("🚀 Starting API Integration Tests...\n");

  try {
    // 1. Test Categories GET
    console.log("1. GET /nominations/categories");
    let res = await makeRequest('/nominations/categories', 'GET');
    console.log(`   Status: ${res.status} | Data length: ${res.data.data ? res.data.data.length : 'N/A'}`);

    // 2. Test Nominations POST
    console.log("\n2. POST /nominations");
    res = await makeRequest('/nominations', 'POST', {
      track: 'rated',
      name: 'Test Nominee',
      business: 'Test Corp Ltd',
      phone: '9999999999',
      email: 'test@example.com',
      city: 'Delhi',
      category: 'Eco-Friendly Product',
      description: 'This is a test description of the green impact.',
      package: 'standard'
    });
    console.log(`   Status: ${res.status} | Success: ${res.data.success}`);

    // 3. Test Event Registration POST
    console.log("\n3. POST /events/register");
    res = await makeRequest('/events/register', 'POST', {
      name: 'Event Attendee',
      email: 'attendee@example.com',
      phone: '8888888888',
      city: 'Mumbai',
      segment: 'Startup'
    });
    console.log(`   Status: ${res.status} | Success: ${res.data.success}`);

    // 4. Test Sponsorship POST
    console.log("\n4. POST /sponsorships");
    res = await makeRequest('/sponsorships', 'POST', {
      name: 'Sponsor Lead',
      company: 'Green Tech',
      email: 'sponsor@example.com',
      phone: '7777777777',
      tier: 'Gold Sponsor'
    });
    console.log(`   Status: ${res.status} | Success: ${res.data.success}`);

    // 5. Test Coffee Table Book POST
    console.log("\n5. POST /coffee-book");
    res = await makeRequest('/coffee-book', 'POST', {
      name: 'Book Featured',
      phone: '6666666666',
      email: 'book@example.com',
      company: 'Bio Systems',
      package: 'Cover Story'
    });
    console.log(`   Status: ${res.status} | Success: ${res.data.success}`);

    // 6. Test Contact POST
    console.log("\n6. POST /contact");
    res = await makeRequest('/contact', 'POST', {
      name: 'Inquiry User',
      phone: '5555555555',
      email: 'inquiry@example.com',
      interest: 'General',
      message: 'This is a test inquiry.'
    });
    console.log(`   Status: ${res.status} | Success: ${res.data.success}`);

    // 7. Test Community POST
    console.log("\n7. POST /community/apply");
    res = await makeRequest('/community/apply', 'POST', {
      name: 'Community Member',
      email: 'member@example.com',
      phone: '4444444444',
      city: 'Pune',
      company: 'Eco Friends',
      sector: 'NGO',
      interest: 'Networking',
      whyJoin: 'Because I want to network.'
    });
    console.log(`   Status: ${res.status} | Success: ${res.data.success}`);

    // 8. Test Winners GET
    console.log("\n8. GET /winners");
    res = await makeRequest('/winners', 'GET');
    console.log(`   Status: ${res.status} | Winners returned: ${res.data.data ? res.data.data.length : 'N/A'}`);

    console.log("\n✅ All tests executed successfully!");

  } catch (err) {
    console.error("❌ Test script failed:", err);
  }
};

runTests();

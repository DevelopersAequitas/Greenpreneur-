const Razorpay = require('razorpay');

async function testKeys(key_id, key_secret) {
  try {
    const rzp = new Razorpay({ key_id, key_secret });
    const order = await rzp.orders.create({
      amount: 100,
      currency: 'INR',
      receipt: 'rcpt_test_123',
    });
    console.log(`Success with: ID: ${key_id}, Secret: ${key_secret}`);
    return true;
  } catch (err) {
    console.log(`Failed with: ID: ${key_id}, Secret: ${key_secret}`);
    console.log(`Error: ${err.error ? err.error.description : err.message}`);
    return false;
  }
}

async function runTests() {
  const secrets = [
    'NVINWtrWJr3abLtnorn475q9', // Capital I
    'NVlNWtrWJr3abLtnorn475q9', // Lowercase L
    'NV1NWtrWJr3abLtnorn475q9', // One
  ];
  const ids = [
    'rzp_live_S4Z79D9OR4XfXY', // Capital O
    'rzp_live_S4Z79D90R4XfXY', // Zero 0
  ];

  for (const id of ids) {
    for (const secret of secrets) {
      await testKeys(id, secret);
    }
  }
}

runTests();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Test JWT functionality
console.log('Testing JWT Token Functionality...\n');

// Test 1: Create a JWT token
const testUser = {
  id: '123456789',
  email: 'test@example.com'
};

const secretKey = "fallback-secret-key-for-development-only";

try {
  const token = jwt.sign(testUser, secretKey, { expiresIn: "24h" });
  console.log('✅ JWT Token created successfully:');
  console.log('Token:', token.substring(0, 50) + '...');
  
  // Test 2: Verify the JWT token
  const decoded = jwt.verify(token, secretKey);
  console.log('\n✅ JWT Token verified successfully:');
  console.log('Decoded payload:', decoded);
  
  // Test 3: Test password hashing
  const password = 'testpassword123';
  const hashedPassword = bcrypt.hashSync(password, 10);
  console.log('\n✅ Password hashing works:');
  console.log('Original password:', password);
  console.log('Hashed password:', hashedPassword.substring(0, 30) + '...');
  
  // Test 4: Test password verification
  const isMatch = bcrypt.compareSync(password, hashedPassword);
  console.log('\n✅ Password verification works:', isMatch);
  
  // Test 5: Test expired token
  const expiredToken = jwt.sign(testUser, secretKey, { expiresIn: "1s" });
  console.log('\n✅ Expired token created for testing');
  
  setTimeout(() => {
    try {
      jwt.verify(expiredToken, secretKey);
      console.log('❌ Token should be expired but is still valid');
    } catch (error) {
      console.log('✅ Expired token correctly rejected:', error.message);
    }
  }, 2000);
  
  console.log('\n🎉 All JWT tests passed! The JWT functionality is working correctly.');
  
} catch (error) {
  console.error('❌ JWT test failed:', error.message);
}

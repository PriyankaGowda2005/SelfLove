// MongoDB Atlas Connection Test
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    const mongoURI = 'mongodb+srv://priyanka636192:Priyanka@cluster0.hqrqzgl.mongodb.net/SelfLove';
    
    console.log('🔌 Connecting to MongoDB Atlas...');
    console.log('📍 URI:', mongoURI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in output
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Atlas Connected Successfully!');
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Ready State: ${conn.connection.readyState}`);
    
    // Test basic operations
    const testSchema = new mongoose.Schema({
      test: String,
      timestamp: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('ConnectionTest', testSchema);
    
    // Create a test document
    console.log('📝 Creating test document...');
    const testDoc = new TestModel({ test: 'Connection test successful' });
    await testDoc.save();
    console.log('✅ Test document created successfully');
    
    // Read the test document
    console.log('📖 Reading test document...');
    const foundDoc = await TestModel.findOne({ test: 'Connection test successful' });
    if (foundDoc) {
      console.log('✅ Test document retrieved successfully');
      console.log(`   Document ID: ${foundDoc._id}`);
      console.log(`   Timestamp: ${foundDoc.timestamp}`);
    }
    
    // Clean up test document
    console.log('🧹 Cleaning up test document...');
    await TestModel.deleteOne({ test: 'Connection test successful' });
    console.log('✅ Test document cleaned up');
    
    await mongoose.disconnect();
    console.log('✅ Connection closed successfully');
    console.log('');
    console.log('🎉 MongoDB Atlas connection test completed successfully!');
    console.log('   Your database is ready to use with the SelfLove Tracker application.');
    
  } catch (error) {
    console.error('❌ MongoDB Atlas Connection Failed:');
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code || 'Unknown'}`);
    console.error('');
    console.log('🔧 Troubleshooting steps:');
    console.log('1. Check if your IP address is whitelisted in MongoDB Atlas');
    console.log('2. Verify the connection string is correct');
    console.log('3. Ensure the database user has proper permissions');
    console.log('4. Check if the cluster is running and accessible');
    console.log('5. Verify your internet connection');
    process.exit(1);
  }
};

testConnection();

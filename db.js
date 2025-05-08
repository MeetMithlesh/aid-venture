// // db.js - MongoDB Connection Module
// const { MongoClient } = require('mongodb');
// require('dotenv').config();

// // MongoDB Connection URI from environment variables
// const uri = process.env.MONGODB_URI;

// // Create a new MongoClient
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Database connection instance
// let dbConnection;

// // Connect to MongoDB and return the database instance
// module.exports = {
//   // Connect to MongoDB
//   connectToDatabase: async function() {
//     try {
//       // Connect the client to the server
//       await client.connect();
//       console.log('Successfully connected to MongoDB');
      
//       // Get the database name from the connection string or use default
//       const dbName = process.env.DB_NAME || 'myDatabase';
      
//       // Get database instance
//       dbConnection = client.db(dbName);
      
//       return dbConnection;
//     } catch (error) {
//       console.error('Error connecting to MongoDB:', error);
//       throw error;
//     }
//   },
  
//   // Get the database connection
//   getDb: function() {
//     if (!dbConnection) {
//       throw new Error('Database connection not established! Call connectToDatabase first.');
//     }
//     return dbConnection;
//   },

//   // Get MongoDB client
//   getClient: function() {
//     return client;
//   },

//   // Close the connection
//   closeConnection: async function() {
//     try {
//       await client.close();
//       console.log('MongoDB connection closed');
//       dbConnection = null;
//     } catch (error) {
//       console.error('Error closing MongoDB connection:', error);
//       throw error;
//     }
//   }
// };
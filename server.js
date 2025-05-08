const express = require('express');
const passport = require('passport');
const session = require('express-session');
// const { connectToDatabase, getDb, closeConnection } = require('./db'); // Import database module
require('./passport');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const PORT =  3000;

const app = express();

app.use(cors({
    origin: '*', 
    credentials: true, 
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('frontend'));
app.use(session({ 
  secret: process.env.SESSION_SECRET, 
  resave: false, 
  saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());

// Database connection
// let db;

// Connect to the database before starting the server
async function startServer() {
  try {
    // Connect to MongoDB
    // db = await connectToDatabase();
    console.log('Database connection established');

    // Routes
    app.get('/', (req, res) => {
      res.sendFile(__dirname + '/frontend/index.html');
    });

    // Authentication routes
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    app.get('/auth/google/callback', passport.authenticate('google', {
      successRedirect: '/profile?login=success',
      failureRedirect: '/login'
    }));

    app.get('/profile', (req, res) => {
      if (req.isAuthenticated()) {
        res.sendFile(__dirname + '/frontend/index.html');
      } else {
        res.send('Not authenticated');
      }
    });

    app.get('/login', (req, res) => {
      res.sendFile(__dirname + '/frontend/login.html');
    });

    app.get('/dev', (req, res) => {
      res.sendFile('Hello from dev!');
    });

    // API routes using MongoDB
    // app.get('/api/users', async (req, res) => {
    //   try {
    //     const users = await getDb().collection('users').find({}).toArray();
    //     res.json(users);
    //   } catch (error) {
    //     console.error('Error fetching users:', error);
    //     res.status(500).json({ error: 'Failed to fetch users' });
    //   }
    // });

    // app.post('/api/users', async (req, res) => {
    //   try {
    //     const newUser = req.body;
    //     const result = await getDb().collection('users').insertOne(newUser);
    //     res.status(201).json({
    //       message: 'User created successfully',
    //       userId: result.insertedId
    //     });
    //   } catch (error) {
    //     console.error('Error creating user:', error);
    //     res.status(500).json({ error: 'Failed to create user' });
    //   }
    // });

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Handle application shutdown
    // process.on('SIGINT', async () => {
    //   await closeConnection();
    //   process.exit(0);
    // });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}


// Start the application
startServer();
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/Route.js';
import SocketHandler from './SocketHandler.js';

// config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS configuration for Express
const corsOptions = {
    origin: 'https://sociale-x-new.vercel.app', // Frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Add OPTIONS for preflight
    allowedHeaders: ["Content-Type", "Authorization"], // Add custom headers if needed
    credentials: true, // Allow credentials
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions)); // Apply CORS with options
app.options('*', cors(corsOptions)); // Enable preflight requests for all routes
app.use(express.json());
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));

// Routes
app.use('', authRoutes);

// Create HTTP server
const server = http.createServer(app);

// Socket.IO setup with CORS
const io = new Server(server, {
    cors: {
        origin: 'https://sociale-x-new.vercel.app',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Ensure OPTIONS is included
        allowedHeaders: ["Content-Type", "Authorization"], // Ensure headers match frontend
        credentials: true
    },
    path: '/socket.io/' // Explicitly set path
});

// Handle Socket.IO connections
io.on("connection", (socket) => {
    console.log("User connected");

    SocketHandler(socket);
});

// Mongoose setup and server start
const PORT = 6001;

mongoose.connect('mongodb://localhost:27017/socialeX', { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    server.listen(PORT, () => {
        console.log(`Running @ ${PORT}`);
    });
}).catch((e) => console.log(`Error in DB connection ${e}`));

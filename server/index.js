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

const corsOptions = {
    origin: 'https://sociale-x-new.vercel.app', // Frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ["Content-Type", "Authorization"], // Add custom headers if needed
    credentials: true // Allow credentials
};


app.use(express.json());

app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors(corsOptions));


app.use('', authRoutes);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'https://sociale-x-new.vercel.app',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    }
});

io.on("connection", (socket) =>{
    console.log("User connected");

    SocketHandler(socket);
})

// mongoose setup

const PORT = 6001;

mongoose.connect('mongodb://localhost:27017/socialeX', { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(()=>{

        server.listen(PORT, ()=>{
            console.log(`Running @ ${PORT}`);
        });
    }
).catch((e)=> console.log(`Error in db connection ${e}`));

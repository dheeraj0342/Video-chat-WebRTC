import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

import serverConfig from './config/server.config';
import { roomHandler } from './room';

const app = express();

app.use(cors());


const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection',(socket)=>{
    console.log('User connected');

    roomHandler(socket);

    socket.on('disconnect',()=>{
        console.log('User disconnected');
    });
});


server.listen(serverConfig.PORT, () => {
    console.log(`Server is running on port ${serverConfig.PORT}`);
});


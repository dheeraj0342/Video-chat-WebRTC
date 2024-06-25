import { Socket } from "socket.io";
import {v4 as uuidv4} from 'uuid';

const rooms:Record<string,string[]> = {};

interface IRoomParams{
    roomId:string;
    peerId : string;
}

export const roomHandler= (socket:Socket) => {
    const createRoom = () =>{
        const roomId = uuidv4();
        rooms[roomId] =[];
        socket.emit('room-created',{roomId});
    };
    const joinRoom = ({roomId,peerId}:IRoomParams) =>{
        if(rooms[roomId]){
            console.log(`New User:${peerId} joined room:${roomId}`);
            rooms[roomId].push(peerId);
            socket.join(roomId);
            socket.to(roomId).emit('user-joined',{peerId});
            socket.emit('get-users',{
                roomId,
                participants:rooms[roomId]
            });


            socket.on('disconnect',()=>{
                console.log("user left the room",peerId);
                rooms[roomId] = rooms[roomId].filter((id)=> id !==peerId);
                socket.to(roomId).emit("user-disconnected",peerId);
            });
        }



    };


    socket.on('create-room', createRoom);
    socket.on('join-room', joinRoom);
};
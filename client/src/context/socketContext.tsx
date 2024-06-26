import SocketIoClient from 'socket.io-client';
import { createContext, useEffect, useState ,useReducer} from 'react';
import { useNavigate } from 'react-router-dom';
import {v4 as uuidV4} from 'uuid';
import Peer, { DataConnection } from 'peerjs';
import { peerReducer } from './peerReducer';
import { addPeerAction, removePeerAction } from './peerActions';



const ws_server = 'http://localhost:5500';

const ws = SocketIoClient(ws_server);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SocketContext = createContext<null | any>(null);

interface SocketProviderProps {
    children: React.ReactNode;
}

interface Connection {
    [id:string]:DataConnection;
}

export const SocketProvider : React.FC<SocketProviderProps> = ({ children }) => {

    const[me , setMe] = useState<Peer>();
    const [stream , setStream] = useState<MediaStream>();
    const navigate = useNavigate();
    const [peers,dispatch] = useReducer(peerReducer,{});
    const [screenShareId, setScreenShareId] = useState<string | null>(null);
    const [connections, setConnections] = useState<Connection>({});


        // Function to add a connection
    const addConnection = (id:string, connection:DataConnection) => {
        setConnections(prev => ({ ...prev, [id]: connection }));
    };

    // Function to remove a connection
    const removeConnection = (id:string) => {
        setConnections(prev => {
            const newState = { ...prev };
            delete newState[id];
            return newState;
        });
    };

    const enterRoom = ({roomId}:{roomId:string}) => {
        console.log('Room created with id:',roomId);
        navigate(`/room/${roomId}`);
    }

    const getUsers = ({roomId,participants}:{roomId:string,participants:string[]}) =>{
        console.log({
            roomId,
            participants
        })
    }

    const handleSwitchScreen = (stream:MediaStream) => {
        setStream(stream);
        setScreenShareId(me?.id|| "");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Object.values(connections).forEach((conn:any) => {
            const videotrack = stream.getTracks().find(track => track.kind === 'video');
            if(videotrack){
                 conn[0].peerConnection?.getSenders()[1].replaceTrack(videotrack);
            }
        
            
    })
    }

    const handleShareScreen = () => {
        if(screenShareId){
            navigator.mediaDevices.getUserMedia({video:true,audio:true}).then(handleSwitchScreen);
        }
        else{
            navigator.mediaDevices.getDisplayMedia({}).then(handleSwitchScreen);
        }
       
    }

    
    useEffect(() => {
        const meId = uuidV4();
        const peer = new Peer(meId);
        setMe(peer)

        peer.on('connection', (conn) => {
            // Add connection to state
            addConnection(conn.peer, conn);
    
            // Example of handling disconnection
            conn.on('close', () => {
                removeConnection(conn.peer);
            });
        });

        try {
            navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((stream)=>[
                setStream(stream)
            ]);
        } catch (error) {
            console.log(error);
            
        }

        const removePeer=(peerId:string) =>{
            dispatch(removePeerAction(peerId));
        }

        ws.on('room-created',enterRoom)
        ws.on('get-users',getUsers);
        ws.on('user-disconnected',removePeer);
    }, []);


    useEffect(()=>{
        if(!me) return;
        if(!stream) return;

        ws.on('user-joined',({peerId})=>{
            const call =me.call(peerId,stream)
            call.on('stream',(peerStream)=>{
                dispatch(addPeerAction(peerId,peerStream))
            })
        })

        me.on('call',(call)=>{
            call.answer(stream)
            call.on('stream',(peerStream)=>{
                dispatch(addPeerAction(call.peer,peerStream))
            })
        })

    },[me,stream])

    return (
        <SocketContext.Provider value={{ws,me,stream,peers,handleShareScreen}}>
        {children}
        </SocketContext.Provider>
    );
}



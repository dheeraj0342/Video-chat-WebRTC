import SocketIoClient from 'socket.io-client';
import { createContext } from 'react';

const ws_server = 'http://localhost:5500';

const socket = SocketIoClient(ws_server);

const SocketContext = createContext<any | null>(null);

interface SocketProviderProps {
    children: React.ReactNode;
}


export const SocketProvider : React.FC<SocketProviderProps> = ({ children }) => {
    return (
        <SocketContext.Provider value={socket}>
        {children}
        </SocketContext.Provider>
    );
    }



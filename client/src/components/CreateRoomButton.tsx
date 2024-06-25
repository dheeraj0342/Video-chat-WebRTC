import { useContext } from "react"
import { SocketContext } from "../context/SocketContext"


const CreateRoomButton = () => {

    
const {ws} = useContext(SocketContext);


    const createRoom = () => {
        if (ws) {
           console.log('Creating room');
           ws.emit('create-room');
        } else {
           console.error('WebSocket is not initialized.');
        }
     }

  return (
    <>
        <button className=' rounded-lg py-2 px-5 bg-blue-400 text-white hover:bg-blue-500 font-bold hover:transition-all' onClick={createRoom}>start new meeting</button>
    </>
  )
}

export default CreateRoomButton
import { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import { SocketContext } from "../context/SocketContext";
import VideoPlayer from "../components/VideoPlayer";
import { PeerState } from "../context/peerReducer";
import ShareScreenButton from "../components/ShareScreenButton";

const Room = () => {
    const {roomId} = useParams()
    const {ws,me,stream,peers,handleShareScreen} = useContext(SocketContext);

    useEffect(() => {
      if(me){
        ws.emit('join-room',{roomId,peerId:me._id})
      }
    }, [roomId,ws,me])

  return (
    <>

      <div className="grid grid-cols-2 ">
      
      <VideoPlayer stream={stream}/>
      {Object.values(peers as PeerState).map(peer => (
        <VideoPlayer stream ={peer.stream}/>
      ))}

    
     </div>
      <div className="fixed bottom-0 w-full flex justify-center p-4 border-t-2"> 
        <ShareScreenButton onClick={handleShareScreen}/>
      </div>
    </>
      
  )
}

export default Room
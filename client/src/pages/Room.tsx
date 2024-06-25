import { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import { SocketContext } from "../context/SocketContext";
import VideoPlayer from "../components/VideoPlayer";
import { PeerState } from "../context/peerReducer";

const Room = () => {
    const {roomId} = useParams()
    const {ws,me,stream,peers} = useContext(SocketContext);

    useEffect(() => {
      if(me){
        ws.emit('join-room',{roomId,peerId:me._id})
      }
    }, [roomId,ws,me])

  return (
      <div className="grid grid-cols-2 ">
    
      <VideoPlayer stream={stream}/>
      {Object.values(peers as PeerState ).map(peer => (
        <VideoPlayer stream ={peer.stream}/>
      ))}

    
    </div>
  )
}

export default Room
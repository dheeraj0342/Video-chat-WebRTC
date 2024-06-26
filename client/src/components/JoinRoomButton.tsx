import React from 'react'
import { useNavigate } from 'react-router-dom';

const JoinRoomButton = () => {

    const navigate = useNavigate();

    const [roomId, setRoomId] = React.useState('')
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setRoomId(e.target.value)
    }
    const handleClick = () => {
        navigate(`/room/${roomId}`)
    }

  return (
    <div className='flex gap-4'>
        <input onChange={handleChange} placeholder='Room Id' className='p-2 rounded-lg'/>
        <button className=' rounded-lg py-2 px-5 bg-blue-400 text-white hover:bg-blue-500 font-bold hover:transition-all' onClick={handleClick} >Join Meeting</button>
    </div>
  )
}

export default JoinRoomButton
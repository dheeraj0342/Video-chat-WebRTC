import CreateRoomButton from '../components/CreateRoomButton'
import JoinRoomButton from '../components/JoinRoomButton'

const Home = () => {
  return (
    
    <div className="flex justify-center items-center h-screen w-screen flex-col gap-10">
      <CreateRoomButton />
      <JoinRoomButton/>
    </div>
  )
}

export default Home
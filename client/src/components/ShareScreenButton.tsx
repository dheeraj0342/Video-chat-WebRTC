import { LuScreenShare } from "react-icons/lu";

const ShareScreenButton:React.FC<{onClick:()=> void}> = ({onClick}) => {
  return (
    <div className="bg-blue-400 w-12 h-10 text-white rounded-sm p-1">
        <LuScreenShare className='text-4xl' onClick={onClick}/>
    </div>
  )
}

export default ShareScreenButton
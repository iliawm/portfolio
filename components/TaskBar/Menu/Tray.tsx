import { IoIosArrowUp } from "react-icons/io";

const Tray = ({tray}:{tray:boolean}) => {
  return (
    <div className="flex justify-center  h-full">
      <div className={`absolute w-24 h-fit flex-wrap p-3 bg-[#1a1a1a] bottom-16 ${tray?"hidden":"flex"}`}>
        
        
        </div>  
    <div className={` transition-all flex items-center px-2 ease-in-out duration-400 hover:bg-gray-600 h-full`}>
        <div className={`${tray?"rotate-180":""}  transition-all duration-200 `}>
        <IoIosArrowUp />
        </div>
    </div>
  </div>
  )
}

export default Tray
"use client"

import Image from "next/image"
import { useState } from "react"

const TaskBar = () => {
    const [Menu,SetMenu]= useState(false)
  return (
    <section className='w-full h-15 bg-white fixed bottom-0 flex justify-center items-center py-3'>
        
            <div className={`absolute w-170 h-250 bg-white transition-all  ${Menu?"opacity-100":"translate-y-full pointer-events-none"}`}>
                
            </div>
           
        <button className="cursor-pointer w-12 h-full relative  bg-gray-100 rounded-xl hover:scale-[1.1] active:scale-[1]" onClick={()=>{
            SetMenu(!Menu)
        }}>
            
            <Image alt="winbtn" fill loading="eager" src={'/buttons/windbtn.png'} className="w-full h-full"/>
            
        </button>
    </section>
  )
}

export default TaskBar
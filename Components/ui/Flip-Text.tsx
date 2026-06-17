"use client"
import TrueFocus from '@/components/TrueFocus'


const FlipText = ({ text }: { text: string[] }) => {


  return (
    <div className="flex flex-col relative  gap-10 h-fit px-3">
        {text.map((e,index)=>{
            return(
                <div key={index} className="h-fit flip text-indigo-700" >
                {e}
                </div>
            )
        })}
        <div className='lg:flex items-center text-white gap-5 hidden'>
        
        <TrueFocus
            sentence=" also known as Iliawm"
            manualMode={false}
            blurAmount={5}
            borderColor="#5227FF"
            animationDuration={0.3}
            pauseBetweenAnimations={0.5}
            />
        
        </div>
    </div>
  )
}

export default FlipText       
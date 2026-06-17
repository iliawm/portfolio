import React from 'react'
import FlipText from './ui/Flip-Text'
import Antigravity from '@/components/Antigravity'
import TypeEffect from './TypeEffect'
import Introduction from './ui/Introduction'

const Shardone = () => {
    const Names = ["Psychowm"]



  return (
    <div className='flex  w-full h-full relative flex-col'>
        <div className='absolute w-full h-full background opacity-60 z-30'>
          <Antigravity
            count={300}
            magnetRadius={6}
            ringRadius={7}
            waveSpeed={0.4}
            waveAmplitude={1}
            particleSize={1.5}
            lerpSpeed={0.05}
            color="#5227FF"
            autoAnimate
            particleVariance={1}
            rotationSpeed={0}
            depthFactor={1}
            pulseSpeed={3}
            particleShape="capsule"
            fieldStrength={10}
        />
        </div>
        <div className='m-top-comp relative lg:text-6xl text-5xl flex items-center p-20 justify-start z-10'>
            <TypeEffect/>
        </div>
        <div className=' w-full relative h-fit flex   px-10 gap-10 flex-col md:flex-row'>
            <div className=' flex items-center  h-fit relative md:py-20 w-full justify-center z-10'>
            
                    <h1 className='mid-comp flex lg:gap-5 gap-3 text-white lg:text-6xl text-3xl relative pl-10 lg:pl-0 text-nowrap h-fit'>
                        Hi I`m 
                        <div >
                        <FlipText text={Names}/>
                        </div>
                    </h1>
                    <div className='right-comp'>

                    </div>
            </div>
            <div className='w-full justify-center md:justify-end flex relative z-40'>
                <Introduction/>
            </div>
        </div>
       
    </div>
  )
}

export default Shardone
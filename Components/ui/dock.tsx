"use client"
import { FaGithub, FaLinkedin, FaPhone } from 'react-icons/fa'
import { MdMonitor } from 'react-icons/md'
import Dock from '@/components/Dock'


const DockComponent = () => {  
    const items = [
        { 
            icon: <FaGithub size={18} />, 
            label: 'GitHub', 
            onClick: () => window.open('https://github.com/iliawm', '_blank') 
        },
        { 
            icon: <FaLinkedin size={18} />, 
            label: 'LinkedIn', 
            onClick: () => window.open('https://linkedin.com/in/psychowm', '_blank') 
        },
        { 
            icon: <MdMonitor size={18} />, 
            label: 'Portfolio', 
            // onClick: () => window.open('https://your-portfolio.com', '_blank') 
        },
        { 
            icon: <FaPhone size={18} />, 
            label: 'Contact', 
            // onClick: () => alert('Contact me at: your@email.com') 
        },
    ]

    return (
        <div className='sticky z-50 bottom-0 w-full h-fit '>
        <Dock 
            items={items}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
            className='text-white justify-start flex'
        />
    </div>
    )
}

export default DockComponent
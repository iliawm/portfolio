"use client"
import ProfileCard from '@/components/ProfileCard'

const Introduction = () => {
  return (
    <div className='w-fit h-fit'>
        <ProfileCard
            name="Ilia.B"
            title="FrontEnd Developer"
            handle="Iliawm"
            status="Online"
            contactText="Contact Me"
            avatarUrl="/Me.jpg"
            showUserInfo={true}
            enableTilt={true}
            enableMobileTilt={true}
            onContactClick={() => window.open("https://www.linkedin.com/in/psychowm", "_blank")}
            behindGlowColor="rgba(125, 190, 255, 0.67)"
            behindGlowSize={300}             
            miniAvatarUrl="/Me.jpg"          
            iconUrl="/icon.jpg"
            behindGlowEnabled={true}
            innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
            className=''
        />
    </div>
  )
}

export default Introduction
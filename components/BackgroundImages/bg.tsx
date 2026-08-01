
import Image from "next/image";

const Bg = () => {
  let bg;
  return (
    <Image src={`${bg? bg : "/Bg-images/ThemeOne.jpg"}`} fill alt="bg" className="-z-10"/>
  )
}

export default Bg
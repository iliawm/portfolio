
import Image from "next/image";

const Bg = () => {
  let bg;
  return (
    <Image src={`${bg? bg : "/Bg-images/ThemeOne.jpg"}`} fill alt="bg" className="-z-10 object-cover" loading="eager" sizes="auto"/>
  )
}

export default Bg
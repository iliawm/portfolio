import { Environment, Lightformer, SpotLight } from "@react-three/drei"


const Light = () => {
  return (
    <group name="lights">
        <Environment resolution={256}>
            <group>
                <Lightformer 
                form={"rect"}
                position={[-5,5,-2]}
                scale={10}
                rotation-y={Math.PI/2}
                intensity={1.2}
                />
                <Lightformer 
                form={"rect"}
                position={[2,3,0]}
                scale={15}
                rotation-y={Math.PI/2}
                intensity={1}
                />
               
                
            </group>
        </Environment>
        <SpotLight 
        position={[1,4,-1]}
        angle={0.15}
        decay={0}
        intensity={0.1}
               />
    </group>
  )
}

export default Light
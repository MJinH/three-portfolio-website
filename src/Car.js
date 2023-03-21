import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei/core';
import Ground from './Ground';


function CarShow() {
    return (
      <>
        <OrbitControls />
        <PerspectiveCamera makeDefault fov={50} position={[3,2,5]} />
  
  
        <color args={[0, 0, 0]} attach="background" />
  
  
        <spotLight 
          color={[1, 0.25, 0.7]}
          intensity={1.5}
          angle={0.6}
          penumbra={0.5}
          position={[5,5,0]}
          castShadow
          shadow-bias={-0.0001}
        />
  
        <spotLight
          color={[0.14,0.5,1]}
          intensity={2}
          angle={6}
          penumbra={0.5}
          castShadow
          shadow-bias={-0.0001}
        />
        {/* <mesh>
          <boxGeometry args={[1,1,1]} />
          <meshBasicMaterial color={"red"} />
        </mesh> */}
  
        <Ground />
      </>
    )
  }
  

export default function Car({setNum}) {
  return (
    <Suspense fallback={null}>
        <div className='btn'>
            <button onClick={() => setNum(1)}>click</button>
        </div>
        <Canvas shadows>
            <CarShow />
        </Canvas>
  </Suspense>
  )
}

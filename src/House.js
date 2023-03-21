import React, { useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense } from 'react'
import { PerspectiveCamera } from '@react-three/drei/core'
import { useGLTF } from '@react-three/drei/core'
import gsap from 'gsap'
import CanvasLoader from './Loader'
import { useDispatch } from 'react-redux'
import { setPage } from './pageSlice'
import { useProgress } from '@react-three/drei/core'
function HouseShow() {

    const gltf = useGLTF("models/chair.glb")
    // const { nodes } = useGLTF(process.env.PUBLIC_URL + "models/house.glb")
    // console.log(nodes)
    const [mesh, setMesh] = useState(null)
    const [curPage, setCurPage] = useState(0)

    useEffect(() => {

        const height = document.getElementById('root')
        const divHeight = document.getElementById('sections')
        const setSection = () => {
            const page = Math.round(divHeight.scrollTop / divHeight.offsetHeight)
            setCurPage(page)
        }

        divHeight.addEventListener('scroll' , setSection, true)

        return () => {
            divHeight.removeEventListener('scroll', setSection, true)
        }
    }, [])


    useEffect(() => {
        if (gltf && !mesh) {
            const positions = [-5, 20, 7, 10, -10, 0, 10, -10, -5, -20]
            let meshArr = [];
            for (let i = 0; i < positions.length; i += 2) {
                const object= gltf.scene.clone()
                object.children[0].castShadow = true
                object.children[0].position.x = positions[i]
                object.children[0].position.y = 0
                object.children[0].position.z = positions[i + 1]
                object.children[0].scale.set(2,2,2)
                meshArr.push(object)
            }
            setMesh(meshArr)
            
        }

    }, [gltf])


    useFrame(({ camera }) => {
        if (mesh) {
        gsap.to(
            camera.position, 
            {
                duration: 1,
                x: mesh[curPage].children[0].position.x,
                z: mesh[curPage].children[0].position.z + 8,
            }
        )
        }
    })

    return (
        <>
            {/* <OrbitControls /> */}
            <PerspectiveCamera makeDefault position={[-5, 2, 28]} /> 

            <ambientLight 
                color={'white'}
                intensity={0.5}
            />

            <spotLight
                color={'white'}
                intensity={0.7}
                position={[0, 150, 100]}
                castShadow
            />

            <mesh rotation-x={-Math.PI * 0.5} receiveShadow>
                <planeGeometry args={[100,100]} />
                <meshStandardMaterial color={'white'} />
            </mesh>
            {mesh && mesh.map((item) => (
                <primitive object={item} />
            ))}
        </>
    )
}


export default function House() {

  const dispatch = useDispatch()
  const { progress } = useProgress()
  return (
    <>
      <div className='btn'>
            <button onClick={() => dispatch(setPage({ page: 2 }))}>Back</button>
        </div>
        <div className='sections' id='sections'>
            <section className='section'>01</section>
            <section className='section'>02</section>
            <section className='section'>03</section>
            <section className='section'>04</section>
            <section className='section'>05</section>
        </div>
        <Canvas 
          className='three-canvas' id='three-canvas'
          dpr={[1, 2]}
          gl={{ preserveDrawingBuffer: true }}
        >
            <Suspense fallback={<CanvasLoader progress={progress}/>}>
                <HouseShow />
            </Suspense>
        </Canvas>
    </>
  )
}

import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Suspense } from 'react'
import { useVideoTexture } from '@react-three/drei/core'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import CanvasLoader from './Loader'
import { setPage } from './pageSlice'
import { useDispatch } from 'react-redux'
import { useProgress } from '@react-three/drei/core'

function ThreeShow() {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [controls, setControls] = useState(null)
    const [key, setKey] = useState([])
    const [isPressed, setIsPressed] = useState(false)
    const [pointer, setPointer] = useState(new THREE.Vector2())
    const root = document.getElementById('root')
    const rayCaster = new THREE.Raycaster()

    const scrollVideoTexture = useVideoTexture("images/scroll.mp4")
    const sunVideoTexture = useVideoTexture("images/sun.mp4")

    const gallery = useLoader(GLTFLoader, "models/gallery.glb")

    const scrollRef = useRef()

    useEffect(() => {
        if (gallery) {  
            setLoading(false)
        }   
    }, [gallery])

    useEffect(() => {
        if (controls) {

            const handleClick = () => {
                controls.lock()
            }

            const handleLock = () => {
                console.log('lock')
            }

            const handleUnlock = () => {
                console.log('unlock')
            }

            controls.domElement.addEventListener('click', handleClick, true)
            controls.addEventListener('lock', handleLock, true)
            controls.addEventListener('unlock', handleUnlock, true)
            return () => {
                controls.domElement.removeEventListener('click', handleClick, true)
                controls.removeEventListener('lock', handleLock, true)
                controls.removeEventListener('unlock', handleUnlock, true)
            }
        }
        
    }, [controls])

    const checkInterSect = (camera, scene) => {
        rayCaster.setFromCamera(pointer, camera)

        const intersects = rayCaster.intersectObjects([scrollRef.current])
        for (const item of intersects) {
            if (item.object.name === 'scroll') {
                dispatch(setPage({ page: 3 }))
                return
            }
        }
    }

    const onPointerMove = (e) => {
        pointer.x = (e.clientX / root.offsetWidth) * 2 - 1
        pointer.y = -(e.clientY / root.offsetHeight) * 2 + 1
        setPointer(pointer)
    }

    root.addEventListener('mousedown', e => {
        setIsPressed(true)
        onPointerMove(e)
    }, true)
    
    root.addEventListener('mouseup', () => {
        setIsPressed(false)
    }, true)

    window.addEventListener('keydown', e => {
        key[e.code] = true
        setKey(key)
    }, true)

    window.addEventListener('keyup', e => {
        delete key[e.code]
        setKey(key)
    }, true)
    
    useFrame((state, delta) => {
        if (!controls) {
            state.camera.position.set(-1, 1, -0.3)
            state.camera.rotation.y = -Math.PI / 2
            setControls(new PointerLockControls(state.camera, state.gl.domElement))
        }

        if (isPressed) {
            checkInterSect(state.camera, state.scene)
        }

        if (controls) {
            const controlPosition = controls.getObject().position
            if (controlPosition.x < -3.3) {
                state.camera.position.x += 0.0003
            } 
            else if (controlPosition.z < -7.8) {
                state.camera.position.z += 0.0003
            }
            else if (controlPosition.x > 12.5) {
                state.camera.position.x -= 0.0003
            }
            else if (controlPosition.z > 7.9) {
                state.camera.position.z -= 0.0003
            }
            else {
                if (key['KeyW'] || key['ArrowUp']) {
                    controls.moveForward(delta / 0.35)
                }
                if (key['KeyS'] || key['ArrowDown']) {
                    controls.moveForward(delta / -0.35)
                }
                if (key['KeyA'] || key['ArrowLeft']) {
                    controls.moveRight(delta / -0.35)
                }
                if (key['KeyD'] || key['ArrowRight']) {
                    controls.moveRight(delta / 0.35)
                }
            }
        }
    })

    return (
        <>
            {!loading && <>

                <ambientLight 
                    color={'white'}
                    intensity={0.7}
                /> 

                <directionalLight
                    color={'white'}
                    intensity={0.5}
                    castShadow
                    position={[1,1,1]}
                />

                <mesh position={[1,1.005,-5.67]} name={"scroll"} ref={scrollRef}>
                    <planeGeometry args={[5.1,2.95]} />
                    <meshBasicMaterial  map={scrollVideoTexture} toneMapped={false} />
                </mesh>

                <mesh position={[8.15,1.15,-5.67]} name={"sun"}>
                    <planeGeometry args={[5.1,2.7]} />
                    <meshBasicMaterial  map={sunVideoTexture} toneMapped={false} />
                </mesh>

                <primitive object={gallery.scene} />

            </>}
        </>
    )
}

export default function ThreeGallery() {

  const dispatch = useDispatch()  
  const { progress } = useProgress();
  return (
    <>
    <div className='key-control'>

        <div className='key-top'>
            <div>
                <span>W</span>
            </div>
        </div>
        <div className='key-bottom'>
            <div>
                <span>A</span>
            </div>
            <div>
                <span>S</span>
            </div>
            <div>
                <span>D</span>
            </div>
        </div>
        <div className='gallery-back'>
            <button onClick={() => dispatch(setPage({ page: 1 }))}>Back</button>
        </div>
    </div>
    <Canvas
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
    >
        <Suspense fallback={<CanvasLoader progress={progress}/>}>
            <ThreeShow />
        </Suspense>
    </Canvas>
    </>
  )
}

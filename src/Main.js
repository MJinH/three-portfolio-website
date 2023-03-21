import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Suspense } from 'react'
import { OrthographicCamera, useTexture, useAnimations, Preload } from '@react-three/drei/core'
import gsap from 'gsap'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import CanvasLoader from './Loader'
import { useDispatch } from 'react-redux'
import { setPage } from './pageSlice'
import { useProgress } from '@react-three/drei/core'

function MainShow() {

    const dispatch = useDispatch()
    const [loading ,setLoading] = useState(true)
    const [isPressed, setIsPressed] = useState(false)
    const [isMoving, setIsMoving] = useState(false)
    const [pointer, setPointer] = useState(new THREE.Vector2())
    const [width, setWidth] = useState(window.innerWidth)
    const [height, setHeight] = useState(window.innerHeight)
    const [github, setGithub] = useState(false)
    const [linkedIn, setLinedIn] = useState(false)

    const ref = useRef()
    const cameraRef = useRef()
    const houseRef = useRef()
    const circleRef = useRef()
    const floorRef = useRef()
    const lightRef = useRef()
    const githubRef = useRef()
    const githubFloorRef = useRef()
    const linkedinRef = useRef()
    const linkedinFloorRef = useRef()
    const root = document.getElementById('root')

    const rayCaster = new THREE.Raycaster()

    const [ilbunMap, houseMap] = useLoader(GLTFLoader, [
        "models/cat.glb",
        "models/gallery.glb",
    ])
    // process.env.PUBLIC_URL + 
    const [normal, gitHub, linkedin] = useTexture(["images/floor.jpg","images/GitHub.png", "images/linkedin.png"], ([t1, t2, t3]) => {
        t1.wrapS = THREE.RepeatWrapping
        t1.wrapT = THREE.RepeatWrapping
        t2.wrapS = THREE.RepeatWrapping
        t2.wrapT = THREE.RepeatWrapping
        t3.wrapS = THREE.RepeatWrapping
        t3.wrapT = THREE.RepeatWrapping
        t1.repeat.x = 10
        t1.repeat.y = 10
    })

    const { actions } = useAnimations(ilbunMap.animations, ilbunMap.scene)
    useEffect(() => {
        if (normal && ilbunMap && houseMap && actions && gitHub && linkedin) {
            ilbunMap.scene.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = true
                }
            })
            houseMap.scene.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = true
                }
            })
            ilbunMap.scene.children[0].position.set(0, 0, 0)
            ilbunMap.scene.children[0].scale.set(0.004,0.004,0.004)
            houseMap.scene.children[0].position.set(4.5,-2,-5)
            houseMap.scene.children[0].scale.set(0.003,0.003,0.003)
            actions.Idle.play()
            setLoading(false)
        }     
    }, [normal,ilbunMap,houseMap,actions,gitHub,linkedin])

    useEffect(() => {
        if (cameraRef.current) {
            cameraRef.current.left = -(width / height);
            cameraRef.current.right = width / height;
            cameraRef.current.top = 1;
            cameraRef.current.bottom = -1;
            cameraRef.current.updateProjectionMatrix();
        }
    }, [cameraRef])

    useEffect(() => {
        if (github) {
            window.open('https://github.com/MJinH?tab=repositories')
        }
        if (linkedIn) {
            window.open('https://www.linkedin.com/in/jinhyuk-moon-61214422a/')
        }
    }, [github, linkedIn])
 
    const onPointerMove = (e) => {
        pointer.x = (e.clientX / root.offsetWidth) * 2 - 1
        pointer.y = -(e.clientY / root.offsetHeight) * 2 + 1
        setPointer(pointer)
    }

    const checkInterSect = (camera) => {
        rayCaster.setFromCamera(pointer, camera)

        const intersects = rayCaster.intersectObjects([floorRef.current])
        for (const item of intersects) {
            if (item.object.name === 'floor') {
                circleRef.current.position.x = intersects[0].point.x
                circleRef.current.position.z = intersects[0].point.z
                ref.current.lookAt(circleRef.current.position)
                setIsMoving(true)
            }
            break
        }
    }

    const handleResize = () => {
        if (cameraRef.current) {
            cameraRef.current.left = -(width / height);
            cameraRef.current.right = width / height;
            cameraRef.current.top = 1;
            cameraRef.current.bottom = -1;
            cameraRef.current.updateProjectionMatrix();
        }
    }

    
    root.addEventListener('mousedown', e => {
        setIsPressed(true)
        onPointerMove(e)
    }, true)
    
    root.addEventListener('mouseup', () => {
        setIsPressed(false)
    }, true)
    
    root.addEventListener('mousemove', e => {
        if (isPressed) {
            onPointerMove(e)
        }
    }, true)
    
    window.addEventListener('resize', handleResize, true)

    useFrame((state, delta) => {
        if (ref.current) {
            state.camera.lookAt(ref.current.position)
        }

        if (githubRef.current) {
            githubRef.current.rotation.y += delta / 1
        }

        if (linkedinRef.current) {
            linkedinRef.current.rotation.y += delta / 1
        }

        if (isPressed) {
            checkInterSect(state.camera, state.scene)
        }
        if (isMoving) {
            if(Math.abs(linkedinFloorRef.current.position.z - ref.current.position.z) < 0.7 && Math.abs(linkedinFloorRef.current.position.x - ref.current.position.x) < 0.7) {
                linkedinFloorRef.current.material.color.set('grey')
                setLinedIn(true)
                setIsPressed(false)
                setIsMoving(false)
                ref.current.position.z += 1.5
            } else {
                linkedinFloorRef.current.material.color.set('white')
                setLinedIn(false)
            }

            if(Math.abs(githubFloorRef.current.position.z - ref.current.position.z) < 0.7 && Math.abs(githubFloorRef.current.position.x - ref.current.position.x) < 0.7) {
                githubFloorRef.current.material.color.set('grey')
                setGithub(true)
                setIsPressed(false)
                setIsMoving(false)
                ref.current.position.z += 1.5
            } else {
                githubFloorRef.current.material.color.set('white')
                setGithub(false)
            }
            if (Math.abs(circleRef.current.position.z - ref.current.position.z) < 0.03 && Math.abs(circleRef.current.position.x - ref.current.position.x) < 0.03) {
                actions.Idle.stop()
                setIsMoving(false)
            } else {
                const angle = Math.atan2(
                    circleRef.current.position.z - ref.current.position.z,
                    circleRef.current.position.x - ref.current.position.x
                )
                ref.current.position.x += Math.cos(angle) * ( delta / 0.15)
                ref.current.position.z += Math.sin(angle) * ( delta / 0.15)
                state.camera.position.x = 1 + ref.current.position.x
                state.camera.position.z = 5 + ref.current.position.z
                
                actions.Idle.stop()
                actions.Run.play()
            }

            if (Math.abs(ref.current.position.z - houseRef.current.position.z) < 2 && Math.abs(ref.current.position.x - houseRef.current.position.x) < 2) {

                houseRef.current.material.color.set('grey')

                gsap.to(
                    houseMap.scene.children[0].position,
                    {
                        duration: 1,
                        y: 1,
                        ease: 'Bounce.easeOut'
                    }
                )
                gsap.to(
                    state.camera.position,
                    {
                        duration: 1,
                        y: 2.5,
                    }
                )
                if (Math.abs(ref.current.position.z - houseMap.scene.children[0].position.z) < 1.5 && Math.abs(ref.current.position.x - houseMap.scene.children[0].position.x) < 1.5) {
                    setIsPressed(false)
                    setIsMoving(false)
                    const cameraX = state.camera.position.x
                    const cameraY = state.camera.position.y
                    gsap.to(
                        state.camera.position,
                        {
                            duration: 2,
                            x: ref.current.position.x,
                            y: 1,
                        }
                    )
                    setTimeout(() => {
                        ref.current.position.z += 4
                        state.camera.position.x = cameraX
                        state.camera.position.y = cameraY
                        dispatch(setPage({ page: 2 }))
                    },2000)
                }

            } else {
                houseRef.current.material.color.set('white')
                gsap.to(
                    houseMap.scene.children[0].position,
                    {
                        duration: 1,
                        y: -2.5,
                    }
                )

                gsap.to(
                    state.camera.position,
                    {
                        duration: 1,
                        y: 5
                    }
                )
            }
        } else {
            actions.Run.stop()
            actions.Idle.play()
        }
        state.gl.shadowMap.enabled = true
    })

    return (
        <>
            {!loading &&  <>

            <OrthographicCamera makeDefault left={-(width / height)} right={width / height} top={1} bottom={-1} position={[1, 5, 5]} near={-1000} far={1000} zoom={0.2} ref={cameraRef} /> 


            <ambientLight 
                color={'white'}
                intensity={0.3}
            /> 

            <directionalLight
                color={'white'}
                intensity={0.5}
                castShadow
                position={[1,1,1]}
                ref={lightRef}
                shadow-mapSize-width={3200}
                shadow-mapSize-height={3200}
                shadow-camera-left={-100}
                shadow-camera-right={100}
                shadow-camera-top={100}
                shadow-camera-bottom={-100}
                shadow-camera-near={-100}
                shadow-camera-far={100}
            />
            <mesh rotation-x={-Math.PI * 0.5} receiveShadow position={[0,0,0]} name={'floor'} ref={floorRef}>
                <planeGeometry args={[30,30]} />
                <meshStandardMaterial map={normal} />
            </mesh>

            <mesh rotation-x={-Math.PI * 0.5} position={[0,0.0002,0]} ref={circleRef}>
                <planeGeometry args={[1,1]} />
                <meshStandardMaterial color='hotpink' transparent={true} opacity={0.5} />
            </mesh>

            <mesh rotation-x={-Math.PI * 0.5} position={[5,0.0001,-2.5]} ref={houseRef}>
                <planeGeometry args={[3,3]} />
                <meshStandardMaterial color='white' transparent={true} opacity={0.5} />
            </mesh>

            <mesh rotation-x={-Math.PI * 0.5} position={[-3,0.0001,3.5]} ref={githubFloorRef}>
                <planeGeometry args={[1.5,1.5]} />
                <meshStandardMaterial color='white' transparent={true} opacity={0.5} />
            </mesh>

            <mesh position={[-3,1.5,3.5]} ref={githubRef} >
                <boxGeometry args={[1,1,1]} />
                <meshBasicMaterial map={gitHub} color={'aliceblue'} />
            </mesh>

            <mesh rotation-x={-Math.PI * 0.5} position={[-5,0.0001,-5]} ref={linkedinFloorRef}>
                <planeGeometry args={[1.5,1.5]} />
                <meshStandardMaterial color='white' transparent={true} opacity={0.5} />
            </mesh>

            <mesh position={[-5,1.5,-5]} ref={linkedinRef} >
                <boxGeometry args={[1,1,1]} />
                <meshBasicMaterial map={linkedin} />
            </mesh>

            <primitive object={ilbunMap.scene} ref={ref} castShadow />
            <primitive object={houseMap.scene} castShadow />
            </>}
        </>
    )
}


export default function Main() {
  const { progress } = useProgress();
  return (
    <>
    <Canvas
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
    >
        <Suspense fallback={<CanvasLoader progress={progress} />}>
            <MainShow />
        </Suspense>
        <Preload all />
    </Canvas>
    </>
  )
}

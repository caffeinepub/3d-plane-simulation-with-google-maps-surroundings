import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ChaseCameraRig } from '../camera/ChaseCameraRig';
import { ProceduralWorld } from './ProceduralWorld';
import { useFlightControls } from '../controls/useFlightControls';
import { useSimpleFlightModel } from '../physics/useSimpleFlightModel';
import type { SimState } from '../state/types';

interface FlightSceneProps {
    simState: SimState;
    isRunning: boolean;
}

export function FlightScene({ simState, isRunning }: FlightSceneProps) {
    const planeRef = useRef<THREE.Group>(null);
    const controls = useFlightControls();
    const flightModel = useSimpleFlightModel(simState, controls, isRunning);

    useFrame((_, delta) => {
        if (!isRunning || !planeRef.current) return;

        const state = flightModel.update(delta);

        // Update plane position and rotation
        planeRef.current.position.set(state.position[0], state.position[1], state.position[2]);
        planeRef.current.rotation.set(state.rotation[0], state.rotation[1], state.rotation[2]);
    });

    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[100, 100, 50]} intensity={1.2} castShadow />
            <hemisphereLight args={['#87CEEB', '#8B7355', 0.5]} />

            {/* Plane */}
            <group ref={planeRef}>
                {/* Fuselage */}
                <mesh castShadow>
                    <cylinderGeometry args={[0.4, 0.4, 3, 16]} />
                    <meshStandardMaterial color="#e0e0e0" metalness={0.6} roughness={0.3} />
                </mesh>

                {/* Wings */}
                <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                    <boxGeometry args={[8, 0.1, 1.5]} />
                    <meshStandardMaterial color="#c0c0c0" metalness={0.5} roughness={0.4} />
                </mesh>

                {/* Tail */}
                <mesh position={[0, 0.8, -1.2]} rotation={[0, 0, 0]} castShadow>
                    <boxGeometry args={[2, 0.1, 0.8]} />
                    <meshStandardMaterial color="#c0c0c0" metalness={0.5} roughness={0.4} />
                </mesh>

                {/* Vertical stabilizer */}
                <mesh position={[0, 1, -1.2]} castShadow>
                    <boxGeometry args={[0.1, 1.2, 0.8]} />
                    <meshStandardMaterial color="#b0b0b0" metalness={0.5} roughness={0.4} />
                </mesh>

                {/* Nose cone */}
                <mesh position={[0, 0, 1.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                    <coneGeometry args={[0.4, 0.8, 16]} />
                    <meshStandardMaterial color="#d0d0d0" metalness={0.7} roughness={0.2} />
                </mesh>
            </group>

            {/* Procedural world with terrain and buildings */}
            <ProceduralWorld aircraftPosition={simState.position} seed={simState.worldSeed} />

            {/* Camera */}
            <ChaseCameraRig target={planeRef} />
        </>
    );
}

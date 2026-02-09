import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ChaseCameraRigProps {
    target: React.RefObject<THREE.Group | null>;
}

export function ChaseCameraRig({ target }: ChaseCameraRigProps) {
    const { camera } = useThree();
    const offsetRef = useRef(new THREE.Vector3(0, 3, -10));
    const lookAtRef = useRef(new THREE.Vector3());

    useFrame(() => {
        if (!target.current) return;

        const targetPos = target.current.position;
        const targetRot = target.current.rotation;

        // Calculate camera offset in world space
        const offset = new THREE.Vector3(0, 3, -10);
        offset.applyEuler(new THREE.Euler(0, targetRot.y, 0));

        // Desired camera position
        const desiredPos = new THREE.Vector3().copy(targetPos).add(offset);

        // Smooth camera movement
        camera.position.lerp(desiredPos, 0.1);

        // Look at point slightly ahead of the plane
        const lookAtOffset = new THREE.Vector3(0, 1, 5);
        lookAtOffset.applyEuler(new THREE.Euler(0, targetRot.y, 0));
        lookAtRef.current.copy(targetPos).add(lookAtOffset);

        camera.lookAt(lookAtRef.current);
    });

    return null;
}

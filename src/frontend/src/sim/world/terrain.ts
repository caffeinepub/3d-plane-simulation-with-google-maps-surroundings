import * as THREE from 'three';
import { fbm } from './noise';
import { SeededRandom, hashCoords } from './prng';

export interface TerrainChunk {
    key: string;
    mesh: THREE.Mesh;
    position: [number, number];
}

export interface TerrainConfig {
    chunkSize: number;
    resolution: number;
    heightScale: number;
    seed: number;
}

export function generateTerrainChunk(
    chunkX: number,
    chunkZ: number,
    config: TerrainConfig
): THREE.Mesh {
    const { chunkSize, resolution, heightScale, seed } = config;
    const geometry = new THREE.PlaneGeometry(chunkSize, chunkSize, resolution, resolution);
    
    const positions = geometry.attributes.position.array as Float32Array;
    const seedOffset = hashCoords(chunkX, chunkZ, seed);
    
    // Generate height map
    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i] + chunkX * chunkSize;
        const z = positions[i + 1] + chunkZ * chunkSize;
        
        // Use FBM for natural-looking terrain
        const noiseX = (x + seedOffset * 0.1) * 0.01;
        const noiseZ = (z + seedOffset * 0.1) * 0.01;
        const height = fbm(noiseX, noiseZ, 5, 0.5) * heightScale;
        
        positions[i + 2] = height;
    }
    
    geometry.computeVertexNormals();
    geometry.attributes.position.needsUpdate = true;
    
    // Create material with color variation based on height
    const material = new THREE.MeshStandardMaterial({
        color: '#4a7c59',
        roughness: 0.9,
        metalness: 0.1,
        flatShading: false,
        vertexColors: false,
    });
    
    // Add color variation
    const colors = new Float32Array(positions.length);
    for (let i = 0; i < positions.length; i += 3) {
        const height = positions[i + 2];
        const normalizedHeight = (height + heightScale * 0.5) / heightScale;
        
        // Color based on height: darker green at low, lighter/brown at high
        const r = 0.3 + normalizedHeight * 0.4;
        const g = 0.5 + normalizedHeight * 0.2;
        const b = 0.35 - normalizedHeight * 0.1;
        
        colors[i] = r;
        colors[i + 1] = g;
        colors[i + 2] = b;
    }
    
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    material.vertexColors = true;
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(chunkX * chunkSize, 0, chunkZ * chunkSize);
    mesh.receiveShadow = true;
    
    return mesh;
}

export function getChunkKey(chunkX: number, chunkZ: number): string {
    return `${chunkX},${chunkZ}`;
}

export function worldToChunk(worldX: number, worldZ: number, chunkSize: number): [number, number] {
    return [Math.floor(worldX / chunkSize), Math.floor(worldZ / chunkSize)];
}

export function getHeightAt(x: number, z: number, seed: number, heightScale: number): number {
    const noiseX = (x + seed * 0.1) * 0.01;
    const noiseZ = (z + seed * 0.1) * 0.01;
    return fbm(noiseX, noiseZ, 5, 0.5) * heightScale;
}

import * as THREE from 'three';
import { SeededRandom, hashCoords } from './prng';
import { getHeightAt } from './terrain';

export interface BuildingInstance {
    position: [number, number, number];
    scale: [number, number, number];
    rotation: number;
    color: string;
}

export interface BuildingConfig {
    seed: number;
    heightScale: number;
    spawnPosition: [number, number, number];
    exclusionRadius: number;
}

export function generateBuildingsForChunk(
    chunkX: number,
    chunkZ: number,
    chunkSize: number,
    config: BuildingConfig
): BuildingInstance[] {
    const { seed, heightScale, spawnPosition, exclusionRadius } = config;
    const buildings: BuildingInstance[] = [];
    
    const chunkSeed = hashCoords(chunkX, chunkZ, seed);
    const rng = new SeededRandom(chunkSeed);
    
    // Determine building density for this chunk (some chunks have more buildings)
    const density = rng.next();
    const buildingCount = density > 0.7 ? rng.int(3, 8) : density > 0.4 ? rng.int(1, 4) : 0;
    
    for (let i = 0; i < buildingCount; i++) {
        // Random position within chunk
        const localX = rng.range(0, chunkSize);
        const localZ = rng.range(0, chunkSize);
        const worldX = chunkX * chunkSize + localX;
        const worldZ = chunkZ * chunkSize + localZ;
        
        // Check exclusion radius around spawn
        const dx = worldX - spawnPosition[0];
        const dz = worldZ - spawnPosition[2];
        const distanceToSpawn = Math.sqrt(dx * dx + dz * dz);
        
        if (distanceToSpawn < exclusionRadius) {
            continue; // Skip buildings too close to spawn
        }
        
        // Get terrain height at this position
        const groundHeight = getHeightAt(worldX, worldZ, seed, heightScale);
        
        // Random building dimensions
        const width = rng.range(3, 8);
        const height = rng.range(8, 30);
        const depth = rng.range(3, 8);
        
        // Random rotation
        const rotation = rng.range(0, Math.PI * 2);
        
        // Random color (various building materials)
        const colorChoices = ['#a0a0a0', '#b0b0b0', '#8a8a8a', '#c0c0c0', '#909090'];
        const color = colorChoices[rng.int(0, colorChoices.length)];
        
        buildings.push({
            position: [worldX, groundHeight + height / 2, worldZ],
            scale: [width, height, depth],
            rotation,
            color,
        });
    }
    
    return buildings;
}

export function createBuildingMesh(building: BuildingInstance): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
        color: building.color,
        roughness: 0.7,
        metalness: 0.3,
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...building.position);
    mesh.scale.set(...building.scale);
    mesh.rotation.y = building.rotation;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    return mesh;
}

import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { generateTerrainChunk, getChunkKey, worldToChunk, type TerrainChunk } from '../world/terrain';
import { generateBuildingsForChunk, createBuildingMesh, type BuildingInstance } from '../world/buildings';

interface ProceduralWorldProps {
    aircraftPosition: [number, number, number];
    seed: number;
}

const CHUNK_SIZE = 200;
const RESOLUTION = 32;
const HEIGHT_SCALE = 30;
const RENDER_DISTANCE = 3; // chunks in each direction
const EXCLUSION_RADIUS = 100; // meters around spawn

export function ProceduralWorld({ aircraftPosition, seed }: ProceduralWorldProps) {
    const chunksRef = useRef<Map<string, TerrainChunk>>(new Map());
    const buildingsRef = useRef<Map<string, THREE.Mesh[]>>(new Map());
    const groupRef = useRef<THREE.Group>(null);
    const lastSeedRef = useRef(seed);
    const [, forceUpdate] = useState(0);

    // Clear all chunks when seed changes
    useEffect(() => {
        if (lastSeedRef.current !== seed) {
            // Dispose all existing chunks
            chunksRef.current.forEach((chunk) => {
                chunk.mesh.geometry.dispose();
                (chunk.mesh.material as THREE.Material).dispose();
                if (groupRef.current) {
                    groupRef.current.remove(chunk.mesh);
                }
            });
            chunksRef.current.clear();

            // Dispose all existing buildings
            buildingsRef.current.forEach((buildings) => {
                buildings.forEach((building) => {
                    building.geometry.dispose();
                    (building.material as THREE.Material).dispose();
                    if (groupRef.current) {
                        groupRef.current.remove(building);
                    }
                });
            });
            buildingsRef.current.clear();

            lastSeedRef.current = seed;
            forceUpdate((n) => n + 1);
        }
    }, [seed]);

    useFrame(() => {
        if (!groupRef.current) return;

        const [currentChunkX, currentChunkZ] = worldToChunk(
            aircraftPosition[0],
            aircraftPosition[2],
            CHUNK_SIZE
        );

        const neededChunks = new Set<string>();

        // Determine which chunks should be loaded
        for (let dx = -RENDER_DISTANCE; dx <= RENDER_DISTANCE; dx++) {
            for (let dz = -RENDER_DISTANCE; dz <= RENDER_DISTANCE; dz++) {
                const chunkX = currentChunkX + dx;
                const chunkZ = currentChunkZ + dz;
                const key = getChunkKey(chunkX, chunkZ);
                neededChunks.add(key);

                // Create chunk if it doesn't exist
                if (!chunksRef.current.has(key)) {
                    const mesh = generateTerrainChunk(chunkX, chunkZ, {
                        chunkSize: CHUNK_SIZE,
                        resolution: RESOLUTION,
                        heightScale: HEIGHT_SCALE,
                        seed,
                    });

                    const chunk: TerrainChunk = {
                        key,
                        mesh,
                        position: [chunkX, chunkZ],
                    };

                    chunksRef.current.set(key, chunk);
                    groupRef.current.add(mesh);

                    // Generate buildings for this chunk
                    const buildings = generateBuildingsForChunk(chunkX, chunkZ, CHUNK_SIZE, {
                        seed,
                        heightScale: HEIGHT_SCALE,
                        spawnPosition: [0, 0, 0], // Initial spawn position
                        exclusionRadius: EXCLUSION_RADIUS,
                    });

                    const buildingMeshes = buildings.map((building) => {
                        const mesh = createBuildingMesh(building);
                        groupRef.current!.add(mesh);
                        return mesh;
                    });

                    buildingsRef.current.set(key, buildingMeshes);
                }
            }
        }

        // Remove chunks that are too far away
        const chunksToRemove: string[] = [];
        chunksRef.current.forEach((chunk, key) => {
            if (!neededChunks.has(key)) {
                chunksToRemove.push(key);
            }
        });

        chunksToRemove.forEach((key) => {
            const chunk = chunksRef.current.get(key);
            if (chunk) {
                chunk.mesh.geometry.dispose();
                (chunk.mesh.material as THREE.Material).dispose();
                groupRef.current!.remove(chunk.mesh);
                chunksRef.current.delete(key);
            }

            // Remove buildings
            const buildings = buildingsRef.current.get(key);
            if (buildings) {
                buildings.forEach((building) => {
                    building.geometry.dispose();
                    (building.material as THREE.Material).dispose();
                    groupRef.current!.remove(building);
                });
                buildingsRef.current.delete(key);
            }
        });
    });

    return <group ref={groupRef} />;
}

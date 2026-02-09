export interface SimState {
    position: [number, number, number]; // x, y, z in world space
    rotation: [number, number, number]; // pitch, roll, yaw in radians
    velocity: [number, number, number]; // velocity vector
    throttle: number; // 0-1
    speed: number; // m/s
    altitude: number; // meters
    heading: number; // degrees 0-360
    latitude: number;
    longitude: number;
    worldSeed: number; // Seed for procedural generation
}

import { useRef } from 'react';
import type { SimState } from '../state/types';
import type { FlightControls } from '../controls/useFlightControls';

const METERS_PER_DEGREE_LAT = 111320;
const PITCH_RATE = 0.8;
const ROLL_RATE = 1.2;
const YAW_RATE = 0.6;
const THROTTLE_RATE = 0.3;
const MIN_SPEED = 20;
const MAX_SPEED = 150;
const GRAVITY = 9.81;
const LIFT_COEFFICIENT = 0.15;

export function useSimpleFlightModel(
    initialState: SimState,
    controls: FlightControls,
    isRunning: boolean
) {
    const stateRef = useRef<SimState>(initialState);

    const update = (delta: number): SimState => {
        if (!isRunning) return stateRef.current;

        const state = stateRef.current;
        const dt = Math.min(delta, 0.1);

        // Update throttle
        let newThrottle = state.throttle + controls.throttle * THROTTLE_RATE * dt;
        newThrottle = Math.max(0, Math.min(1, newThrottle));

        // Update rotation based on controls
        let [pitch, roll, yaw] = state.rotation;
        pitch += controls.pitch * PITCH_RATE * dt;
        roll += controls.roll * ROLL_RATE * dt;
        yaw += controls.yaw * YAW_RATE * dt;

        // Limit pitch and roll
        pitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, pitch));
        roll = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, roll));

        // Calculate target speed based on throttle
        const targetSpeed = MIN_SPEED + (MAX_SPEED - MIN_SPEED) * newThrottle;
        let newSpeed = state.speed + (targetSpeed - state.speed) * 2 * dt;

        // Calculate lift and drag
        const speedFactor = newSpeed / MAX_SPEED;
        const lift = LIFT_COEFFICIENT * speedFactor * speedFactor;

        // Calculate velocity in world space
        const forward = [Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch)];

        const vx = forward[0] * newSpeed;
        const vy = forward[1] * newSpeed + (lift - GRAVITY) * dt * 10;
        const vz = forward[2] * newSpeed;

        // Update position
        const [x, y, z] = state.position;
        const newX = x + vx * dt;
        let newY = y + vy * dt;
        const newZ = z + vz * dt;

        // Ground collision
        if (newY < 5) {
            newY = 5;
            newSpeed = Math.max(MIN_SPEED, newSpeed * 0.8);
        }

        // Calculate heading (0-360 degrees)
        let heading = (yaw * 180) / Math.PI;
        heading = ((heading % 360) + 360) % 360;

        // Update lat/long based on movement
        const metersPerDegreeLon = METERS_PER_DEGREE_LAT * Math.cos((state.latitude * Math.PI) / 180);
        const deltaLat = (vz * dt) / METERS_PER_DEGREE_LAT;
        const deltaLon = (vx * dt) / metersPerDegreeLon;

        const newState: SimState = {
            position: [newX, newY, newZ],
            rotation: [pitch, roll, yaw],
            velocity: [vx, vy, vz],
            throttle: newThrottle,
            speed: newSpeed,
            altitude: newY,
            heading,
            latitude: state.latitude + deltaLat,
            longitude: state.longitude + deltaLon,
            worldSeed: state.worldSeed
        };

        stateRef.current = newState;
        return newState;
    };

    return { update };
}

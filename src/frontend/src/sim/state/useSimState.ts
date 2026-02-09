import { useState, useCallback } from 'react';
import type { SimState } from './types';

function generateSeed(): number {
    return Math.floor(Math.random() * 1000000);
}

const INITIAL_STATE: SimState = {
    position: [0, 100, 0],
    rotation: [0, 0, 0],
    velocity: [0, 0, 0],
    throttle: 0.5,
    speed: 50,
    altitude: 100,
    heading: 0,
    latitude: 37.7749, // San Francisco (kept for display purposes)
    longitude: -122.4194,
    worldSeed: generateSeed(),
};

export function useSimState() {
    const [simState, setSimState] = useState<SimState>(INITIAL_STATE);
    const [isRunning, setIsRunning] = useState(false);

    const start = useCallback(() => {
        setIsRunning(true);
    }, []);

    const reset = useCallback(() => {
        // Generate new seed on reset for different world layout
        setSimState({
            ...INITIAL_STATE,
            worldSeed: generateSeed(),
        });
        setIsRunning(false);
    }, []);

    const updateSimState = useCallback((updates: Partial<SimState>) => {
        setSimState((prev) => ({ ...prev, ...updates }));
    }, []);

    return {
        simState,
        isRunning,
        start,
        reset,
        updateSimState
    };
}

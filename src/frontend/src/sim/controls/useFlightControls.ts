import { useEffect, useState } from 'react';

export interface FlightControls {
    pitch: number; // -1 to 1
    roll: number; // -1 to 1
    yaw: number; // -1 to 1
    throttle: number; // -1 to 1 (change)
}

export function useFlightControls(): FlightControls {
    const [controls, setControls] = useState<FlightControls>({
        pitch: 0,
        roll: 0,
        yaw: 0,
        throttle: 0
    });

    useEffect(() => {
        const keys = new Set<string>();

        const handleKeyDown = (e: KeyboardEvent) => {
            keys.add(e.key.toLowerCase());
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keys.delete(e.key.toLowerCase());
        };

        const updateControls = () => {
            const newControls: FlightControls = {
                pitch: 0,
                roll: 0,
                yaw: 0,
                throttle: 0
            };

            // Pitch: W/S or ArrowUp/ArrowDown
            if (keys.has('w') || keys.has('arrowup')) newControls.pitch = 1;
            if (keys.has('s') || keys.has('arrowdown')) newControls.pitch = -1;

            // Roll: A/D or ArrowLeft/ArrowRight
            if (keys.has('a') || keys.has('arrowleft')) newControls.roll = -1;
            if (keys.has('d') || keys.has('arrowright')) newControls.roll = 1;

            // Yaw: Q/E
            if (keys.has('q')) newControls.yaw = -1;
            if (keys.has('e')) newControls.yaw = 1;

            // Throttle: Shift/Ctrl or Space/X
            if (keys.has('shift') || keys.has(' ')) newControls.throttle = 1;
            if (keys.has('control') || keys.has('x')) newControls.throttle = -1;

            setControls(newControls);
        };

        const interval = setInterval(updateControls, 16);

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            clearInterval(interval);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return controls;
}

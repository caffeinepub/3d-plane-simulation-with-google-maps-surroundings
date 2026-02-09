import { Canvas } from '@react-three/fiber';
import { FlightScene } from './scene/FlightScene';
import { FlightHUD } from './hud/FlightHUD';
import { StartOverlay } from './ui/StartOverlay';
import { SimControlsBar } from './ui/SimControlsBar';
import { useSimState } from './state/useSimState';

export function FlightSimView() {
    const { simState, isRunning, start, reset } = useSimState();

    return (
        <div className="relative h-screen w-full overflow-hidden bg-background">
            <Canvas
                camera={{ position: [0, 5, 10], fov: 60 }}
                gl={{ antialias: true, alpha: false }}
                className="h-full w-full"
            >
                <FlightScene simState={simState} isRunning={isRunning} />
            </Canvas>

            {!isRunning && <StartOverlay onStart={start} />}

            {isRunning && (
                <>
                    <FlightHUD simState={simState} />
                    <SimControlsBar onReset={reset} />
                </>
            )}
        </div>
    );
}

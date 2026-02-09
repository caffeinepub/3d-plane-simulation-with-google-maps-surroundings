import type { SimState } from '../state/types';
import { formatSpeed, formatAltitude, formatHeading, formatLatLon, formatThrottle } from './format';

interface FlightHUDProps {
    simState: SimState;
}

export function FlightHUD({ simState }: FlightHUDProps) {
    return (
        <div className="pointer-events-none absolute inset-0 z-10">
            {/* Top left - Speed and Altitude */}
            <div className="absolute left-4 top-4 flex flex-col gap-3">
                <div className="hud-panel">
                    <div className="hud-label">SPEED</div>
                    <div className="hud-value">{formatSpeed(simState.speed)}</div>
                </div>
                <div className="hud-panel">
                    <div className="hud-label">ALTITUDE</div>
                    <div className="hud-value">{formatAltitude(simState.altitude)}</div>
                </div>
            </div>

            {/* Top right - Heading and Throttle */}
            <div className="absolute right-4 top-4 flex flex-col gap-3">
                <div className="hud-panel flex items-center gap-2">
                    <img
                        src="/assets/generated/hud-compass.dim_128x128.png"
                        alt="Heading"
                        className="h-6 w-6 opacity-80"
                    />
                    <div>
                        <div className="hud-label">HEADING</div>
                        <div className="hud-value">{formatHeading(simState.heading)}</div>
                    </div>
                </div>
                <div className="hud-panel flex items-center gap-2">
                    <img
                        src="/assets/generated/hud-throttle.dim_128x128.png"
                        alt="Throttle"
                        className="h-6 w-6 opacity-80"
                    />
                    <div>
                        <div className="hud-label">THROTTLE</div>
                        <div className="hud-value">{formatThrottle(simState.throttle)}</div>
                    </div>
                </div>
            </div>

            {/* Bottom center - Coordinates */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="hud-panel">
                    <div className="hud-label">POSITION</div>
                    <div className="hud-value text-sm">{formatLatLon(simState.latitude, simState.longitude)}</div>
                </div>
            </div>
        </div>
    );
}

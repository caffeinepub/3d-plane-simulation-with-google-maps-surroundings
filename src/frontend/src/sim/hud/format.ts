export function formatSpeed(speed: number): string {
    return `${Math.round(speed)} m/s`;
}

export function formatAltitude(altitude: number): string {
    return `${Math.round(altitude)} m`;
}

export function formatHeading(heading: number): string {
    return `${Math.round(heading)}°`;
}

export function formatThrottle(throttle: number): string {
    return `${Math.round(throttle * 100)}%`;
}

export function formatLatLon(lat: number, lon: number): string {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lonDir = lon >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lon).toFixed(4)}°${lonDir}`;
}

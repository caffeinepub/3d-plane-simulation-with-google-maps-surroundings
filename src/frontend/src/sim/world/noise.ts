// Simple 2D noise implementation for terrain generation
export function smoothstep(t: number): number {
    return t * t * (3 - 2 * t);
}

export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

// Simple hash-based noise
function hash2D(x: number, y: number): number {
    const h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
    return h - Math.floor(h);
}

// Value noise
export function valueNoise(x: number, y: number): number {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;

    const a = hash2D(xi, yi);
    const b = hash2D(xi + 1, yi);
    const c = hash2D(xi, yi + 1);
    const d = hash2D(xi + 1, yi + 1);

    const u = smoothstep(xf);
    const v = smoothstep(yf);

    return lerp(lerp(a, b, u), lerp(c, d, u), v);
}

// Fractal Brownian Motion (FBM) for more natural terrain
export function fbm(x: number, y: number, octaves: number = 4, persistence: number = 0.5): number {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
        total += valueNoise(x * frequency, y * frequency) * amplitude;
        maxValue += amplitude;
        amplitude *= persistence;
        frequency *= 2;
    }

    return total / maxValue;
}

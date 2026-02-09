// Deterministic seeded pseudo-random number generator
export class SeededRandom {
    private seed: number;

    constructor(seed: number) {
        this.seed = seed % 2147483647;
        if (this.seed <= 0) this.seed += 2147483646;
    }

    // Returns a pseudo-random value between 0 and 1
    next(): number {
        this.seed = (this.seed * 16807) % 2147483647;
        return (this.seed - 1) / 2147483646;
    }

    // Returns a pseudo-random value between min and max
    range(min: number, max: number): number {
        return min + this.next() * (max - min);
    }

    // Returns a pseudo-random integer between min (inclusive) and max (exclusive)
    int(min: number, max: number): number {
        return Math.floor(this.range(min, max));
    }
}

// Hash function to generate seed from coordinates
export function hashCoords(x: number, y: number, baseSeed: number): number {
    let hash = baseSeed;
    hash = ((hash << 5) - hash + x) | 0;
    hash = ((hash << 5) - hash + y) | 0;
    return Math.abs(hash);
}

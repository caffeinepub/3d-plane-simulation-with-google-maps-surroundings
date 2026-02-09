import { Button } from '@/components/ui/button';
import { Plane } from 'lucide-react';

interface StartOverlayProps {
    onStart: () => void;
}

export function StartOverlay({ onStart }: StartOverlayProps) {
    return (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/95 backdrop-blur-sm">
            <div className="flex max-w-2xl flex-col items-center gap-8 p-8 text-center">
                <div className="flex items-center gap-3">
                    <Plane className="h-12 w-12 text-primary" />
                    <h1 className="text-5xl font-bold tracking-tight text-foreground">Flight Simulator</h1>
                </div>

                <p className="text-lg text-muted-foreground">
                    Experience realistic flight over procedurally generated terrain and cities
                </p>

                <div className="w-full rounded-lg border border-border bg-card p-6 text-left">
                    <h2 className="mb-4 text-xl font-semibold text-foreground">Flight Controls</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <div className="mb-2 font-mono text-accent-foreground">W / ↑</div>
                            <div className="text-muted-foreground">Pitch Up</div>
                        </div>
                        <div>
                            <div className="mb-2 font-mono text-accent-foreground">S / ↓</div>
                            <div className="text-muted-foreground">Pitch Down</div>
                        </div>
                        <div>
                            <div className="mb-2 font-mono text-accent-foreground">A / ←</div>
                            <div className="text-muted-foreground">Roll Left</div>
                        </div>
                        <div>
                            <div className="mb-2 font-mono text-accent-foreground">D / →</div>
                            <div className="text-muted-foreground">Roll Right</div>
                        </div>
                        <div>
                            <div className="mb-2 font-mono text-accent-foreground">Q</div>
                            <div className="text-muted-foreground">Yaw Left</div>
                        </div>
                        <div>
                            <div className="mb-2 font-mono text-accent-foreground">E</div>
                            <div className="text-muted-foreground">Yaw Right</div>
                        </div>
                        <div>
                            <div className="mb-2 font-mono text-accent-foreground">Shift / Space</div>
                            <div className="text-muted-foreground">Increase Throttle</div>
                        </div>
                        <div>
                            <div className="mb-2 font-mono text-accent-foreground">Ctrl / X</div>
                            <div className="text-muted-foreground">Decrease Throttle</div>
                        </div>
                    </div>
                </div>

                <Button onClick={onStart} size="lg" className="px-12 text-lg">
                    Start Flight
                </Button>

                <footer className="mt-8 text-sm text-muted-foreground">
                    © 2026. Built with ❤️ using{' '}
                    <a
                        href="https://caffeine.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground underline hover:text-primary"
                    >
                        caffeine.ai
                    </a>
                </footer>
            </div>
        </div>
    );
}

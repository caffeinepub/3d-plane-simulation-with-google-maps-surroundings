import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface SimControlsBarProps {
    onReset: () => void;
}

export function SimControlsBar({ onReset }: SimControlsBarProps) {
    return (
        <div className="pointer-events-auto absolute left-1/2 top-4 z-10 -translate-x-1/2">
            <div className="flex items-center gap-4 rounded-lg border border-border/50 bg-card/80 px-4 py-2 backdrop-blur-sm">
                <div className="text-sm text-muted-foreground">
                    <span className="font-mono text-accent-foreground">WASD</span> Pitch/Roll •{' '}
                    <span className="font-mono text-accent-foreground">QE</span> Yaw •{' '}
                    <span className="font-mono text-accent-foreground">Shift/Ctrl</span> Throttle
                </div>
                <div className="h-4 w-px bg-border" />
                <Button onClick={onReset} variant="ghost" size="sm" className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Reset
                </Button>
            </div>
        </div>
    );
}

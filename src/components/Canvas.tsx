import { useRef, useEffect } from 'react';

interface CanvasProps {
  width: number;
  height: number;
  render: (ctx: CanvasRenderingContext2D) => void;
}

export function Canvas({ width, height, render }: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Initialise canvas dimensions
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        // Set canvas size (important - without this, canvas defaults to 300x150!)
        canvas.width = width;
        canvas.height = height;
    }, [width, height]);

    // Animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        let animationFrameId: number;
        
        const animate = () => {
            // 1. Clear the canvas (dark background)
            ctx.fillStyle = '#4ecdc4';
            ctx.fillRect(0, 0, width, height);
            
            // 2. Call the render callback to draw content
            render(ctx);
            
            // 3. Request next frame
            animationFrameId = requestAnimationFrame(animate);
        };
        
        // Start the animation loop
        animationFrameId = requestAnimationFrame(animate);
        
        // Cleanup: Stop animation when component unmounts
        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [width, height, render]);

    // Render the canvas element
    return <canvas ref={canvasRef} style={{ display: 'block' }} />;
}



import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";

const frameCount = 192;

const preloadImages = () => {
    const images = [];
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = `/sequence/frame_${i.toString().padStart(3, "0")}.png`;
        images.push(img);
    }
    return images;
};

export default function ImageSequence() {
    const canvasRef = useRef(null);
    const imagesRef = useRef([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const { scrollYProgress } = useScroll();

    // Transform scroll progress to frame index
    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);

    // Smooth the frame index for better visual flow
    const smoothFrameIndex = useSpring(frameIndex, { damping: 20, stiffness: 100 });

    useEffect(() => {
        const imgs = preloadImages();
        imagesRef.current = imgs;

        let loadedCount = 0;
        const totalImages = imgs.length;

        const checkLoad = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                setIsLoaded(true);
            } else if (loadedCount === 1) {
                // Initial render with first image to avoid blank screen
                requestAnimationFrame(() => renderFrame(0));
            }
        };

        imgs.forEach((img) => {
            if (img.complete) {
                checkLoad();
            } else {
                img.onload = checkLoad;
                img.onerror = checkLoad;
            }
        });
    }, []);

    const renderFrame = (index) => {
        const canvas = canvasRef.current;
        if (!canvas || imagesRef.current.length === 0) return;

        const ctx = canvas.getContext("2d");
        const img = imagesRef.current[index];

        if (!img) return;

        // Clear canvas before drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };

    // Handle canvas resizing separately
    useEffect(() => {
        const handleResize = () => {
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                // Re-render current frame after resize
                renderFrame(Math.round(smoothFrameIndex.get()));
            }
        };

        // Initial sizing
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useMotionValueEvent(smoothFrameIndex, "change", (latest) => {
        requestAnimationFrame(() => {
            renderFrame(Math.round(latest));
        });
    });

    return (
        <div className="fixed inset-0 w-full h-full z-0 bg-black">
            <canvas ref={canvasRef} className="block w-full h-full" />
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black text-white z-50">
                    <div className="text-2xl font-light animate-pulse">Loading Experience...</div>
                </div>
            )}
        </div>
    );
}

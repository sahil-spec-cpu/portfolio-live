import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";

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
    const [images, setImages] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const { scrollYProgress } = useScroll();

    // Transform scroll progress to frame index
    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);

    useEffect(() => {
        const imgs = preloadImages();
        let loadedCount = 0;

        const checkLoad = () => {
            loadedCount++;
            if (loadedCount === frameCount) {
                setIsLoaded(true);
                setImages(imgs);
                // Initial render
                requestAnimationFrame(() => renderFrame(0));
            }
        };

        imgs.forEach((img) => {
            if (img.complete) {
                checkLoad();
            } else {
                img.onload = checkLoad;
                img.onerror = checkLoad; // Proceed anyway on error
            }
        });
    }, []);

    const renderFrame = (index) => {
        const canvas = canvasRef.current;
        if (!canvas || images.length === 0) return;

        const ctx = canvas.getContext("2d");
        const img = images[index];

        if (!img) return;

        // Image formatting: cover
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };

    useMotionValueEvent(frameIndex, "change", (latest) => {
        requestAnimationFrame(() => {
            renderFrame(Math.round(latest));
        });
    });

    // Render first frame on load
    useEffect(() => {
        if (images.length > 0) {
            renderFrame(0);
        }
    }, [images, isLoaded]);

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            if (images.length > 0) {
                renderFrame(Math.round(frameIndex.get()));
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [images]);


    return (
        <div className="fixed inset-0 w-full h-full z-0 bg-black">
            <canvas ref={canvasRef} className="block w-full h-full" />
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-content-center bg-black text-white z-50">
                    <div className="text-2xl font-light animate-pulse">Loading Experience...</div>
                </div>
            )}
        </div>
    );
}

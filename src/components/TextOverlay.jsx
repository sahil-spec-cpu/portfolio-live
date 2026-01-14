import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Item = ({ text, index, total }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    // Fade in as it enters center, fade out as it leaves
    const opacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0]);
    const y = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [50, 0, -50]);

    return (
        <section ref={ref} className="h-screen flex items-center justify-center snap-center">
            <motion.h2
                style={{ opacity, y }}
                className="text-4xl md:text-6xl font-bold text-white tracking-tighter text-center px-4"
            >
                {text}
            </motion.h2>
        </section>
    );
};

export default function TextOverlay() {
    const texts = [
        "Hi, my name is Sahil Singh",
        "I am a Graphic Designer",
        "I am a Full Stack Developer",
        "I am a 3D Animation Artist",
        "I am an Ethical Hacker",
    ];

    return (
        <div className="relative z-10 w-full text-white pb-[50vh] pt-[50vh]">
            {texts.map((text, i) => (
                <Item key={i} text={text} index={i} total={texts.length} />
            ))}
        </div>
    );
}

import { motion, useScroll, useTransform } from "framer-motion";

export default function TextOverlay() {
    const { scrollYProgress } = useScroll();

    // Map scroll progress (0 to 1) to active step index (0 to 3)
    const activeIndex = useTransform(scrollYProgress, (value) => {
        if (value < 0.25) return 0;
        if (value < 0.50) return 1;
        if (value < 0.75) return 2;
        return 3;
    });

    const experiences = [
        {
            id: "01",
            company: "Delhi University",
            role: "Bachelor of Arts",
            year: "2025",
            details: [],
        },
        {
            id: "02",
            company: "PUMA",
            role: "Floor Manager",
            year: "Leadership",
            details: ["7x Award Winner"],
        },
        {
            id: "03",
            company: "AKS Valuers",
            role: "IT & Business Manager",
            year: "Systems",
            details: ["Certified Innovation IT and Architect"],
        },
        {
            id: "04",
            company: "Formulaic Engineers",
            role: "Manager Automation & IT",
            year: "Present",
            details: ["PAN India Attendance Portal (80+ Offices)", "Automated Admin Dashboard"],
        }
    ];

    return null;
}

function Step({ data, index, activeIndex }) {
    const isPastOrCurrent = useTransform(activeIndex, (current) => current >= index ? 1 : 0.3);
    const scale = useTransform(activeIndex, (current) => current === index ? 1.1 : 1);
    const color = useTransform(activeIndex, (current) => current === index ? "#a855f7" : "#ffffff"); // Purple active, white inactive
    const glow = useTransform(activeIndex, (current) => current === index ? "0 0 20px rgba(168,85,247,0.5)" : "none");

    return (
        <div className="flex flex-col items-center text-center w-1/4 px-2">
            {/* Circle Node */}
            <motion.div
                style={{
                    scale,
                    borderColor: color,
                    boxShadow: glow,
                    opacity: isPastOrCurrent
                }}
                className="w-16 h-16 rounded-full border-2 bg-black flex items-center justify-center mb-6 z-10 box-content transition-colors duration-300"
            >
                <span className="text-sm font-mono text-gray-400">{data.id}</span>
            </motion.div>

            {/* Content */}
            <motion.div
                style={{ opacity: isPastOrCurrent }}
                className="flex flex-col items-center space-y-2"
            >
                <h3 className="text-xl md:text-2xl font-bold text-white">{data.company}</h3>

                <p className="text-xs md:text-sm font-bold tracking-wider text-purple-400 uppercase">
                    {data.role}
                </p>

                <p className="text-gray-500 text-sm">{data.year}</p>

                {/* Details / Chips */}
                {data.details.length > 0 && (
                    <div className="flex flex-col gap-1 pt-2 items-center">
                        {data.details.map((detail, i) => (
                            <span key={i} className="text-[10px] md:text-xs bg-gray-900 border border-gray-800 text-gray-300 px-2 py-1 rounded-full whitespace-nowrap">
                                {detail}
                            </span>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    )
}

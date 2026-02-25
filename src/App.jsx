import { useEffect } from 'react'
import Lenis from 'lenis'
import BrutalIntro from './components/BrutalIntro'
import ImageSequence from './components/ImageSequence'


function App() {

    useEffect(() => {
        const lenis = new Lenis({
            lerp: 0.1,
            duration: 1.5,
            smoothTouch: true,
        })

        function raf(time) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        return () => {
            lenis.destroy();
        }
    }, [])

    return (
        <div className="relative w-full bg-black">
            <BrutalIntro />

            <div className="relative w-full min-h-[500vh]">
                <ImageSequence />
                <div className="relative z-10 pointer-events-none">
                    <div className="h-[100vh] flex items-center justify-center text-white">
                        <h1 className="text-6xl font-bold tracking-tighter mix-blend-difference pointer-events-auto">SCROLL TO EXPLORE</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App

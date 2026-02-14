import { useEffect } from 'react'
import Lenis from 'lenis'
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
        <div className="relative w-full bg-black min-h-[500vh]">
            <ImageSequence />
            <div className="relative z-10">
                <div className="h-[100vh] flex items-center justify-center text-white pointer-events-none">
                    <h1 className="text-6xl font-bold tracking-tighter mix-blend-difference">SCROLL TO EXPLORE</h1>
                </div>



                <div className="h-[100vh]"></div>
            </div>
        </div>
    )
}

export default App

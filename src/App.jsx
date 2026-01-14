import { useEffect } from 'react'
import Lenis from 'lenis'
import ImageSequence from './components/ImageSequence'
import TextOverlay from './components/TextOverlay'

function App() {

    useEffect(() => {
        const lenis = new Lenis()

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
            <TextOverlay />
            <div className="h-screen flex items-center justify-center relative z-10">
                <p className="text-gray-400 text-sm">Scroll to explore</p>
            </div>
        </div>
    )
}

export default App

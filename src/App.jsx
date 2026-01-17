import { useEffect } from 'react'
import Lenis from 'lenis'
import ImageSequence from './components/ImageSequence'

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
        </div>
    )
}

export default App

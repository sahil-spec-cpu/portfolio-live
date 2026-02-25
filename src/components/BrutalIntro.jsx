import React, { useEffect, useRef, useState } from 'react';
import './BrutalIntro.css';

const CONFIG = {
    itemCount: 20,
    starCount: 150,
    zGap: 800,
    camSpeed: 2.5,
};
CONFIG.loopSize = CONFIG.itemCount * CONFIG.zGap;

const TEXTS = ["SAHIL", "SINGH", "IT ARCHITECT", "AUTOMATION", "SYSTEMS", "CLOUD", "AI", "DEV", "FUTURE", "DESIGN"];

const BrutalIntro = () => {
    const worldRef = useRef(null);
    const viewportRef = useRef(null);
    const containerRef = useRef(null);
    const [fps, setFps] = useState(60);
    const [velocityDisplay, setVelocityDisplay] = useState("0.00");
    const [coord, setCoord] = useState("000.000");

    useEffect(() => {
        if (!worldRef.current || !viewportRef.current || !containerRef.current) return;

        const world = worldRef.current;
        const viewport = viewportRef.current;
        const items = [];

        // Clear existing children (React StrictMode double mount protection)
        world.innerHTML = '';

        // Initialize world items
        for (let i = 0; i < CONFIG.itemCount; i++) {
            const el = document.createElement('div');
            el.className = 'brutal-item';

            const isHeading = i % 4 === 0;

            if (isHeading) {
                const txt = document.createElement('div');
                txt.className = 'brutal-big-text';
                txt.innerText = TEXTS[i % TEXTS.length];
                el.appendChild(txt);
                items.push({
                    el, type: 'text',
                    x: 0, y: 0, rot: 0,
                    baseZ: -i * CONFIG.zGap
                });
            } else {
                const card = document.createElement('div');
                card.className = 'brutal-card';
                const randId = Math.floor(Math.random() * 9999);
                card.innerHTML = `
                    <div class="brutal-card-header">
                        <span class="brutal-card-id">ID-${randId}</span>
                        <div style="width: 10px; height: 10px; background: var(--accent);"></div>
                    </div>
                    <h2>${TEXTS[i % TEXTS.length]}</h2>
                    <div class="brutal-card-footer">
                        <span>GRID: ${Math.floor(Math.random() * 10)}x${Math.floor(Math.random() * 10)}</span>
                        <span>DATA: ${(Math.random() * 100).toFixed(1)}MB</span>
                    </div>
                    <div style="position:absolute; bottom:2rem; right:2rem; font-size:4rem; opacity:0.1; font-weight:900;">0${i}</div>
                `;
                el.appendChild(card);

                const angle = (i / CONFIG.itemCount) * Math.PI * 6;
                const x = Math.cos(angle) * (window.innerWidth * 0.3);
                const y = Math.sin(angle) * (window.innerHeight * 0.3);
                const rot = (Math.random() - 0.5) * 30;

                items.push({
                    el, type: 'card',
                    x, y, rot,
                    baseZ: -i * CONFIG.zGap
                });
            }
            world.appendChild(el);
        }

        for (let i = 0; i < CONFIG.starCount; i++) {
            const el = document.createElement('div');
            el.className = 'brutal-star';
            world.appendChild(el);
            items.push({
                el, type: 'star',
                x: (Math.random() - 0.5) * 3000,
                y: (Math.random() - 0.5) * 3000,
                baseZ: -Math.random() * CONFIG.loopSize
            });
        }

        // Mouse and Scroll tracking state
        const state = {
            scroll: 0,
            velocity: 0,
            targetSpeed: 0,
            mouseX: 0,
            mouseY: 0,
            lastScrollY: window.scrollY
        };

        const handleMouseMove = (e) => {
            state.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            state.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        };

        window.addEventListener('mousemove', handleMouseMove);

        let animationFrameId;
        let lastTime = performance.now();
        let frameCount = 0;
        let lastFpsTime = lastTime;

        const renderLoop = (time) => {
            // Calculate pseudo velocity manually if Lenis isn't directly providing it here easily
            const currentScrollY = window.scrollY;
            const deltaScroll = currentScrollY - state.lastScrollY;
            state.scroll = currentScrollY;

            // Container bounds check to optimize/stop rendering if scrolled way past
            const containerRect = containerRef.current.getBoundingClientRect();
            // Stop rendering heavy 3D if natural scrolled out of view completely
            if (containerRect.bottom < 0) {
                animationFrameId = requestAnimationFrame(renderLoop);
                state.lastScrollY = currentScrollY;
                return;
            }

            state.targetSpeed = deltaScroll;
            state.lastScrollY = currentScrollY;

            const delta = time - lastTime;
            lastTime = time;

            // FPS calculation
            frameCount++;
            if (time - lastFpsTime >= 1000) {
                setFps(Math.round((frameCount * 1000) / (time - lastFpsTime)));
                frameCount = 0;
                lastFpsTime = time;
            }

            state.velocity += (state.targetSpeed - state.velocity) * 0.1;

            // Update UI rarely to avoid react render lag
            if (Math.abs(state.velocity) > 0.1 || time % 100 < 16) {
                setVelocityDisplay(Math.abs(state.velocity).toFixed(2));
                setCoord(`${state.scroll.toFixed(0)}`);
            }

            const shake = state.velocity * 0.2;
            const tiltX = state.mouseY * 5 - state.velocity * 0.5;
            const tiltY = state.mouseX * 5;

            world.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

            const baseFov = 1000;
            const fov = baseFov - Math.min(Math.abs(state.velocity) * 10, 600);
            viewport.style.perspective = `${fov}px`;

            const cameraZ = state.scroll * CONFIG.camSpeed;

            items.forEach(item => {
                let relZ = item.baseZ + cameraZ;
                const modC = CONFIG.loopSize;
                let vizZ = ((relZ % modC) + modC) % modC;
                if (vizZ > 500) vizZ -= modC;

                let alpha = 1;
                if (vizZ < -3000) alpha = 0;
                else if (vizZ < -2000) alpha = (vizZ + 3000) / 1000;
                if (vizZ > 100 && item.type !== 'star') alpha = 1 - ((vizZ - 100) / 400);

                if (alpha < 0) alpha = 0;
                item.el.style.opacity = alpha;

                if (alpha > 0) {
                    let trans = `translate3d(${item.x}px, ${item.y}px, ${vizZ}px)`;

                    if (item.type === 'star') {
                        const stretch = Math.max(1, Math.min(1 + Math.abs(state.velocity) * 0.1, 10));
                        trans += ` scale3d(1, 1, ${stretch})`;
                    } else if (item.type === 'text') {
                        trans += ` rotateZ(${item.rot}deg)`;
                        if (Math.abs(state.velocity) > 1) {
                            const offset = state.velocity * 2;
                            item.el.style.textShadow = `${offset}px 0 #A663CC, ${-offset}px 0 #4CA9FF`;
                        } else {
                            item.el.style.textShadow = 'none';
                        }
                    } else {
                        const t = time * 0.001;
                        const float = Math.sin(t + item.x) * 10;
                        trans += ` rotateZ(${item.rot}deg) rotateY(${float}deg)`;
                    }

                    item.el.style.transform = trans;
                }
            });

            animationFrameId = requestAnimationFrame(renderLoop);
        };

        animationFrameId = requestAnimationFrame(renderLoop);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="brutal-root" ref={containerRef}>
            <div className="brutal-container">
                <div className="brutal-scanlines"></div>
                <div className="brutal-vignette"></div>
                <div className="brutal-noise"></div>

                <div className="brutal-hud">
                    <div className="brutal-hud-top">
                        <span>SAHIL.SYS</span>
                        <div className="brutal-hud-line"></div>
                        <span>FPS: <strong>{fps}</strong></span>
                    </div>
                    <div
                        style={{
                            alignSelf: 'flex-start',
                            marginTop: 'auto',
                            marginBottom: 'auto',
                            writingMode: 'vertical-rl',
                            transform: 'rotate(180deg)'
                        }}
                    >
                        SCROLL VELOCITY // <strong>{velocityDisplay}</strong>
                    </div>
                    <div className="brutal-hud-bottom">
                        <span>COORD: <strong>{coord}</strong></span>
                        <div className="brutal-hud-line"></div>
                        <span>PORTFOLIO // V1</span>
                    </div>
                </div>

                <div className="brutal-viewport" ref={viewportRef}>
                    <div className="brutal-world" ref={worldRef}></div>
                </div>
            </div>
        </div>
    );
};

export default BrutalIntro;

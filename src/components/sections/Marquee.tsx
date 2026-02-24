import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const words = [
    "Developer", "—", "Creative Thinker", "—", "Problem Solver", "—", "UI Enthusiast", "—",
    "Developer", "—", "Creative Thinker", "—", "Problem Solver", "—", "UI Enthusiast", "—"
];

export const Marquee = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Simple GSAP horizontal scroll tied to ScrollTrigger
            gsap.to(textRef.current, {
                xPercent: -50, // Move half the width since we double the content for seamless loop
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1, // Smooth scrubbing
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="w-full py-12 md:py-24 overflow-hidden bg-foreground relative border-t border-white/5"
        >
            <div className="flex whitespace-nowrap" ref={textRef}>
                <div className="flex gap-4 md:gap-8 px-4 text-4xl md:text-8xl font-medium tracking-tighter opacity-80">
                    {words.map((word, i) => (
                        <span key={i} className={word === '—' ? 'opacity-30' : ''}>
                            {word}
                        </span>
                    ))}
                </div>
                {/* Duplicate for seamless infinite feeling on scrub */}
                <div className="flex gap-4 md:gap-8 px-4 text-4xl md:text-8xl font-medium tracking-tighter opacity-80" aria-hidden="true">
                    {words.map((word, i) => (
                        <span key={i} className={word === '—' ? 'opacity-30' : ''}>
                            {word}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};

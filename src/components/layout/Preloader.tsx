import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const greetings = ["Hello", "Bonjour", "Ciao", "Olá", "Hallo", "Привет", "Hola"];

export const Preloader = ({ onComplete }: { onComplete: () => void }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // Quickly cycle through languages
        if (index < greetings.length - 1) {
            const timer = setTimeout(() => {
                setIndex(index + 1);
            }, index === 0 ? 800 : 150); // initial delay, then fast cycle
            return () => clearTimeout(timer);
        }
    }, [index]);

    useEffect(() => {
        if (index === greetings.length - 1) {
            const ctx = gsap.context(() => {
                // Slide up animation sequence
                const tl = gsap.timeline({
                    onComplete: onComplete
                });

                tl.to(textRef.current, {
                    opacity: 0,
                    y: -50,
                    duration: 0.5,
                    delay: 0.5,
                    ease: 'power3.inOut'
                })
                    .to(containerRef.current, {
                        yPercent: -100,
                        duration: 0.8,
                        ease: "circ.inOut",
                    });
            }, containerRef);
            return () => ctx.revert();
        }
    }, [index, onComplete]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] bg-foreground flex items-center justify-center text-primary"
        >
            <h2
                ref={textRef}
                className="text-4xl md:text-6xl font-medium tracking-tight flex items-center gap-4"
            >
                <span className="w-2 h-2 rounded-full bg-white block" />
                {greetings[index]}
            </h2>
        </div>
    );
};

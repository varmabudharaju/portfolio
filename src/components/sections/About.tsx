import { useEffect, useRef } from 'react';
import { portfolioData } from '../../data';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
    const containerRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                textRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 70%',
                        toggleActions: 'play none none reverse',
                    }
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    // Split bio roughly into two parts for the layout or just use it as one block.
    // Snellenberg typically uses a 2/3 width block for the giant text.
    return (
        <section
            id="about"
            ref={containerRef}
            className="w-full py-[150px] md:py-[200px] px-4 md:px-[150px] bg-[#FFFFFF] text-[#1C1D20] flex justify-center z-10 relative"
        >
            <div className="w-full flex flex-col md:flex-row justify-between items-start gap-12">
                <div className="w-full md:w-1/4 pt-2">
                    <p className="text-[16px] font-normal opacity-70 w-2/3 leading-[1.5]">
                        {portfolioData.personal.bio}
                    </p>
                </div>
                <div className="w-full md:w-3/4">
                    <p
                        ref={textRef}
                        className="text-[32px] md:text-[40px] leading-[1.4] font-normal m-0"
                    >
                        I help brands to stand out in the digital era. Together we will set the new status quo. No nonsense, always on the edge.
                    </p>
                </div>
            </div>
        </section>
    );
};

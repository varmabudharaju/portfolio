import { useEffect, useRef } from 'react';
import { portfolioData } from '../../data';
import { Globe, ArrowDownRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
    const containerRef = useRef<HTMLElement>(null);
    const textSliderRef = useRef<HTMLDivElement>(null);
    const text1Ref = useRef<HTMLHeadingElement>(null);
    const text2Ref = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        // Reveal animation
        const ctx = gsap.context(() => {
            gsap.fromTo('.reveal-text',
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
            );

            // Scroll triggered Marquee
            let xPercent = 0;
            let direction = -1;

            const animateMarquee = () => {
                if (xPercent < -100) {
                    xPercent = 0;
                } else if (xPercent > 0) {
                    xPercent = -100;
                }
                gsap.set(text1Ref.current, { xPercent: xPercent });
                gsap.set(text2Ref.current, { xPercent: xPercent });
                xPercent += 0.05 * direction;
                requestAnimationFrame(animateMarquee);
            }

            requestAnimationFrame(animateMarquee);

            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                onUpdate: (self) => {
                    // Speed up movement based on scroll velocity
                    direction = self.direction === 1 ? -1 : 1;
                    xPercent += self.getVelocity() / 500;
                }
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative w-full h-[100svh] bg-[#999D9E] overflow-hidden text-[#FFFFFF] flex flex-col justify-end"
        >

            {/* Absolute Centered Portrait Image (Behind text or in front depending on exact layout) 
          Snellenberg's text goes BEHIND the person's torso, so image needs z-20 
      */}
            <div className="absolute bottom-[0] left-1/2 -translate-x-1/2 w-full max-w-[550px] h-[88vh] flex items-end justify-center z-20 bg-transparent pointer-events-none">
                <img
                    src={portfolioData.personal.profileImage}
                    alt={portfolioData.personal.name}
                    className="w-full h-full object-contain object-bottom"
                />
            </div>

            {/* Side Content Widgets - On top */}
            <div className="absolute top-[50%] md:top-[60%] w-full flex justify-between items-center z-30 px-0 md:px-0 pointer-events-none">

                {/* Left Widget */}
                <div className="hidden md:flex items-center gap-8 bg-[#1C1D20] text-white rounded-r-full py-[20px] pl-[32px] pr-[56px] hover:bg-[#111111] transition-colors cursor-pointer w-fit pointer-events-auto">
                    <div className="w-[50px] h-[50px] bg-white/10 rounded-full flex items-center justify-center">
                        <Globe className="w-5 h-5 opacity-70" strokeWidth={1.5} />
                    </div>
                    <p className="text-[17px] leading-[1.3] font-normal whitespace-pre-line tracking-normal">
                        Located<br />in the<br />Netherlands
                    </p>
                </div>

                {/* Right Widget */}
                <div className="hidden md:flex flex-col items-end gap-[80px] right-[120px] absolute pointer-events-auto">
                    <ArrowDownRight className="w-7 h-7 font-light" strokeWidth={1.5} />
                    <p className="text-[28px] leading-[1.3] font-normal whitespace-pre-line text-right">
                        Freelance<br />Designer & Developer
                    </p>
                </div>
            </div>

            {/* Bottom Text Slider (Z-10 so it's behind the portrait) */}
            <div className="absolute bottom-[-20px] left-0 w-full overflow-hidden flex whitespace-nowrap z-10 select-none pointer-events-none">
                <div
                    ref={textSliderRef}
                    className="flex relative w-[200vw]"
                >
                    {/* We bind these to refs to precisely control xPercent via GSAP */}
                    <h1 ref={text1Ref} className="text-[22vw] md:text-[250px] font-normal tracking-[-0.03em] leading-none whitespace-nowrap m-0 pr-[40px] text-white">
                        {portfolioData.personal.name} -
                    </h1>
                    <h1 ref={text2Ref} className="text-[22vw] md:text-[250px] font-normal tracking-[-0.03em] leading-none whitespace-nowrap m-0 pr-[40px] text-white absolute left-[100%]">
                        {portfolioData.personal.name} -
                    </h1>
                </div>
            </div>

        </section>
    );
};

import { useState, useRef, useEffect } from 'react';
import { portfolioData } from '../../data';
import { MagneticButton } from '../layout/MagneticButton';
import gsap from 'gsap';

export const Work = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLElement>(null);
    const modalContainerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // We animate the modal (the container of the floating image) and the cursor view pill
        // They both follow the mouse.

        // Initial setup for quick GSAP movement
        let xMoveContainer = gsap.quickTo(modalContainerRef.current, "left", { duration: 0.8, ease: "power3" });
        let yMoveContainer = gsap.quickTo(modalContainerRef.current, "top", { duration: 0.8, ease: "power3" });
        let xMoveCursor = gsap.quickTo(cursorRef.current, "left", { duration: 0.5, ease: "power3" });
        let yMoveCursor = gsap.quickTo(cursorRef.current, "top", { duration: 0.5, ease: "power3" });

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            xMoveContainer(clientX);
            yMoveContainer(clientY);
            xMoveCursor(clientX);
            yMoveCursor(clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <section
            id="work"
            ref={containerRef}
            className="w-full py-24 md:py-[100px] px-4 md:px-[150px] bg-[#FFFFFF] text-[#1C1D20] relative z-20"
        >

            {/* Small uppercase header */}
            <div className="w-full mb-10 pl-2">
                <span className="text-[12px] font-normal tracking-widest text-[#1C1D20]/40 uppercase">Recent Work</span>
            </div>

            {/* Projects List Container */}
            <div className="w-full flex flex-col mb-16 relative">
                <div className="w-full border-t border-t-[#D2D2D2]"></div>
                {portfolioData.projects.map((project, index) => (
                    <div
                        key={project.id}
                        className={`w-full flex items-center justify-between py-[46px] group cursor-pointer border-b border-b-[#D2D2D2] transition-colors duration-500 hover:opacity-100 ${hoveredIndex !== null && hoveredIndex !== index ? 'opacity-40' : ''}`}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <h2 className="text-[40px] md:text-[60px] font-normal tracking-tight group-hover:-translate-x-3 transition-transform duration-500 ease-custom-ease m-0 leading-none">
                            {project.title}
                        </h2>
                        <span className="text-[16px] font-normal group-hover:translate-x-3 transition-transform duration-500 ease-custom-ease hidden md:block m-0 leading-none">
                            {project.category}
                        </span>
                    </div>
                ))}
            </div>

            {/* "More work" pill */}
            <div className="flex justify-center w-full mt-[80px]">
                <MagneticButton>
                    <button className="px-[32px] py-[18px] rounded-full border border-black/20 text-[16px] font-normal hover:bg-[#1C1D20] hover:text-[#FFFFFF] transition-colors duration-300 ease-custom-ease flex items-center justify-center gap-2">
                        More work <span className="text-[12px] opacity-70 transform -translate-y-1">{portfolioData.projects.length}</span>
                    </button>
                </MagneticButton>
            </div>

            {/* Floating Image Modal */}
            <div
                ref={modalContainerRef}
                className="fixed top-0 left-0 pointer-events-none w-[300px] h-[250px] flex items-center justify-center overflow-hidden z-[100] rounded-[20px]"
                style={{
                    transform: `translate(-50%, -50%) scale(${hoveredIndex !== null ? 1 : 0})`,
                    opacity: hoveredIndex !== null ? 1 : 0,
                    transition: 'transform 0.4s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.4s cubic-bezier(0.76, 0, 0.24, 1)'
                }}
            >
                <div
                    className="relative w-full transition-transform duration-500"
                    style={{
                        height: '100%',
                        transform: `translateY(${hoveredIndex !== null ? hoveredIndex * -100 : 0}%)`
                    }}
                >
                    {portfolioData.projects.map((project, index) => (
                        <div key={`modal_${index}`} className="w-full h-full flex items-center justify-center bg-[#1C1D20]">
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* View Pointer Pill */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 pointer-events-none w-[80px] h-[80px] bg-[#455CE9] text-white rounded-full flex items-center justify-center z-[110] text-[14px] font-normal mix-blend-normal"
                style={{
                    transform: `translate(-50%, -50%) scale(${hoveredIndex !== null ? 1 : 0})`,
                    opacity: hoveredIndex !== null ? 1 : 0,
                    transition: 'transform 0.4s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.4s cubic-bezier(0.76, 0, 0.24, 1)'
                }}
            >
                View
            </div>
        </section>
    );
};

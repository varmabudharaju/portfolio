import React, { useState, useEffect } from 'react';
import { portfolioData } from '../../data';
import { MagneticButton } from './MagneticButton';

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // If we've scrolled past the hero section (approx 90vh)
            if (window.scrollY > window.innerHeight * 0.9) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 px-[40px] py-[35px] flex justify-between items-center transition-colors duration-500 pointer-events-none ${isScrolled ? 'text-[#1C1D20]' : 'text-[#FFFFFF]'}`}
        >
            <div className="flex-1 group w-fit pointer-events-auto cursor-pointer">
                <div className="flex items-center space-x-1 text-[16px] font-normal tracking-normal">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-custom-ease group-hover:rotate-[360deg] inline-block origin-center mr-1">©</span>
                    <span className="group-hover:pl-1 transition-all duration-300 ease-custom-ease">Code by {portfolioData.personal.name.split(' ')[0]}</span>
                </div>
            </div>

            <div className="hidden md:flex flex-1 justify-end space-x-[40px] text-[16px] font-normal tracking-normal pointer-events-auto cursor-pointer">
                <MagneticButton>
                    <a href="#work" className="hover:opacity-70 transition-opacity">Work</a>
                </MagneticButton>
                <MagneticButton>
                    <a href="#about" className="hover:opacity-70 transition-opacity">About</a>
                </MagneticButton>
                <MagneticButton>
                    <a href="#contact" className="hover:opacity-70 transition-opacity">Contact</a>
                </MagneticButton>
            </div>
        </nav>
    );
};

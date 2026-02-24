import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.closest('a') ||
                target.closest('button') ||
                target.getAttribute('role') === 'button'
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    const variants = {
        default: {
            x: mousePosition.x - 16,
            y: mousePosition.y - 16,
            scale: 1,
        },
        hover: {
            x: mousePosition.x - 40,
            y: mousePosition.y - 40,
            scale: 1.5,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            mixBlendMode: "difference" as const,
        }
    };

    return (
        <motion.div
            className="fixed top-0 left-0 w-[15px] h-[15px] bg-[#FFFFFF] rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
            variants={variants}
            animate={isHovering ? "hover" : "default"}
            transition={{
                type: "spring",
                stiffness: 150,
                damping: 15,
                mass: 0.1
            }}
        />
    );
};

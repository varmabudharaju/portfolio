import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({ children, className = '', onClick }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = e;
        const boundingRect = ref.current?.getBoundingClientRect();
        if (boundingRect) {
            const { width, height, left, top } = boundingRect;
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);
            setPosition({ x, y });
        }
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x: position.x * 0.2, y: position.y * 0.2 }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={`relative inline-flex cursor-pointer ${className}`}
            onClick={onClick}
        >
            <motion.div
                animate={{ x: position.x * 0.1, y: position.y * 0.1 }}
                transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
};

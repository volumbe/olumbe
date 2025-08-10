'use client';

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../utils'

type Props = {
    className: string
    children: any
}

export const Animation = (props: Props) => {
    const divRef = useRef<HTMLDivElement>(null);

    const draw = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: (i: any) => {
            const delay = 1 + i * 0.5;
            return {
                pathLength: 1,
                opacity: 1,
                transition: {
                    pathLength: { delay, type: "spring", duration: 2, bounce: 0 },
                    opacity: { delay, duration: 0.01 },
                },
            };
        }
    };
    const [dimensions, setDimensions] = useState({
        width: 1000,
        height: 2000,
        top: 0,
        left: 0
    });

    const rect = "M 202.052 0 L 375 0 C 388.808 0 400 11.193 400 25 L 400 175 C 400 188.807 388.808 200 375 200 L 25 200 C 11.192 200 0 188.807 0 175 L 0 25 C 0 11.193 11.192 0 25 0 L 202.052 0";

    const rectStyle = {
        strokeWidth: "4px",
        paintOrder: "stroke",
        stroke: "url('#gradient-0')",
        fill: "none",
    };

    const gradientStop1 = {
        stopColor: "rgb(100% 76.471% 44.314%)"
    }

    const gradientStop2 = {
        stopColor: "rgb(255, 95, 109)"
    }

    useEffect(() => {
        if (!divRef.current) return;

        const { width, height, top, left } = divRef.current.getBoundingClientRect();

        setDimensions({ width, height, top, left });
    }, []);

    return (
        <div ref={divRef} className={cn("flex flex-col items-center my-4")}>
            <svg
                className={`absolute max-w-[80vw]`}
                viewBox={`0 0 ${dimensions.width + 100} ${dimensions.height + 100}`}
                preserveAspectRatio="none"
                shapeRendering="crispEdges">
                <defs>
                    <linearGradient gradientUnits="userSpaceOnUse" x1="250" y1="50" x2="250" y2="250" id="gradient-0" gradientTransform="matrix(0.625248, -0.780426, 1.184928, 0.949319, -122.765701, 153.162827)">
                        <stop offset="0" style={gradientStop1} />
                        <stop offset="1" style={gradientStop2} />
                    </linearGradient>
                </defs>
                <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                        duration: 1,
                        ease: "easeInOut",
                    }}
                    preserveAspectRatio="none"
                    shapeRendering="crispEdges"
                    d={rect} style={rectStyle} />
            </svg>
            <div className="w-full">
                {props.children}
            </div>
        </div>
    )
}
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion'
import BLACKIVY from "../images/BLACKIVY.png";
import CommonCents from "../images/CC-white.png";
import Shipp from "../images/Shipp.png";
import Selfie from "../images/selfie.png";
import Card from './Card';
import { cn } from '../utils';

export const Projects = () => {

    const divRef = useRef<HTMLDivElement>(null);

    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 0,
        top: 0,
        left: 0
    });

    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const handleResize = () => {
        setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        });
      }

    useEffect(() => {
      window.addEventListener("resize", handleResize, false);
    }, []);

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!divRef.current) return;
        
        const { width, height, top, left } = divRef.current.getBoundingClientRect();

        console.log(windowSize, width, dimensions.width)

        setDimensions({ width, height, top, left });
    }, [windowSize]);

    const svg = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                duration: 0.75,
                delay: 1,
                staggerChildren: 0.5
            }
        }
    }

    const circle = {
        hidden: { scale: 0 },
        show: {
            scale: 1.5,
            transition: {
                delay: 1.1,
                duration: 0.5,
                type: 'spring',
            }
        }
    }

    const line = {
        hidden: { strokeDasharray: `0 ${dimensions.width}`, strokeDashoffset: - dimensions.width / 2 },
        show: {
            strokeDasharray: `${dimensions.width}, ${dimensions.width}`,
            strokeDashoffset: 0,
            transition: { duration: 1, delay: 1.2 }
        },
    }
    const avatar = {
        hidden: {opacity: 0, scale: 0.5, y: 50 },
        show: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.5 }
        },
    }

    return (
        <div ref={divRef} className="flex flex-col items-center w-full">
            {dimensions.width != 0 &&
                <motion.svg
                    initial="hidden"
                    animate="show"
                    variants={svg}
                    className="w-full z-30 md:px-0" height={20}
                    key={dimensions.width}
                >
                    <defs>
                        <linearGradient gradientUnits="userSpaceOnUse" x1="250" y1="50" x2="1050" y2="250" id="lineGradient" gradientTransform="matrix(0.625248, -0.780426, 1.184928, 0.949319, -122.765701, 153.162827)">
                            <stop offset="0" style={gradientStop1} />
                            <stop offset="1" style={gradientStop2} />
                        </linearGradient>
                        <radialGradient id="radialGradient">
                            <stop offset="10%" style={gradientStop2} />
                            <stop offset="90%" style={gradientStop1} />
                        </radialGradient>
                    </defs>
                    <motion.line
                        initial="hidden"
                        animate="show"
                        variants={line}
                        strokeLinecap={"round"}
                        className="px-10"
                        style={lineStyle} x1="0" y1="10" x2={dimensions.width} y2="10" />
                    <motion.circle
                        className="z-30 hover:cursor-zoom-in"
                        initial="hidden"
                        animate="show"
                        onClick={() => setIsOpen(!isOpen)}
                        onHoverStart={() => setIsOpen(true)}
                        onHoverEnd={() => setIsOpen(false)}
                        variants={circle}
                        cx={dimensions.width / 2} cy={10} r={5} fill="url('#radialGradient')" />
                </motion.svg>}
                <motion.div
                className={cn(isOpen ? "visible" : "invisible", "absolute -mt-48 sm:-mt-56 sm:flex flex-col justify-center items-center")}
                variants={avatar}
                initial="hidden"
                animate={isOpen ? "show" : "hidden"}>
                    <Avatar />
                </motion.div>
            <ul className="grid grid-rows-2 grid-flow-col gap-4 md:flex md:flex-wrap md:justify-between w-fit pt-4 lg:gap-8">
                {startups.map((project, i) => (
                    <motion.li
                        className="flex justify-center"
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 1, delay: 1.2 + (i * 0.1), type: 'spring', bounce: 0.10 } }}
                        whileHover={{ scale: 1.1, className: project.bgColor, transition: { duration: 0.3, type: 'spring' } }}
                        key={i}
                    >
                        <Card {...project} />
                    </motion.li>
                ))}
            </ul>
        </div>
    )

};

const startups = [
    {
        title: "",
        description: "AI-Powered Stealth Startup (YC S24)",
        href: "/",
        bgColor: "bg-gradient-to-br from-orange-500 to-rose-400 hover:bg-gradient-to-tl",
    },
    {
        title: "BLACKIVY",
        description: "Alumni club for brillant black minds.",
        href: "https://blkivy.club/",
        image: BLACKIVY,
        bgColor: "bg-gradient-to-b from-black to-slate-600",
    },
    {
        title: "Shipp",
        description: "Online dating sucks. Meet IRL.",
        href: "https://apps.apple.com/us/app/shipp-dating-app/id6445876197",
        image: Shipp,
        bgColor: "bg-gradient-to-b from-amber-50 from-50% to-[#50C4BF]",
    },
    {
        title: "Common Cents",
        description: "Personal finance education nonprofit.",
        href: "https://commoncents.org",
        image: CommonCents,
        bgColor: "bg-gradient-to-br from-zinc-300 from-33% to-slate-400",
    },
]

const lineStyle = {
    strokeWidth: "2.5px",
    paintOrder: "stroke",
    stroke: "url('#lineGradient')",
    fill: "none",
};

const gradientStop1 = {
    stopColor: "rgb(100% 76.471% 44.314%)"
}

const gradientStop2 = {
    stopColor: "rgb(255, 95, 109)"
}

const Avatar = () => (
    <div className="flex flex-col items-center justify-center">
        <img src={Selfie.src} alt="Selfie" loading="eager" className="object-cover rounded-xl aspect-square w-48 sm:w-52 drop-shadow-2xl" />
        <svg width={1} height={15} className='h-2 sm:h-5'>
            <line
                strokeLinecap={"round"}
                style={lineStyle} x1="0" y1="0" x2="0" y2="75" />
            </svg>
    </div>
);
import type { ClassValue } from "clsx";
import { cn } from "../utils";

interface Props {
	title: string;
	description: string;
	href: string;
	bgColor: ClassValue;
	image?: string;
}

export default function Card({ title, description, href, image, bgColor }: Props) {
	return (
		<a
			href={href}
			target="_blank" rel="noopener noreferrer"
			className={cn(bgColor, "drop-shadow-xl", "rounded-2xl flex flex-col p-4 bg-slate-500 text-white items-center justify-between gap-1 w-36 h-36 sm:w-48 sm:h-48 text-sm")}
		>
			<div className="flex flex-col items-center flex-1 justify-center text-center">
				{image ? <img src={image} alt={title} className="object-contain h-full max-h-12 sm:max-h-24" loading="eager" decoding="sync" /> : <h2 className="text-6xl sm:text-8xl text-right">{"?"}</h2>}
			</div>
			<p className="text-xs sm:text-md">
				{description}
			</p>
		</a>
	);
};

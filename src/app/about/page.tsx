import Image from "next/image";
import { Projects } from "@/components/Projects";
import YC from "@/images/y18.svg";
import Penn from "@/images/penn.png";
import BLACKIVY from "@/images/BLACKIVY.png";
import Shipp from "@/images/Shipp.png";
import CC from "@/images/CC-white.png";
import Affil from "@/images/Affil.png";

export const metadata = {
  title: "about",
};

const newLocal = "Personal finance education nonprofit.";
const startups = [
  {
    title: "Affil.ai",
    description: "AI-powered financial affiliate network.",
    href: "https://affil.ai",
    image: Affil,
    bgColor:
      "bg-gradient-to-br from-blue-950 to-blue-900 hover:bg-gradient-to-tl",
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
    description: newLocal,
    href: "https://commoncents.org",
    image: CC,
    bgColor: "bg-gradient-to-br from-zinc-300 from-33% to-slate-400",
  },
];

export default function AboutPage() {
  return (
    <main className="flex flex-col px-8 text-center text-white w-full max-w-screen-lg h-fit max-h-screen">
      <h1 className="name [--slidein-delay:200ms]">Vivek Olumbe</h1>
      <div className="flex flex-col gap-3 sm:gap-6 text-center items-center mb-4">
        <p className="badge opacity-0 [--slidein-delay:300ms]">
          Backed by{" "}
          <Image src={YC} alt="Y Combinator" className="logo" loading="eager" />
          <span className="text-[#E96F37]">Combinator</span>
        </p>
        <p className="badge [--slidein-delay:400ms]">
          Taught at{" "}
          <Image src={Penn} alt="UPenn" className="logo" loading="eager" />
          <span className="text-[#011F5B]">Penn</span>
        </p>
        <p className="badge [--slidein-delay:500ms]">Raised in Philly</p>
        <p className="badge [--slidein-delay:600ms]">Made in 🌍</p>
      </div>
      <Projects startups={startups} />
    </main>
  );
}

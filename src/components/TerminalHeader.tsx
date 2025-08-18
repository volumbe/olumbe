import Link from "next/link";
import ElapsedTimer from "./ElapsedTimer";

export default function TerminalHeader() {
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-slate-800/70 bg-slate-900/60">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="h-3 w-3 rounded-full bg-red-500/80 cursor-pointer"
        />
        <Link
          href="/about"
          className="h-3 w-3 rounded-full bg-amber-400/80 cursor-pointer"
        />
        <Link
          href="/docs"
          className="h-3 w-3 rounded-full bg-emerald-400/80 cursor-pointer"
        />
      </div>
      {/* <p className="text-[0.8rem] text-slate-300/80 font-medium tracking-wide"></p> */}
      <ElapsedTimer />
    </header>
  );
}

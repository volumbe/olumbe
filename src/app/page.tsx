"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

type OutputLine = {
  text: string;
  variant: "system" | "user" | "info";
};

export default function Terminal() {
  const [output, setOutput] = useState<OutputLine[]>([
    { text: "Welcome to the Olumbe terminal.", variant: "system" },
    { text: "Type /help for options.", variant: "system" },
  ]);
  const [input, setInput] = useState("");
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  type CommandHelp = { name: string; description: string };
  const availableCommands: CommandHelp[] = [
    { name: "/help", description: "Show this help" },
    { name: "/clear", description: "Clear the terminal" },
  ];

  const filteredCommands: CommandHelp[] = (() => {
    const trimmed = input.trim();
    if (!trimmed.startsWith("/")) return [];
    const query = trimmed.slice(1).toLowerCase();
    if (query.length === 0) return availableCommands;
    return availableCommands.filter((cmd) =>
      cmd.name.slice(1).toLowerCase().startsWith(query)
    );
  })();

  const appendLine = (
    text: string,
    variant: "system" | "user" | "info" = "user"
  ) => {
    setOutput((prev) => [...prev, { text, variant }]);
  };

  const showHelp = () => {
    appendLine("Available commands:", "info");
    availableCommands.forEach((cmd) =>
      appendLine(`  ${cmd.name.padEnd(7, " ")} - ${cmd.description}`, "system")
    );
  };

  const handleCommand = (command: string) => {
    const trimmedCommand = command.trim();
    if (!trimmedCommand) return;

    appendLine(`guest@olumbe: ${trimmedCommand}`);

    if (!trimmedCommand.startsWith("/")) {
      appendLine("Commands must start with '/'. Try /help.", "system");
      return;
    }

    const normalized = trimmedCommand.slice(1).toLowerCase();

    switch (normalized) {
      case "clear":
        setOutput([]);
        break;
      case "help":
        showHelp();
        break;
      default:
        appendLine(`Unknown command: ${trimmedCommand}. Type /help.`, "system");
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTo({
        top: outputRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [output]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  return (
    <main className="w-full h-screen px-0 sm:px-0">
      <section
        className="relative h-full w-full flex flex-col rounded-none border border-slate-800/70 bg-gradient-to-b from-slate-900/70 to-black/80 shadow-2xl shadow-emerald-500/10 backdrop-blur-md overflow-hidden"
        onClick={handleTerminalClick}
      >
        <header className="flex items-center justify-between px-4 py-2 border-b border-slate-800/70 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500/80"></span>
            <span className="h-3 w-3 rounded-full bg-amber-400/80"></span>
            <span className="h-3 w-3 rounded-full bg-emerald-400/80"></span>
          </div>
          <p className="text-[0.8rem] text-slate-300/80 font-medium tracking-wide">
            guest@olumbe
          </p>
          <div className="w-12" aria-hidden="true"></div>
        </header>

        <div className="px-4 pt-0 pb-3 sm:px-4 sm:pt-0 sm:pb-4 flex-1 flex flex-col min-h-0">
          <div
            ref={outputRef}
            className="font-mono text-sm leading-relaxed text-slate-200/95 flex-1 overflow-y-auto pr-2 no-scrollbar"
            aria-live="polite"
            aria-relevant="additions"
          >
            <ol className="space-y-1">
              {output.map((line, index) => (
                <li
                  key={index}
                  className={
                    line.variant === "system"
                      ? "text-slate-400"
                      : line.variant === "info"
                      ? "text-emerald-300"
                      : "text-slate-100"
                  }
                >
                  {line.text}
                </li>
              ))}
            </ol>
          </div>

          <form className="mt-3" onSubmit={handleSubmit}>
            <AnimatePresence>
              {input.trim().startsWith("/") && (
                <motion.div
                  key="cmd-tooltip"
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 32,
                    mass: 0.6,
                  }}
                  className="mb-2 rounded-md border border-slate-800/70 bg-slate-900/95 backdrop-blur px-3 py-2 shadow-xl"
                >
                  <p className="text-[0.7rem] uppercase tracking-wider text-slate-400 mb-1">
                    Available commands
                  </p>
                  <motion.ul
                    layout
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    variants={{
                      hidden: {
                        transition: {
                          staggerChildren: 0.015,
                          staggerDirection: -1,
                        },
                      },
                      show: { transition: { staggerChildren: 0.04 } },
                    }}
                    className="text-sm font-mono text-slate-100 space-y-1"
                  >
                    <AnimatePresence initial={false} mode="popLayout">
                      {(filteredCommands.length > 0
                        ? filteredCommands
                        : availableCommands
                      ).map((cmd) => (
                        <motion.li
                          key={cmd.name}
                          layout
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="flex items-center gap-2"
                        >
                          <span className="text-emerald-300 whitespace-nowrap">
                            {cmd.name}
                          </span>
                          <span className="text-slate-400">
                            - {cmd.description}
                          </span>
                        </motion.li>
                      ))}
                      {filteredCommands.length === 0 &&
                        input.trim().startsWith("/") &&
                        input.trim().length > 1 && (
                          <motion.li
                            key="no-match"
                            layout
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="text-slate-400"
                          >
                            No matching commands
                          </motion.li>
                        )}
                    </AnimatePresence>
                  </motion.ul>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="group flex items-center gap-2 rounded-lg border border-slate-800/70 bg-slate-900/40 px-3 py-2 focus-within:border-emerald-400/60 focus-within:shadow-[0_0_0_3px_rgba(52,211,153,0.15)] transition">
              <span className="select-none text-emerald-400">
                guest@olumbe:
              </span>
              <input
                ref={inputRef}
                type="text"
                name="command"
                autoComplete="off"
                placeholder="Start typing… (try: /help, /clear)"
                className="min-w-0 flex-1 bg-transparent outline-none placeholder-slate-500 text-slate-100 caret-emerald-400"
                aria-label="Terminal input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </form>
        </div>

        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5"></div>
      </section>
    </main>
  );
}

"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ChatMessage } from "@/app/types";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/utils";

type OutputLine = {
  text: string;
  variant: "system" | "user" | "info";
  createdAt: number;
};

type TerminalProps = {
  variant?: "full" | "overlay";
};

export default function Terminal({ variant = "full" }: TerminalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [input, setInput] = useState("");
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messageTimestampsRef = useRef<Map<string, number>>(new Map());

  const { messages, sendMessage, status, stop, setMessages } =
    useChat<ChatMessage>({
      transport: new DefaultChatTransport({ api: "/api/chat" }),
    });

  type CommandHelp = { name: string; description: string };
  const baseCommands: CommandHelp[] = [
    { name: "/help", description: "Show this help" },
    { name: "/clear", description: "Clear the terminal" },
  ];

  const availableCommands: CommandHelp[] = useMemo(() => {
    const navCommands: CommandHelp[] = [
      { name: "/docs", description: "Go to docs" },
      { name: "/about", description: "Go to about page" },
      { name: "/home", description: "Go home" },
    ];

    const isOnDocs = pathname?.startsWith("/docs");
    const isOnAbout = pathname === "/about";
    const isOnHome = pathname === "/";

    const filteredNav = navCommands.filter((cmd) => {
      if (cmd.name === "/docs" && isOnDocs) return false;
      if (cmd.name === "/about" && isOnAbout) return false;
      if (cmd.name === "/home" && isOnHome) return false;
      return true;
    });

    return [...baseCommands, ...filteredNav];
  }, [pathname]);

  const filteredCommands: CommandHelp[] = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed.startsWith("/")) return [];
    const query = trimmed.slice(1).toLowerCase();
    if (query.length === 0) return availableCommands;
    return availableCommands.filter((cmd) =>
      cmd.name.slice(1).toLowerCase().startsWith(query)
    );
  }, [input, availableCommands]);

  const appendLine = (
    text: string,
    variant: "system" | "user" | "info" = "user"
  ) => {
    setOutput((prev) => [...prev, { text, variant, createdAt: Date.now() }]);
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

    // Non-command input goes to chat endpoint
    if (!trimmedCommand.startsWith("/")) {
      sendMessage({
        text: trimmedCommand,
        metadata: { createdAt: Date.now() },
      });
      return;
    }

    // For commands, echo the command to the terminal output
    appendLine(`guest@olumbe: ${trimmedCommand}`);

    const normalized = trimmedCommand.slice(1).toLowerCase();

    switch (normalized) {
      case "clear":
        setOutput([]);
        setMessages([]);
        messageTimestampsRef.current.clear();
        stop();
        break;
      case "help":
        showHelp();
        break;
      case "docs":
        router.push("/docs");
        setOutput([]);
        setMessages([]);
        messageTimestampsRef.current.clear();
        break;
      case "about":
        router.push("/about");
        setOutput([]);
        setMessages([]);
        messageTimestampsRef.current.clear();
        break;
      case "home":
        router.push("/");
        setOutput([]);
        setMessages([]);
        messageTimestampsRef.current.clear();
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

  const resizeTextArea = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    const container = outputRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, output]);

  useEffect(() => {
    // Initial focus
    const timer = setTimeout(() => {
      inputRef.current?.focus();
      resizeTextArea(inputRef.current);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    resizeTextArea(inputRef.current);
  }, [input]);

  const handleTerminalClick = (e: React.MouseEvent) => {
    // Only focus if we didn't click on the textarea itself
    if (e.target !== inputRef.current) {
      inputRef.current?.focus();
    }
  };

  const getMessageCreatedAt = (m: ChatMessage): number => {
    const ts = m?.metadata?.createdAt;
    if (typeof ts === "number") return ts;
    const existing = messageTimestampsRef.current.get(m.id);
    if (existing !== undefined) return existing;
    const now = Date.now();
    messageTimestampsRef.current.set(m.id, now);
    return now;
  };

  const mergedItems = useMemo(() => {
    const chatItems = messages.map((m) => ({
      createdAt: getMessageCreatedAt(m),
      key: `chat-${m.id}`,
      jsx: (
        <li key={`chat-${m.id}`} className="text-slate-100">
          <span className="text-emerald-300 mr-2">
            {m.role === "user" ? "guest@olumbe:" : "vivek@olumbe:"}
          </span>
          {m.parts.map((part, idx) =>
            part.type === "text" ? <span key={idx}>{part.text}</span> : null
          )}
        </li>
      ),
    }));

    const outputItems = output.map((line, index) => ({
      createdAt: line.createdAt,
      key: `out-${index}-${line.createdAt}`,
      jsx: (
        <li
          key={`out-${index}-${line.createdAt}`}
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
      ),
    }));

    const allItems = [...chatItems, ...outputItems].sort(
      (a, b) => a.createdAt - b.createdAt
    );

    // Add loading indicator when waiting or when streaming but no content yet
    if (status === "submitted" || status === "streaming") {
      // Check if there's an assistant message with content already
      const lastMessage = messages[messages.length - 1];
      const hasAssistantContent = lastMessage && 
        lastMessage.role === "assistant" && 
        lastMessage.parts.some(p => p.type === "text" && p.text && p.text.length > 0);
      
      // Only show loading if there's no assistant content yet
      if (!hasAssistantContent) {
        allItems.push({
          createdAt: Date.now(),
          key: "loading",
          jsx: (
            <li key="loading" className="text-slate-100 whitespace-nowrap">
              <span className="text-emerald-300">vivek@olumbe: </span>
              <span className="animate-pulse text-slate-400">•</span>
              <span className="animate-pulse animation-delay-200 text-slate-400">•</span>
              <span className="animate-pulse animation-delay-400 text-slate-400">•</span>
            </li>
          ),
        });
      }
    }

    return allItems;
  }, [messages, output, status]);

  const isOverlay = variant === "overlay";

  const terminalContent = (
    <section
      className={cn(
        "relative w-full flex flex-col rounded-none overflow-hidden",
        isOverlay ? "pointer-events-auto h-auto" : "h-full"
      )}
      onClick={handleTerminalClick}
    >
      <div
        className={cn(
          "px-4 pt-0 pb-3 sm:px-4 sm:pt-0 sm:pb-4 flex flex-col min-h-0",
          isOverlay ? "" : "flex-1"
        )}
      >
        <div
          ref={outputRef}
          className={cn(
            "font-mono text-sm leading-relaxed text-slate-200/95 pr-2 no-scrollbar",
            isOverlay
              ? "max-h-[40vh] overflow-y-auto"
              : "flex-1 overflow-y-auto"
          )}
          aria-live="polite"
          aria-relevant="additions"
        >
          <ol className="space-y-1">{mergedItems.map((item) => item.jsx)}</ol>
        </div>

        <form className="mt-3" onSubmit={handleSubmit}>
          {input.trim().startsWith("/") && (
            <div className="mb-2 rounded-md border border-slate-800/70 bg-slate-900/95 backdrop-blur px-3 py-2 shadow-xl">
              <p className="text-[0.7rem] uppercase tracking-wider text-slate-400 mb-1">
                Available commands
              </p>
              <ul className="text-sm font-mono text-slate-100 space-y-1">
                {(filteredCommands.length > 0
                  ? filteredCommands
                  : availableCommands
                ).map((cmd) => (
                  <li key={cmd.name} className="flex items-center gap-2">
                    <span className="text-emerald-300 whitespace-nowrap">
                      {cmd.name}
                    </span>
                    <span className="text-slate-400">- {cmd.description}</span>
                  </li>
                ))}
                {filteredCommands.length === 0 &&
                  input.trim().startsWith("/") &&
                  input.trim().length > 1 && (
                    <li className="text-slate-400">No matching commands</li>
                  )}
              </ul>
            </div>
          )}
          <div className="group flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 rounded-lg border border-slate-800/70 bg-slate-900/40 px-3 py-2 focus-within:border-emerald-400/60 focus-within:shadow-[0_0_0_3px_rgba(52,211,153,0.15)] transition">
            <span className="select-none text-emerald-400">guest@olumbe:</span>
            <textarea
              ref={inputRef}
              rows={1}
              name="command"
              autoComplete="off"
              autoFocus
              placeholder="Start typing… (try: /help, /clear)"
              className="min-w-0 w-full sm:flex-1 bg-transparent outline-none placeholder-slate-500 text-slate-100 caret-emerald-400 resize-none overflow-hidden"
              aria-label="Terminal input"
              value={input}
              onChange={(e) => {
                const value = e.target.value;
                setInput(value);
                resizeTextArea(e.currentTarget);
              }}
              onKeyDown={handleKeyDown}
            />
          </div>
        </form>
      </div>

      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5"></div>
    </section>
  );

  return isOverlay ? (
    <div className="fixed inset-x-0 bottom-0 z-50 pointer-events-none">
      {terminalContent}
    </div>
  ) : (
    <main className="w-full h-full">{terminalContent}</main>
  );
}

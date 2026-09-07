"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Send, X } from "lucide-react";
import { money } from "@/lib/products";
import type { ApiProduct } from "@/lib/serialize-product";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  products?: ApiProduct[];
};

const WELCOME: ChatMessage = {
  role: "assistant",
  content: "Hi! Tell me who you're shopping for and I'll suggest a few things from StyleRoute — e.g. \"something for a 3 year old boy's birthday\".",
};

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  if (pathname?.startsWith("/admin")) return null;

  const handleSend = async (event: FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: nextMessages.slice(-8).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((m) => [...m, { role: "assistant", content: data.error ?? "Something went wrong — try again?" }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: data.reply, products: data.products }]);
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Couldn't reach the assistant — try again?" }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open shopping assistant"
          className="fixed bottom-5 left-5 z-30 flex items-center gap-2 rounded-full bg-black px-5 py-4 text-sm font-bold text-white shadow-xl hover:bg-neutral-800"
        >
          <MessageCircle size={18} className="text-brand-gold" /> Ask StyleRoute
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 left-5 z-50 flex h-[32rem] w-[min(24rem,calc(100vw-2.5rem))] flex-col bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-black px-5 py-4 text-white">
            <div>
              <p className="text-xs font-bold tracking-[.2em] text-brand-gold">AI ASSISTANT</p>
              <p className="text-sm font-black uppercase">Ask StyleRoute</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="text-neutral-300 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
                <p
                  className={`inline-block max-w-[85%] px-4 py-2.5 text-sm leading-5 ${
                    msg.role === "user" ? "bg-black text-white" : "bg-neutral-100 text-neutral-800"
                  }`}
                >
                  {msg.content}
                </p>
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {msg.products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="block border border-neutral-200 text-left hover:border-black"
                      >
                        <div className="relative aspect-[.9] overflow-hidden bg-neutral-100">
                          <Image src={product.image} alt={product.name} fill sizes="10rem" className="object-cover" />
                        </div>
                        <div className="p-2">
                          <p className="truncate text-xs font-bold">{product.name}</p>
                          <p className="text-xs font-black">{money(product.price)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {sending && <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Thinking…</p>}
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-neutral-200 p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask for a recommendation…"
              className="w-full text-sm outline-none placeholder:text-neutral-400"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send"
              className="text-black disabled:opacity-30"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

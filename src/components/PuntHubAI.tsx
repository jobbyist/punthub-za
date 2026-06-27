import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, LifeBuoy, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type Msg = { role: "user" | "assistant" | "system"; content: string };

const SUGGESTED = [
  "How do I make a deposit?",
  "When will I receive my payout?",
  "Why isn't my bonus activated?",
  "How do I verify my account?",
  "How do withdrawals work?",
  "What payment methods are accepted?",
  "How long does verification take?",
  "How do prediction markets work?",
  "What sports are available?",
  "How do bonuses work?",
];

const SYSTEM = `You are PuntHub AI, the on-site assistant for PuntHub™ (a South African prediction markets, casino and sports betting platform operated by Gravitas Industries Pty Ltd, 7 Harvard Street, Kempton Park, Gauteng).
Help with: deposits, withdrawals (R10 fee, EFT/PayPal/Crypto unlimited; 1Voucher/FNB eWallet/CashSend/Instant Money capped at R3,000), KYC verification, bonuses, prediction markets, casino, sports betting, responsible gaming and account questions.
Promote responsible gaming (18+, SARGF 0800 006 008). If you are not confident or the user asks for a human, recommend contacting support: support@punthub.fun or opening a ticket via Help Centre.
Keep answers short, friendly, accurate. Never invent legal, payment processing or odds information.`;

const PuntHubAI = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm PuntHub AI. Ask me anything about deposits, withdrawals, verification, markets or bonuses." },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, open]);

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    const next = [...msgs, { role: "user" as const, content: text.trim() }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("punthub-ai", {
        body: { messages: [{ role: "system", content: SYSTEM }, ...next] },
      });
      if (error) throw error;
      const reply = data?.reply || "I'm not sure about that. Would you like me to connect you with support?";
      setMsgs((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e: any) {
      setMsgs((m) => [...m, { role: "assistant", content: "I couldn't reach the assistant right now. You can email support@punthub.fun or open a ticket in the Help Centre." }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open PuntHub AI"
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-[55] gradient-border"
      >
        <span className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-background text-foreground font-semibold text-sm shadow-glow">
          <Bot className="h-4 w-4 text-primary" /> PuntHub AI
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="fixed bottom-4 right-4 left-4 md:left-auto md:right-6 md:bottom-6 md:w-[400px] z-[60]"
          >
            <div className="glass-card overflow-hidden flex flex-col h-[520px] shadow-elevated">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-full bg-foreground text-background grid place-items-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-sm">PuntHub AI</p>
                    <p className="text-[10px] text-muted-foreground">Powered by Google Gemini</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close"><X className="h-4 w-4" /></Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
                {msgs.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                      m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                    }`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {busy && <div className="text-xs text-muted-foreground animate-pulse">PuntHub AI is thinking…</div>}

                {msgs.length <= 1 && (
                  <div className="pt-2">
                    <p className="text-[11px] font-semibold text-muted-foreground mb-2">Suggested</p>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTED.slice(0, 6).map((s) => (
                        <button key={s} onClick={() => send(s)} className="text-[11px] px-2.5 py-1 rounded-full border border-border hover:border-primary hover:text-primary">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={endRef} />
              </div>

              {/* Escalation */}
              <div className="px-3 py-2 border-t border-border flex items-center gap-2 text-[11px] text-muted-foreground">
                <LifeBuoy className="h-3.5 w-3.5" />
                Need a human?{" "}
                <a href="/contact" className="text-primary font-medium underline-offset-2 hover:underline">Contact Support</a>
                <span>·</span>
                <a href="/help" className="text-primary font-medium underline-offset-2 hover:underline inline-flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Ticket</a>
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="p-3 border-t border-border flex gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything…"
                  className="flex-1 rounded-full bg-secondary border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  aria-label="Message PuntHub AI"
                />
                <Button type="submit" size="icon" className="rounded-full" disabled={busy || !input.trim()} aria-label="Send">
                  <Send className="h-4 w-4" />
                </Button>
              </form>

              <p className="text-[10px] text-muted-foreground px-3 pb-2 text-center">
                This conversation may be used for training purposes to improve our AI services.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PuntHubAI;

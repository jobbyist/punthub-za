import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Banknote, Bitcoin, Ticket } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const METHODS = [
  { id: "visa", label: "Visa", icon: CreditCard, note: "Instant · 1.5% fee may apply" },
  { id: "mastercard", label: "Mastercard", icon: CreditCard, note: "Instant · 1.5% fee may apply" },
  { id: "eft", label: "Bank Transfer / EFT", icon: Banknote, note: "Cleared within 1 working day" },
  { id: "coinbase", label: "Coinbase Crypto", icon: Bitcoin, note: "BTC · ETH · USDC · SOL" },
  { id: "1voucher", label: "1Voucher", icon: Ticket, note: "Redeem at over 65,000 retailers" },
];

const Deposit = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [method, setMethod] = useState<string>("visa");
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!user) return navigate("/login");
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return toast({ title: "Enter an amount", variant: "destructive" });
    setBusy(true);
    const { error } = await supabase.from("deposits").insert({
      user_id: user.id, method, amount: amt, currency: "ZAR", status: "pending",
    });
    setBusy(false);
    if (error) return toast({ title: "Deposit failed", description: error.message, variant: "destructive" });
    toast({ title: "Deposit submitted", description: `R${amt.toFixed(2)} via ${method.toUpperCase()} is processing.` });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-28 md:pb-12">
        <div className="container max-w-2xl py-10">
          <h1 className="font-heading text-3xl font-bold mb-2">Deposit</h1>
          <p className="text-muted-foreground text-sm mb-6">Choose a payment method and amount to fund your wallet.</p>

          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {METHODS.map((m) => {
              const I = m.icon;
              const active = method === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`glass-card p-4 text-left transition-all ${active ? "ring-2 ring-primary shadow-glow" : "hover:border-primary/40"}`}
                >
                  <div className="flex items-center justify-between">
                    <I className="h-6 w-6 text-primary" />
                    {active && <span className="text-[10px] font-semibold text-primary">SELECTED</span>}
                  </div>
                  <p className="mt-3 font-semibold text-sm">{m.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{m.note}</p>
                </button>
              );
            })}
          </div>

          <Card className="glass-card border-none">
            <CardContent className="py-5 space-y-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount (ZAR)</label>
              <Input type="number" inputMode="decimal" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="text-2xl h-14 rounded-xl" />
              <div className="flex gap-2 flex-wrap">
                {[100, 250, 500, 1000, 2500].map((v) => (
                  <button key={v} onClick={() => setAmount(String(v))} className="px-3 py-1.5 rounded-full border border-border text-xs hover:border-primary hover:text-primary">
                    R{v}
                  </button>
                ))}
              </div>
              <Button disabled={busy} className="w-full shadow-glow" onClick={submit}>
                {busy ? "Processing…" : `Deposit ${amount ? `R${amount}` : ""}`}
              </Button>
              <p className="text-[11px] text-muted-foreground text-center">
                Banking details are configurable. Real payment processor integration follows once your provider account is connected.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Deposit;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Banknote, Wallet, Bitcoin, Ticket, Smartphone, ShieldAlert } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { VerificationBadge } from "@/components/VerificationBadge";
import { Link } from "react-router-dom";

const FEE = 10;
const CAPPED = ["1voucher", "fnb_ewallet", "absa_cashsend", "sb_instant_money"];

const METHODS = [
  { id: "eft", label: "Bank Transfer / EFT", icon: Banknote, eta: "1–3 working days", limit: "Unlimited" },
  { id: "paypal", label: "PayPal", icon: Wallet, eta: "Within 24 hours", limit: "Unlimited" },
  { id: "coinbase", label: "Coinbase Crypto", icon: Bitcoin, eta: "Network-dependent", limit: "Unlimited" },
  { id: "1voucher", label: "1Voucher", icon: Ticket, eta: "Instant", limit: "R3,000" },
  { id: "fnb_ewallet", label: "FNB eWallet", icon: Smartphone, eta: "Instant", limit: "R3,000" },
  { id: "absa_cashsend", label: "Absa CashSend", icon: Smartphone, eta: "Instant", limit: "R3,000" },
  { id: "sb_instant_money", label: "Standard Bank Instant Money", icon: Smartphone, eta: "Instant", limit: "R3,000" },
];

const Withdraw = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [verification, setVerification] = useState<any>("unverified");
  const [method, setMethod] = useState("eft");
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("verification_status").eq("id", user.id).maybeSingle()
      .then(({ data }) => setVerification(data?.verification_status || "unverified"));
  }, [user]);

  const submit = async () => {
    if (!user) return navigate("/login");
    if (verification !== "approved") return toast({ title: "Verification required", description: "Please complete account verification first.", variant: "destructive" });
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return toast({ title: "Enter an amount", variant: "destructive" });
    if (CAPPED.includes(method) && amt > 3000) return toast({ title: "Method limit exceeded", description: "This method is capped at R3,000 per transaction.", variant: "destructive" });
    setBusy(true);
    const { error } = await supabase.from("withdrawals").insert({
      user_id: user.id, method, amount: amt, fee: FEE, currency: "ZAR", status: "pending",
    });
    setBusy(false);
    if (error) return toast({ title: "Withdrawal failed", description: error.message, variant: "destructive" });
    toast({ title: "Withdrawal requested", description: `R${amt.toFixed(2)} via ${method.toUpperCase()} is pending review.` });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-28 md:pb-12">
        <div className="container max-w-2xl py-10">
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-heading text-3xl font-bold">Withdraw</h1>
            <VerificationBadge status={verification} />
          </div>
          <p className="text-muted-foreground text-sm mb-6">A flat fee of <strong>R10</strong> applies per withdrawal. Method limits apply.</p>

          {verification !== "approved" && (
            <Card className="glass-card border-destructive/40 mb-5">
              <CardContent className="py-4 flex items-center gap-3">
                <ShieldAlert className="h-5 w-5 text-destructive shrink-0" />
                <div className="flex-1 text-sm">
                  Verify your account to enable withdrawals.
                </div>
                <Button asChild size="sm"><Link to="/verify">Verify Now</Link></Button>
              </CardContent>
            </Card>
          )}

          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {METHODS.map((m) => {
              const I = m.icon;
              const active = method === m.id;
              return (
                <button key={m.id} onClick={() => setMethod(m.id)}
                  className={`glass-card p-4 text-left transition-all ${active ? "ring-2 ring-primary shadow-glow" : "hover:border-primary/40"}`}>
                  <div className="flex items-center justify-between"><I className="h-6 w-6 text-primary" />
                    {active && <span className="text-[10px] font-semibold text-primary">SELECTED</span>}</div>
                  <p className="mt-3 font-semibold text-sm">{m.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{m.eta} · Limit {m.limit}</p>
                </button>
              );
            })}
          </div>

          <Card className="glass-card border-none">
            <CardContent className="py-5 space-y-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount (ZAR)</label>
              <Input type="number" inputMode="decimal" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="text-2xl h-14 rounded-xl" />
              <div className="text-sm flex justify-between text-muted-foreground">
                <span>Fee</span><span>R{FEE.toFixed(2)}</span>
              </div>
              {amount && (
                <div className="text-sm flex justify-between font-semibold">
                  <span>You receive</span><span>R{Math.max(0, parseFloat(amount) - FEE).toFixed(2)}</span>
                </div>
              )}
              <Button disabled={busy || verification !== "approved"} className="w-full shadow-glow" onClick={submit}>
                {busy ? "Submitting…" : "Request Withdrawal"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Withdraw;

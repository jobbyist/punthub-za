import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["Registration", "Deposits", "Withdrawals", "Verification", "Bonuses", "Casino", "Sports Betting", "Prediction Markets", "Responsible Gaming", "Security", "Promotions", "Account Recovery", "Payment Methods", "Technical Support", "Account Closure"];

const FAQS = [
  ["How do I register an account?", "Click Sign Up Free, enter your email and a unique @username, set a password and confirm via the verification email."],
  ["What deposit methods do you accept?", "Visa, Mastercard, Bank Transfer (EFT), Coinbase Crypto and 1Voucher. More are coming soon."],
  ["How long do withdrawals take?", "PayPal within 24 hours, EFT 1–3 working days, crypto network-dependent, vouchers/eWallets are typically instant."],
  ["Is there a withdrawal fee?", "Yes, a flat R10 fee per withdrawal applies."],
  ["How do I verify my account?", "Upload a government-issued ID, take a selfie, and provide proof of address. Verification is typically reviewed within 24–48 hours."],
  ["Why is my bonus not activated?", "Most bonuses require a verified account and a qualifying deposit. Check the bonus terms in your dashboard."],
  ["How do prediction markets work?", "Each market poses a real-world question. You stake PuntPoints on Yes or No at the current implied price. If your side resolves true, you win the pot."],
  ["What sports can I bet on?", "Football, rugby, cricket, F1, basketball, tennis, boxing and golf — with more added regularly."],
  ["How do I play casino games?", "Open the Casino tab and pick a slot or table game from a licensed provider. Bets are placed in ZAR or PuntPoints."],
  ["How are my funds kept secure?", "We use enterprise-grade encryption, segregated player wallets and KYC/AML controls."],
  ["What if I forget my password?", "Use Forgot Password on the login page. We'll email a secure reset link."],
  ["Can I close my account?", "Yes. Contact support and we'll process account closure within 7 working days."],
  ["What payment methods are supported for withdrawal?", "EFT, PayPal, Coinbase Crypto, 1Voucher, FNB eWallet, Absa CashSend, Standard Bank Instant Money."],
  ["What are the withdrawal limits?", "EFT, PayPal and Crypto are unlimited. 1Voucher, FNB eWallet, CashSend and Instant Money are capped at R3,000 per transaction."],
  ["Are there responsible gaming tools?", "Yes — set deposit/daily/weekly/monthly limits, session timers, reality checks, cooling-off and self-exclusion in your account."],
  ["Who do I contact for support?", "Email support@punthub.fun or open a ticket via Help Centre. PuntHub AI can also answer most account questions instantly."],
];

const Contact = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ subject: "", category: CATEGORIES[0], message: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast({ title: "Please log in to submit a ticket", variant: "destructive" });
    setBusy(true);
    const { error } = await supabase.from("support_tickets").insert({ user_id: user.id, ...form });
    setBusy(false);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Ticket created", description: "We'll respond by email shortly." });
    setForm({ subject: "", category: CATEGORIES[0], message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-28 md:pb-12">
        <div className="container max-w-4xl py-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Contact Centre</h1>
          <p className="text-muted-foreground mb-8">We're here to help — search the FAQs first, or open a ticket below.</p>

          <div className="grid md:grid-cols-3 gap-4 mb-10">
            <a href="mailto:support@punthub.fun" className="glass-card p-5 hover:shadow-glow transition-shadow">
              <Mail className="h-6 w-6 text-primary mb-2" />
              <p className="font-semibold">Support Email</p>
              <p className="text-xs text-muted-foreground">support@punthub.fun</p>
            </a>
            <a href="mailto:punthub@gravitas.uno" className="glass-card p-5 hover:shadow-glow transition-shadow">
              <Mail className="h-6 w-6 text-primary mb-2" />
              <p className="font-semibold">Corporate</p>
              <p className="text-xs text-muted-foreground">punthub@gravitas.uno</p>
            </a>
            <div className="glass-card p-5">
              <MessageSquare className="h-6 w-6 text-primary mb-2" />
              <p className="font-semibold">PuntHub AI</p>
              <p className="text-xs text-muted-foreground">Tap the floating AI button anywhere on the site.</p>
            </div>
          </div>

          <form onSubmit={submit} className="glass-card p-6 space-y-3 mb-12">
            <h2 className="font-heading font-bold text-lg">Open a ticket</h2>
            <Input required placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Textarea required rows={5} placeholder="How can we help?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <Button disabled={busy} className="shadow-glow">{busy ? "Submitting…" : "Submit Ticket"}</Button>
          </form>

          <h2 className="font-heading text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="glass-card px-4">
            {FAQS.map(([q, a], i) => (
              <AccordionItem key={i} value={`q-${i}`}>
                <AccordionTrigger className="text-left">{q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;

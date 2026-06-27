import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Crown, Rocket, Gift, Sparkles, Download } from "lucide-react";

const LAUNCH = new Date("2026-09-01T00:00:00Z").getTime();

const tiers = [
  { name: "Founder", perks: ["50% first deposit bonus", "Founder badge", "Priority support"] },
  { name: "Founder+", perks: ["Everything in Founder", "5,000 PuntPoints airdrop", "Early Sports access"] },
  { name: "Founder Elite", perks: ["Everything in Founder+", "Lifetime fee waiver", "$PUNT token allocation"] },
];

const roadmap = [
  { q: "Q1 2026", m: "Public beta · Prediction markets · KYC live" },
  { q: "Q2 2026", m: "Casino launch · Rewards centre v2" },
  { q: "Q3 2026", m: "Sports betting · Mobile PWA · Multi-currency wallet" },
  { q: "Q4 2026", m: "$PUNT token launch · DAO governance" },
];

const FoundingMembers = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, LAUNCH - Date.now());
      setT({
        d: Math.floor(diff / 86400_000),
        h: Math.floor((diff / 3600_000) % 24),
        m: Math.floor((diff / 60_000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Subscribed!", description: "We'll keep you in the loop." });
    setEmail("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-28 md:pb-12">
        <div className="container max-w-5xl py-12">
          <div className="text-center mb-10">
            <Crown className="h-10 w-10 text-punt-gold mx-auto mb-3" />
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-3">Founding Members Programme</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">Be among the first to shape PuntHub™. Lock in lifetime perks, early access and exclusive $PUNT token allocations.</p>
          </div>

          {/* Countdown */}
          <Card className="glass-card border-none shadow-glow mb-10">
            <CardContent className="py-6">
              <p className="text-xs uppercase tracking-widest text-center text-muted-foreground mb-3">Programme closes in</p>
              <div className="grid grid-cols-4 gap-2 max-w-md mx-auto text-center">
                {[["Days", t.d], ["Hours", t.h], ["Min", t.m], ["Sec", t.s]].map(([l, v]) => (
                  <div key={l as string} className="glass-card p-3">
                    <p className="font-heading text-2xl md:text-3xl font-bold text-primary">{String(v).padStart(2, "0")}</p>
                    <p className="text-[10px] text-muted-foreground">{l}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tiers */}
          <h2 className="font-heading text-2xl font-bold mb-4 text-center">Membership Tiers</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {tiers.map((tier, i) => (
              <Card key={tier.name} className={`glass-card border-none ${i === 1 ? "shadow-glow ring-2 ring-primary" : ""}`}>
                <CardContent className="py-6">
                  <div className="flex items-center gap-2 mb-3">
                    {i === 0 ? <Sparkles className="h-5 w-5 text-primary" /> : i === 1 ? <Rocket className="h-5 w-5 text-primary" /> : <Crown className="h-5 w-5 text-punt-gold" />}
                    <p className="font-heading font-bold">{tier.name}</p>
                  </div>
                  <ul className="text-sm space-y-1.5 text-muted-foreground">{tier.perks.map((p) => <li key={p}>• {p}</li>)}</ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Roadmap */}
          <h2 className="font-heading text-2xl font-bold mb-4 text-center">Roadmap</h2>
          <div className="grid md:grid-cols-4 gap-3 mb-12">
            {roadmap.map((r) => (
              <Card key={r.q} className="glass-card border-none">
                <CardContent className="py-5">
                  <p className="text-xs font-semibold text-primary">{r.q}</p>
                  <p className="text-sm mt-1">{r.m}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Whitepaper & newsletter */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="glass-card border-none">
              <CardContent className="py-6 text-center">
                <Download className="h-7 w-7 text-primary mx-auto mb-3" />
                <p className="font-heading font-bold">Whitepaper</p>
                <p className="text-sm text-muted-foreground mb-4">Read the full technical and economic overview.</p>
                <Button onClick={() => toast({ title: "Coming soon", description: "Whitepaper v1.0 publishes Q1 2026." })}>Download PDF</Button>
              </CardContent>
            </Card>
            <Card className="glass-card border-none">
              <CardContent className="py-6">
                <Gift className="h-7 w-7 text-punt-gold mb-3" />
                <p className="font-heading font-bold">Stay in the loop</p>
                <p className="text-sm text-muted-foreground mb-3">Be the first to hear about new tiers, perks and the $PUNT launch.</p>
                <form onSubmit={subscribe} className="flex gap-2">
                  <Input required type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <Button className="shadow-glow">Subscribe</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FoundingMembers;

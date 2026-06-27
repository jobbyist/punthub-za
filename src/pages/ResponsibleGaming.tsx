import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ResponsibleGaming = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [s, setS] = useState<any>({
    daily_deposit_limit: "", weekly_deposit_limit: "", monthly_deposit_limit: "",
    session_limit_minutes: "", reality_check_minutes: "",
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("responsible_gaming_settings").select("*").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => { if (data) setS(data); });
  }, [user]);

  const save = async () => {
    if (!user) return;
    setBusy(true);
    const payload: any = { user_id: user.id };
    for (const k of Object.keys(s)) payload[k] = s[k] === "" ? null : s[k];
    const { error } = await supabase.from("responsible_gaming_settings").upsert(payload, { onConflict: "user_id" });
    setBusy(false);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    toast({ title: "Saved", description: "Your responsible gaming settings have been updated." });
  };

  const setSelfExclude = async (days: number) => {
    if (!user) return;
    const until = new Date(Date.now() + days * 86400_000).toISOString();
    const { error } = await supabase.from("responsible_gaming_settings").upsert({ user_id: user.id, self_excluded_until: until }, { onConflict: "user_id" });
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Self-exclusion active", description: `Until ${new Date(until).toLocaleDateString()}` });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-28 md:pb-12">
        <div className="container max-w-3xl py-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Responsible Gaming</h1>
          <p className="text-muted-foreground mb-8">Stay in control with deposit limits, session timers, reality checks and self-exclusion.</p>

          <Card className="glass-card border-none mb-6">
            <CardContent className="py-6 space-y-4">
              <h2 className="font-heading font-bold">Deposit Limits (ZAR)</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                <Field label="Daily" value={s.daily_deposit_limit ?? ""} onChange={(v) => setS({ ...s, daily_deposit_limit: v })} />
                <Field label="Weekly" value={s.weekly_deposit_limit ?? ""} onChange={(v) => setS({ ...s, weekly_deposit_limit: v })} />
                <Field label="Monthly" value={s.monthly_deposit_limit ?? ""} onChange={(v) => setS({ ...s, monthly_deposit_limit: v })} />
              </div>

              <h2 className="font-heading font-bold pt-4">Time Controls</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Session limit (minutes)" value={s.session_limit_minutes ?? ""} onChange={(v) => setS({ ...s, session_limit_minutes: v })} />
                <Field label="Reality check (minutes)" value={s.reality_check_minutes ?? ""} onChange={(v) => setS({ ...s, reality_check_minutes: v })} />
              </div>
              <Button disabled={busy} onClick={save} className="shadow-glow">{busy ? "Saving…" : "Save Settings"}</Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-destructive/40 mb-6">
            <CardContent className="py-6">
              <h2 className="font-heading font-bold mb-2">Self-Exclusion & Cooling Off</h2>
              <p className="text-sm text-muted-foreground mb-4">Take a break for a set period. During this time, your account is locked from depositing or playing.</p>
              <div className="flex gap-2 flex-wrap">
                {[1, 7, 30, 90, 180].map((d) => (
                  <Button key={d} variant="outline" onClick={() => setSelfExclude(d)}>{d} day{d > 1 ? "s" : ""}</Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-none">
            <CardContent className="py-6 text-sm">
              <h2 className="font-heading font-bold mb-2">Need help?</h2>
              <p className="text-muted-foreground">
                South African Responsible Gambling Foundation toll-free counselling line: <strong>0800 006 008</strong> · WhatsApp HELP to <strong>076 675 0710</strong> · <a className="text-primary underline" href="https://www.responsiblegambling.org.za" target="_blank" rel="noopener noreferrer">responsiblegambling.org.za</a>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Field = ({ label, value, onChange }: any) => (
  <label className="text-xs">
    <span className="block mb-1 text-muted-foreground">{label}</span>
    <Input type="number" value={value} onChange={(e) => onChange(e.target.value)} />
  </label>
);

export default ResponsibleGaming;

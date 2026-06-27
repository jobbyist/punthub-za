import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Briefcase } from "lucide-react";

const Careers = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", message: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("cv_submissions").insert(form);
    setBusy(false);
    if (error) return toast({ title: "Submission failed", description: error.message, variant: "destructive" });
    toast({ title: "Thanks!", description: "We've received your CV and will be in touch when opportunities open." });
    setForm({ full_name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-28 md:pb-12">
        <div className="container max-w-2xl py-12">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="h-7 w-7 text-primary" />
            <h1 className="font-heading text-3xl font-bold">Careers</h1>
          </div>
          <Card className="glass-card border-none mb-6">
            <CardContent className="py-6 text-center">
              <p className="font-heading text-lg font-semibold">No vacancies are currently available.</p>
              <p className="text-sm text-muted-foreground mt-1">Submit your CV below for future opportunities.</p>
            </CardContent>
          </Card>

          <form onSubmit={submit} className="glass-card p-6 space-y-3">
            <Input required placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            <Input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Textarea placeholder="Tell us about yourself" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <Button disabled={busy} className="w-full shadow-glow">{busy ? "Submitting…" : "Submit CV"}</Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, Camera, FileText, MapPin, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { VerificationBadge } from "@/components/VerificationBadge";

type Status = "unverified" | "pending" | "approved" | "rejected" | "resubmit";

const steps = [
  { key: "id_document", label: "Government-issued ID / Passport / Licence", icon: FileText },
  { key: "selfie", label: "Selfie verification", icon: Camera },
  { key: "proof_of_address", label: "Proof of address", icon: MapPin },
];

const Verify = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<Status>("unverified");
  const [uploaded, setUploaded] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("verification_status, government_id_url, selfie_url, proof_of_address_url")
        .eq("id", user.id)
        .maybeSingle();
      if (data) {
        setStatus((data.verification_status as Status) || "unverified");
        setUploaded({
          id_document: !!data.government_id_url,
          selfie: !!data.selfie_url,
          proof_of_address: !!data.proof_of_address_url,
        });
      }
    })();
  }, [user]);

  const upload = async (stepKey: string, file: File) => {
    if (!user) return;
    setBusy(true);
    try {
      const path = `${user.id}/${stepKey}-${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("kyc-documents").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const col = stepKey === "id_document" ? "government_id_url" : stepKey === "selfie" ? "selfie_url" : "proof_of_address_url";
      const { error: dbErr } = await supabase.from("profiles").update({ [col]: path }).eq("id", user.id);
      if (dbErr) throw dbErr;
      setUploaded((u) => ({ ...u, [stepKey]: true }));
      toast({ title: "Uploaded", description: "Document saved securely." });
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.message, variant: "destructive" });
    } finally { setBusy(false); }
  };

  const submitForReview = async () => {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({ verification_status: "pending", verification_submitted_at: new Date().toISOString() })
      .eq("id", user.id);
    setBusy(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setStatus("pending");
    toast({ title: "Submitted for review", description: "We typically respond within 24–48 hours." });
  };

  const completed = Object.values(uploaded).filter(Boolean).length;
  const progress = Math.round((completed / steps.length) * 100);
  const canSubmit = completed === steps.length && status !== "pending" && status !== "approved";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-24">
        <div className="container max-w-3xl py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold">Verify your account</h1>
                <p className="text-muted-foreground text-sm mt-1">Required before withdrawals or restricted financial features.</p>
              </div>
              <VerificationBadge status={status} />
            </div>

            <Card className="glass-card mb-6 border-none">
              <CardContent className="py-5">
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="font-medium">Progress</span>
                  <span className="text-muted-foreground">{completed} / {steps.length}</span>
                </div>
                <Progress value={progress} />
              </CardContent>
            </Card>

            <div className="space-y-3">
              {steps.map((s) => {
                const Icon = s.icon;
                const done = uploaded[s.key];
                return (
                  <Card key={s.key} className="glass-card border-none">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl grid place-items-center ${done ? "bg-[hsl(var(--success))] text-white" : "bg-secondary text-foreground"}`}>
                          {done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                        </div>
                        <CardTitle className="text-base">{s.label}</CardTitle>
                      </div>
                      <label className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium cursor-pointer border ${done ? "border-[hsl(var(--success))] text-[hsl(var(--success))]" : "border-primary text-primary hover:bg-primary/10"}`}>
                        <Upload className="h-3.5 w-3.5" /> {done ? "Replace" : "Upload"}
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          className="hidden"
                          disabled={busy || status === "pending" || status === "approved"}
                          onChange={(e) => e.target.files?.[0] && upload(s.key, e.target.files[0])}
                        />
                      </label>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button disabled={!canSubmit || busy} onClick={submitForReview} className="shadow-glow">
                Submit for Review
              </Button>
              <Button variant="outline" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              Your documents are stored securely and accessed only by our verification team. You may register and deposit funds before verification, but withdrawals and certain bonuses require approval.
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Verify;

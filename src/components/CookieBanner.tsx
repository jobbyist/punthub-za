import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

const KEY = "punthub-cookie-consent";
const DAYS = 30;

type Consent = { state: "accepted" | "rejected" | "configured"; expires: number; categories?: { analytics: boolean; marketing: boolean } };

const read = (): Consent | null => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const c: Consent = JSON.parse(raw);
    if (c.expires < Date.now()) return null;
    return c;
  } catch { return null; }
};
const write = (c: Consent) => localStorage.setItem(KEY, JSON.stringify(c));

const CookieBanner = () => {
  const [show, setShow] = useState(false);
  const [configuring, setConfiguring] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (read()) return;
    const t = setTimeout(() => setShow(true), 15000);
    return () => clearTimeout(t);
  }, []);

  const close = () => setShow(false);
  const expires = () => Date.now() + DAYS * 86400_000;

  const accept = () => { write({ state: "accepted", expires: expires(), categories: { analytics: true, marketing: true } }); close(); };
  const reject = () => { write({ state: "rejected", expires: expires(), categories: { analytics: false, marketing: false } }); close(); };
  const save = () => { write({ state: "configured", expires: expires(), categories: { analytics, marketing } }); close(); };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-[60]">
      <div className="glass-card p-5 shadow-elevated">
        <div className="flex items-start gap-3">
          <Cookie className="h-6 w-6 text-primary shrink-0" aria-hidden />
          <div className="flex-1">
            <p className="font-heading font-semibold text-sm mb-1">Your privacy choices</p>
            <p className="text-xs text-muted-foreground">
              We use cookies to keep you signed in, analyse traffic and improve PuntHub™. Choose how we may use them.
            </p>

            {configuring && (
              <div className="mt-3 space-y-2 text-xs">
                <label className="flex items-center justify-between">
                  <span>Essential (required)</span>
                  <input type="checkbox" checked disabled />
                </label>
                <label className="flex items-center justify-between">
                  <span>Analytics</span>
                  <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
                </label>
                <label className="flex items-center justify-between">
                  <span>Marketing</span>
                  <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
                </label>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              {configuring ? (
                <Button size="sm" onClick={save}>Save preferences</Button>
              ) : (
                <>
                  <Button size="sm" onClick={accept}>Accept</Button>
                  <Button size="sm" variant="outline" onClick={() => setConfiguring(true)}>Configure</Button>
                  <Button size="sm" variant="ghost" onClick={reject}>Reject non-essential</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;

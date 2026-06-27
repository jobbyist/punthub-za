import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LegalModal } from "@/components/LegalModal";

const CONTENT: Record<string, { title: string; body: JSX.Element }> = {
  terms: {
    title: "Terms & Conditions",
    body: (
      <>
        <p><strong>Effective date:</strong> 1 January 2026 · <strong>Version:</strong> 1.0</p>
        <p>These Terms govern your use of PuntHub™, a service operated by Gravitas Industries Pty Ltd (Reg. K2024/596436/07), 7 Harvard Street, Kempton Park, Gauteng, South Africa.</p>
        <h3>1. Eligibility</h3>
        <p>You must be 18 years or older and legally permitted to participate in gambling activity in your jurisdiction.</p>
        <h3>2. Account</h3>
        <p>You agree to provide accurate KYC information. Withdrawals require successful account verification.</p>
        <h3>3. Deposits, Withdrawals & Fees</h3>
        <p>A flat R10 fee applies per withdrawal. Method-specific limits are disclosed at the point of transaction.</p>
        <h3>4. Responsible Gaming</h3>
        <p>You may set limits, take cooling-off periods or self-exclude at any time. We support SARGF (0800 006 008).</p>
        <h3>5. Liability</h3>
        <p>To the maximum extent permitted by law, Gravitas Industries Pty Ltd's liability is limited to amounts held in your wallet.</p>
        <h3>6. Contact</h3>
        <p>support@punthub.fun · punthub@gravitas.uno</p>
      </>
    ),
  },
  privacy: {
    title: "Privacy Policy",
    body: (
      <>
        <p><strong>Effective date:</strong> 1 January 2026 · <strong>Version:</strong> 1.0</p>
        <p>Gravitas Industries Pty Ltd processes personal information in accordance with the South African POPIA. We collect identification, contact, financial and usage data to operate PuntHub™, perform KYC/AML checks and comply with regulatory obligations.</p>
        <h3>Your rights</h3>
        <p>You have the right to access, correct, delete or port your personal information, subject to legal retention requirements.</p>
        <h3>Cookies</h3>
        <p>We use essential cookies for login and security, and optional analytics/marketing cookies subject to your consent.</p>
        <h3>Contact our Information Officer</h3>
        <p>privacy@punthub.fun · 7 Harvard Street, Kempton Park, Gauteng.</p>
      </>
    ),
  },
  "responsible-gaming": {
    title: "Responsible Gaming Policy",
    body: (
      <>
        <p>PuntHub™ is committed to safer gambling. We provide deposit limits, daily/weekly/monthly limits, session timers, reality checks, cooling-off and self-exclusion controls.</p>
        <p>If you or someone you know is struggling, call the SARGF toll-free counselling line on <strong>0800 006 008</strong> or WhatsApp <strong>HELP</strong> to <strong>076 675 0710</strong>.</p>
      </>
    ),
  },
};

const Legal = () => {
  const { doc = "terms" } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const data = CONTENT[doc] ?? CONTENT.terms;

  useEffect(() => { setOpen(true); }, [doc]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 container max-w-3xl">
        <h1 className="font-heading text-3xl font-bold mb-3">{data.title}</h1>
        <div className="prose prose-sm max-w-none dark:prose-invert">{data.body}</div>
      </main>
      <LegalModal open={open} onOpenChange={(o) => { setOpen(o); if (!o) navigate(-1); }} title={data.title}>{data.body}</LegalModal>
      <Footer />
    </div>
  );
};

export default Legal;

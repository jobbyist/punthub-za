import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle, ShieldAlert } from "lucide-react";

type Status = "unverified" | "pending" | "approved" | "rejected" | "resubmit";

export const VerificationBadge = ({ status }: { status: Status }) => {
  const cfg: Record<Status, { label: string; icon: any; cls: string }> = {
    approved: { label: "Verified", icon: CheckCircle2, cls: "bg-[hsl(var(--success))] text-white" },
    pending:  { label: "Pending Review", icon: Clock, cls: "bg-[hsl(var(--warning))] text-black" },
    unverified: { label: "Unverified", icon: ShieldAlert, cls: "bg-destructive text-destructive-foreground" },
    rejected: { label: "Rejected", icon: XCircle, cls: "bg-destructive text-destructive-foreground" },
    resubmit: { label: "Resubmit Needed", icon: ShieldAlert, cls: "bg-[hsl(var(--warning))] text-black" },
  };
  const c = cfg[status];
  const I = c.icon;
  return (
    <Badge className={`${c.cls} gap-1 rounded-full px-3 py-1`}>
      <I className="h-3 w-3" /> {c.label}
    </Badge>
  );
};

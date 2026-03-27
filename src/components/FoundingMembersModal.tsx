import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Banknote,
  Zap,
  Gift,
  Trophy,
  Users,
  ChevronRight,
  Star,
} from "lucide-react";

const TOTAL_STEPS = 2;

const requirements = [
  {
    icon: DollarSign,
    title: "$100 Minimum First Deposit Required",
    description: "Start your journey with a $100 minimum deposit and receive an instant 50% First Deposit Bonus on top.",
    highlight: "+ 50% First Deposit Bonus",
  },
];

const benefits = [
  {
    icon: Banknote,
    title: "Zero Fees on First Withdrawal",
    description: "ZAR Bank Transfer or USD PayPal Withdrawal — your first withdrawal is completely fee-free.",
  },
  {
    icon: Zap,
    title: "Early Access To New Features",
    description: "Be the first to try new platform features before anyone else.",
  },
  {
    icon: Gift,
    title: "Free Premium PuntHub Merchandise",
    description: "Receive exclusive PuntHub branded merchandise as a thank-you for being a founding member.",
  },
  {
    icon: Trophy,
    title: "Sponsored Giveaways & Competitions",
    description: "Get exclusive access to sponsored giveaways and competitions reserved for founding members only.",
  },
  {
    icon: Users,
    title: "Direct Access To Platform Developers",
    description: "Suggest new features directly to the developers and help shape the future of PuntHub.",
  },
];

interface FoundingMembersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FoundingMembersModal = ({ open, onOpenChange }: FoundingMembersModalProps) => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setStep(1);
    }
    onOpenChange(isOpen);
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      handleClose(false);
      navigate("/signup");
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 pt-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i + 1 === step
                  ? "w-6 bg-primary"
                  : i + 1 < step
                  ? "w-2 bg-primary/60"
                  : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <>
            <DialogHeader className="text-center space-y-3">
              <div className="mx-auto bg-punt-gold/10 rounded-full p-3 w-fit">
                <Star className="h-8 w-8 text-punt-gold" />
              </div>
              <DialogTitle className="font-heading text-2xl font-bold">
                Become A Founding Member
              </DialogTitle>
              <DialogDescription className="text-base">
                Join an exclusive group of early supporters shaping the future of PuntHub. Here's what's required to join.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {requirements.map(({ icon: Icon, title, description, highlight }) => (
                <div
                  key={title}
                  className="flex gap-4 p-4 rounded-xl border border-border bg-card"
                >
                  <div className="shrink-0 bg-primary/10 rounded-lg p-2 h-fit">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
                    {highlight && (
                      <span className="inline-block mt-2 text-xs font-bold text-punt-gold bg-punt-gold/10 px-2 py-0.5 rounded-full">
                        {highlight}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader className="text-center space-y-3">
              <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <DialogTitle className="font-heading text-2xl font-bold">
                Your Exclusive Benefits
              </DialogTitle>
              <DialogDescription className="text-base">
                As a Founding Member you'll unlock these exclusive perks from day one.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2">
              {benefits.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex gap-3 p-3 rounded-xl border border-border bg-card"
                >
                  <div className="shrink-0 bg-primary/10 rounded-lg p-2 h-fit">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} className="sm:mr-auto">
              Back
            </Button>
          )}
          <Button onClick={handleNext} className="w-full sm:w-auto gap-1.5">
            {step < TOTAL_STEPS ? (
              <>
                Next
                <ChevronRight className="h-4 w-4" />
              </>
            ) : (
              "Create My Account"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FoundingMembersModal;

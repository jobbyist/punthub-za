import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import FoundingMembersModal from "@/components/FoundingMembersModal";

const stats = [
  { value: "80+", label: "Live Events" },
  { value: "10k+", label: "Community Members" },
  { value: "500+", label: "Rewards Redeemed" },
  { value: "#1", label: "Prediction Hub" },
];

const HeroSection = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
  <section className="relative overflow-hidden py-20 md:py-32">
    <FoundingMembersModal open={modalOpen} onOpenChange={setModalOpen} />
    <div className="container text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          <Target className="h-4 w-4" />
          THE WORLD'S MOST REWARDING PREDICTION COMMUNITY
        </div>
      </motion.div>

      <motion.h1
        className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Predict. Win.{" "}
        <span className="text-primary">Earn Real Rewards.</span>
      </motion.h1>

      <motion.p
        className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        PuntHub is your premier prediction hub — compete on live prediction markets,
        earn PuntPoints for winning predictions, and redeem real rewards.
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Button size="lg" onClick={() => setModalOpen(true)}>
          Join Now — Become A Founding Member
        </Button>
        <Button size="lg" variant="outline" asChild>
          <a href="#how-it-works">See How It Works ↓</a>
        </Button>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="font-heading text-3xl md:text-4xl font-bold text-primary">
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </div>

    {/* Background decoration */}
    <div className="absolute inset-0 -z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
    </div>
  </section>
  );
};

export default HeroSection;

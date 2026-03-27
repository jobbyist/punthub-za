import { motion } from "framer-motion";
import { Search, Target, Trophy } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Explore",
    description: "Browse 80+ live prediction markets across sports, crypto, politics, tech & more. Real-time markets powered by Polymarket.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Target,
    title: "Predict",
    description: "Make your predictions and earn PuntPoints. The more accurate your picks, the higher you climb the leaderboard.",
    color: "bg-punt-gold/10 text-punt-gold",
  },
  {
    icon: Trophy,
    title: "Win",
    description: "Redeem PuntPoints for gift cards, streaming subscriptions, exclusive merch, and convert to fiat currency.",
    color: "bg-punt-green/10 text-punt-green",
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-20 bg-secondary/30">
    <div className="container">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">How It Works</h2>
        <p className="text-muted-foreground">Three simple steps to start winning</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            className="glass-card p-6 hover:shadow-lg transition-shadow"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${step.color}`}>
              <step.icon className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-xl font-bold text-primary mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;

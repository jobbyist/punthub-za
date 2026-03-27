import { motion } from "framer-motion";
import { TrendingUp, Bot, MessageSquare, Swords, ShoppingBag, Medal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const features = [
  { icon: TrendingUp, title: "Prediction Markets", badge: "POPULAR", desc: "80+ live events across 16 categories powered by real market data.", color: "text-primary" },
  { icon: Bot, title: "AI Insights", badge: "PREMIUM", desc: "AI-powered predictions and insights to inform your picks.", color: "text-punt-gold" },
  { icon: MessageSquare, title: "Community Forum", badge: "FEATURED", desc: "Discuss predictions with thousands of like-minded punters.", color: "text-punt-green" },
  { icon: Swords, title: "P2P Betting", badge: "NEW", desc: "Bet directly against friends with PuntPoints. Winner takes all.", color: "text-destructive" },
  { icon: ShoppingBag, title: "Rewards Store", badge: "FEATURED", desc: "Redeem points for gift cards, streaming, merch and more.", color: "text-primary" },
  { icon: Medal, title: "Leaderboard", badge: "LIVE", desc: "Compete with top predictors. Earn badges and bonus points.", color: "text-punt-gold" },
];

const FeaturesGrid = () => (
  <section className="py-20">
    <div className="container">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">Everything In One Place</h2>
        <p className="text-muted-foreground">All the features you need to predict, compete and win</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className="glass-card p-5 group hover:shadow-lg hover:border-primary/20 transition-all cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="flex items-start justify-between mb-3">
              <f.icon className={`h-8 w-8 ${f.color}`} />
              <Badge variant="secondary" className="text-[10px] font-semibold">
                {f.badge}
              </Badge>
            </div>
            <h3 className="font-heading font-bold mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
            <span className="inline-block mt-3 text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
              Explore →
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesGrid;

import { motion } from "framer-motion";
import { TrendingUp, Bot, MessageSquare, Swords, ShoppingBag, Medal, Dice5, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const features = [
  { icon: TrendingUp, title: "Prediction Markets", badge: "POPULAR", desc: "80+ live events across 16 categories powered by real market data.", color: "text-primary", to: "/markets" },
  { icon: Dice5, title: "Casino", badge: "NEW", desc: "Premium slots, table games and live dealer experiences from top providers.", color: "text-punt-gold", to: "/casino" },
  { icon: Trophy, title: "Sports Betting", badge: "NEW", desc: "Bet on football, rugby, cricket, F1, basketball and more with sharp odds.", color: "text-punt-green", to: "/sports" },
  { icon: Bot, title: "AI Insights", badge: "PREMIUM", desc: "PuntHub AI helps with insights, support and account questions 24/7.", color: "text-primary", to: "/dashboard" },
  { icon: MessageSquare, title: "Community Forum", badge: "FEATURED", desc: "Discuss predictions with thousands of like-minded punters.", color: "text-punt-green", to: "/leaderboard" },
  { icon: Swords, title: "P2P Betting", badge: "FEATURED", desc: "Bet directly against friends with PuntPoints. Winner takes all.", color: "text-destructive", to: "/markets" },
  { icon: ShoppingBag, title: "Rewards Store", badge: "FEATURED", desc: "Redeem points for gift cards, streaming, merch and more.", color: "text-primary", to: "/rewards" },
  { icon: Medal, title: "Leaderboard", badge: "LIVE", desc: "Compete with top predictors. Earn badges and bonus points.", color: "text-punt-gold", to: "/leaderboard" },
];

const FeaturesGrid = () => (
  <section className="py-20">
    <div className="container">
      <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">Everything In One Place</h2>
        <p className="text-muted-foreground">All the features you need to predict, compete and win</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Link to={f.to} className="glass-card p-5 block group hover:shadow-glow hover:border-primary/30 transition-all h-full">
              <div className="flex items-start justify-between mb-3">
                <f.icon className={`h-8 w-8 ${f.color}`} />
                <Badge variant="secondary" className="text-[10px] font-semibold">{f.badge}</Badge>
              </div>
              <h3 className="font-heading font-bold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
              <span className="inline-block mt-3 text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
                Explore →
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesGrid;

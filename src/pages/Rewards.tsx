import { motion } from "framer-motion";
import { Gift, CreditCard, ShoppingBag, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const rewards = [
  { name: "Amazon Gift Card", points: 5000, category: "Gift Cards", image: "🛒", popular: true },
  { name: "Netflix 1-Month", points: 3000, category: "Streaming", image: "🎬", popular: true },
  { name: "Spotify Premium", points: 2500, category: "Streaming", image: "🎵", popular: false },
  { name: "PuntHub Merch Pack", points: 1500, category: "Merch", image: "👕", popular: false },
  { name: "$10 USDC", points: 4000, category: "Crypto", image: "💰", popular: true },
  { name: "Apple Music", points: 2500, category: "Streaming", image: "🎧", popular: false },
  { name: "Steam Gift Card", points: 5000, category: "Gaming", image: "🎮", popular: false },
  { name: "$25 Cash (PayPal)", points: 10000, category: "Cash Out", image: "💵", popular: true },
];

const Rewards = () => {
  const userPoints = 2450; // Mock — would come from auth/db

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Rewards Center</h1>
            <p className="text-muted-foreground mb-8">Redeem your PuntPoints for real rewards or convert to cash</p>
          </motion.div>

          {/* Points balance */}
          <motion.div
            className="glass-card p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div>
              <p className="text-sm text-muted-foreground mb-1">Your PuntPoints Balance</p>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-4xl font-bold text-primary">{userPoints.toLocaleString()}</span>
                <Zap className="h-5 w-5 text-punt-gold" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <CreditCard className="h-4 w-4 mr-2" />
                Convert to Cash
              </Button>
              <Button size="sm">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Browse Rewards
              </Button>
            </div>
          </motion.div>

          {/* Rewards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {rewards.map((reward, i) => {
              const canAfford = userPoints >= reward.points;
              return (
                <motion.div
                  key={reward.name}
                  className="glass-card p-5 hover:shadow-lg transition-all group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{reward.image}</span>
                    {reward.popular && (
                      <Badge variant="secondary" className="text-[10px]">POPULAR</Badge>
                    )}
                  </div>
                  <h3 className="font-heading font-bold text-sm mb-1">{reward.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{reward.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-primary">
                      {reward.points.toLocaleString()} PP
                    </span>
                    <Button
                      size="sm"
                      variant={canAfford ? "default" : "outline"}
                      disabled={!canAfford}
                    >
                      {canAfford ? "Redeem" : "Need more"}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Convert section */}
          <motion.div
            className="mt-12 glass-card p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Gift className="h-10 w-10 mx-auto mb-4 text-primary" />
            <h2 className="font-heading text-2xl font-bold mb-2">Convert PuntPoints to Cash</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Cash out your earnings via PayPal, bank transfer, or crypto wallet.
              Minimum 5,000 PuntPoints required.
            </p>
            <Button size="lg">
              Start Conversion <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Rewards;

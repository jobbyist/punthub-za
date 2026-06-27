import { motion } from "framer-motion";
import { Dice5, Spade, Heart, Cherry, Crown, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Game {
  title: string;
  provider: string;
  category: string;
  emoji: string;
  badge?: string;
}

const games: Game[] = [
  { title: "Mystic Reels", provider: "Habanero", category: "Slots", emoji: "🎰", badge: "HOT" },
  { title: "African Sunset", provider: "Habanero", category: "Slots", emoji: "🌅" },
  { title: "Diamond Rush", provider: "iGaming", category: "Slots", emoji: "💎", badge: "NEW" },
  { title: "Lucky 7s", provider: "Habanero", category: "Slots", emoji: "7️⃣" },
  { title: "Roulette Royale", provider: "iGaming", category: "Table", emoji: "🎡" },
  { title: "Blackjack Pro", provider: "iGaming", category: "Table", emoji: "🃏" },
  { title: "Texas Hold'em", provider: "iGaming", category: "Poker", emoji: "♠️" },
  { title: "Baccarat Lounge", provider: "Habanero", category: "Table", emoji: "🎴" },
  { title: "Crash X", provider: "iGaming", category: "Instant", emoji: "🚀", badge: "TRENDING" },
  { title: "Plinko Pro", provider: "Habanero", category: "Instant", emoji: "🎯" },
  { title: "Mega Spin", provider: "Habanero", category: "Slots", emoji: "🎲" },
  { title: "Dragon's Hoard", provider: "iGaming", category: "Slots", emoji: "🐉" },
];

const categories = [
  { name: "Slots", icon: Cherry, count: 6 },
  { name: "Table Games", icon: Spade, count: 3 },
  { name: "Poker", icon: Heart, count: 1 },
  { name: "Instant", icon: Dice5, count: 2 },
];

const Casino = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-punt-gold/5 border-b border-border">
        <div className="container py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-punt-gold/10 text-punt-gold rounded-full px-3 py-1 text-xs font-semibold mb-4">
              <Crown className="h-3.5 w-3.5" /> COMING SOON
            </div>
            <h1 className="font-heading text-3xl md:text-5xl font-bold mb-3">
              PuntHub <span className="text-primary">Casino</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Real-money online slots, table games, and instant wins — powered by Habanero and iGaming partners.
              Launching soon for Founding Members.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category strip */}
      <section className="container py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="glass-card p-5 flex items-center gap-3 hover:border-primary/30 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <cat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-heading font-bold text-sm">{cat.name}</p>
                <p className="text-xs text-muted-foreground">{cat.count} games</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Games grid */}
      <section className="container pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl font-bold">Featured Games</h2>
          <Badge variant="outline" className="text-xs">
            <Lock className="h-3 w-3 mr-1" /> Integration pending
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {games.map((game, i) => (
            <motion.div
              key={game.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.4) }}
              className="glass-card overflow-hidden group cursor-not-allowed"
            >
              <div className="aspect-square bg-gradient-to-br from-primary/20 via-secondary to-punt-gold/10 flex items-center justify-center text-6xl relative">
                <span>{game.emoji}</span>
                {game.badge && (
                  <Badge className="absolute top-2 right-2 text-[10px] bg-punt-gold text-foreground hover:bg-punt-gold">
                    {game.badge}
                  </Badge>
                )}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/60 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button size="sm" disabled>
                    <Lock className="h-3 w-3 mr-1" /> Soon
                  </Button>
                </div>
              </div>
              <div className="p-3">
                <p className="font-heading font-bold text-sm truncate">{game.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">{game.provider}</span>
                  <Badge variant="secondary" className="text-[10px]">{game.category}</Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 glass-card p-6 text-center">
          <h3 className="font-heading text-xl font-bold mb-2">Casino API integration in progress</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            We're finalising integrations with Habanero and our iGaming aggregator. Founding Members will get
            early access plus 100 free spins at launch.
          </p>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Casino;

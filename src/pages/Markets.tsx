import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Clock, Users, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categories = ["All", "Politics", "Crypto", "Sports", "Tech", "Entertainment", "Science", "Finance"];

interface Market {
  id: string;
  question: string;
  category: string;
  yesPrice: number;
  volume: string;
  endDate: string;
  image: string;
  trending: "up" | "down" | "neutral";
}

const mockMarkets: Market[] = [
  { id: "1", question: "Will Bitcoin exceed $150,000 by end of 2026?", category: "Crypto", yesPrice: 0.42, volume: "$2.4M", endDate: "Dec 31, 2026", image: "₿", trending: "up" },
  { id: "2", question: "Will there be a US recession in 2026?", category: "Finance", yesPrice: 0.28, volume: "$1.8M", endDate: "Dec 31, 2026", image: "📉", trending: "down" },
  { id: "3", question: "Will AI pass the Turing Test by 2027?", category: "Tech", yesPrice: 0.65, volume: "$3.1M", endDate: "Dec 31, 2027", image: "🤖", trending: "up" },
  { id: "4", question: "Will SpaceX land humans on Mars by 2030?", category: "Science", yesPrice: 0.18, volume: "$5.2M", endDate: "Dec 31, 2030", image: "🚀", trending: "neutral" },
  { id: "5", question: "Will the next FIFA World Cup be held in Saudi Arabia?", category: "Sports", yesPrice: 0.91, volume: "$890K", endDate: "Jul 1, 2034", image: "⚽", trending: "up" },
  { id: "6", question: "Will a third-party candidate win a US state in 2028?", category: "Politics", yesPrice: 0.08, volume: "$1.2M", endDate: "Nov 5, 2028", image: "🗳️", trending: "down" },
  { id: "7", question: "Will Ethereum flip Bitcoin in market cap?", category: "Crypto", yesPrice: 0.12, volume: "$4.5M", endDate: "Dec 31, 2027", image: "⟠", trending: "down" },
  { id: "8", question: "Will GTA 6 release in 2026?", category: "Entertainment", yesPrice: 0.73, volume: "$2.1M", endDate: "Dec 31, 2026", image: "🎮", trending: "up" },
  { id: "9", question: "Will Apple release AR glasses in 2026?", category: "Tech", yesPrice: 0.35, volume: "$1.5M", endDate: "Dec 31, 2026", image: "🕶️", trending: "neutral" },
];

const Markets = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockMarkets.filter((m) => {
    const matchCat = activeCategory === "All" || m.category === activeCategory;
    const matchSearch = m.question.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Prediction Markets</h1>
            <p className="text-muted-foreground mb-6">Browse live events and make your predictions</p>
          </motion.div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search markets..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className="whitespace-nowrap"
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Markets grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((market, i) => (
              <motion.div
                key={market.id}
                className="glass-card p-5 hover:shadow-lg hover:border-primary/20 transition-all group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{market.image}</span>
                  <Badge variant="secondary" className="text-[10px]">{market.category}</Badge>
                </div>
                <h3 className="font-heading font-bold text-sm mb-4 leading-snug">{market.question}</h3>

                {/* Price bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-punt-green font-semibold">Yes {Math.round(market.yesPrice * 100)}¢</span>
                    <span className="text-destructive font-semibold">No {Math.round((1 - market.yesPrice) * 100)}¢</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-punt-green rounded-full transition-all"
                      style={{ width: `${market.yesPrice * 100}%` }}
                    />
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {market.volume}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {market.endDate}
                  </span>
                  {market.trending === "up" ? (
                    <TrendingUp className="h-4 w-4 text-punt-green" />
                  ) : market.trending === "down" ? (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  ) : null}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="flex-1 bg-punt-green hover:bg-punt-green/90 text-primary-foreground">
                    Yes ↑
                  </Button>
                  <Button size="sm" variant="destructive" className="flex-1">
                    No ↓
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <Filter className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p>No markets found. Try a different search or category.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Markets;

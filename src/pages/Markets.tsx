import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Clock, Users, Search, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { marketsApi } from "@/lib/api/markets";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const categories = ["All", "Politics", "Crypto", "Sports", "Tech", "Entertainment", "Science", "Finance", "General"];

interface MarketRow {
  id: string;
  question: string;
  category: string;
  yes_price: number;
  volume: string;
  end_date: string | null;
  image_emoji: string | null;
  image_url: string | null;
  trending: string | null;
  source: string | null;
  description: string | null;
}

const Markets = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [markets, setMarkets] = useState<MarketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [betDialog, setBetDialog] = useState<{ market: MarketRow; position: 'yes' | 'no' } | null>(null);
  const [betAmount, setBetAmount] = useState("");
  const [placingBet, setPlacingBet] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadMarkets();
  }, [activeCategory, searchQuery]);

  const loadMarkets = async () => {
    try {
      setLoading(true);
      const data = await marketsApi.fetchMarkets(activeCategory, searchQuery);
      setMarkets(data as MarketRow[]);
    } catch (err) {
      console.error('Failed to load markets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await marketsApi.syncPolymarketEvents();
      toast({ title: "Markets synced", description: `${result?.upserted || 0} markets updated from Polymarket` });
      loadMarkets();
    } catch (err: any) {
      toast({ title: "Sync failed", description: err.message, variant: "destructive" });
    } finally {
      setSyncing(false);
    }
  };

  const handleBet = (market: MarketRow, position: 'yes' | 'no') => {
    if (!user) {
      navigate('/login');
      return;
    }
    setBetDialog({ market, position });
    setBetAmount("");
  };

  const placeBet = async () => {
    if (!betDialog || !betAmount) return;
    setPlacingBet(true);
    try {
      const price = betDialog.position === 'yes'
        ? betDialog.market.yes_price
        : 1 - betDialog.market.yes_price;
      await marketsApi.placePrediction(betDialog.market.id, betDialog.position, parseInt(betAmount), price);
      toast({ title: "Prediction placed!", description: `${betDialog.position.toUpperCase()} on "${betDialog.market.question}"` });
      setBetDialog(null);
    } catch (err: any) {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    } finally {
      setPlacingBet(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "TBD";
    return new Date(dateStr).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-2">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold">Prediction Markets</h1>
              <p className="text-muted-foreground mb-6">Browse live events and make your predictions</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleSync} disabled={syncing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync Polymarket'}
            </Button>
          </motion.div>

          {/* Search */}
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
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="glass-card p-5 animate-pulse">
                  <div className="h-8 w-8 bg-muted rounded mb-3" />
                  <div className="h-4 bg-muted rounded mb-2 w-3/4" />
                  <div className="h-4 bg-muted rounded mb-4 w-1/2" />
                  <div className="h-2 bg-muted rounded mb-4" />
                  <div className="flex gap-2">
                    <div className="h-8 bg-muted rounded flex-1" />
                    <div className="h-8 bg-muted rounded flex-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {markets.map((market, i) => {
                const yesPrice = Number(market.yes_price);
                const noPrice = 1 - yesPrice;
                return (
                  <motion.div
                    key={market.id}
                    className="glass-card p-5 hover:shadow-lg hover:border-primary/20 transition-all group cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.5) }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl">{market.image_emoji || '📊'}</span>
                      <div className="flex gap-1">
                        {market.source === 'polymarket' && (
                          <Badge variant="outline" className="text-[10px]">Polymarket</Badge>
                        )}
                        <Badge variant="secondary" className="text-[10px]">{market.category}</Badge>
                      </div>
                    </div>
                    <h3 className="font-heading font-bold text-sm mb-4 leading-snug">{market.question}</h3>

                    {/* Price bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-punt-green font-semibold">Yes {Math.round(yesPrice * 100)}¢</span>
                        <span className="text-destructive font-semibold">No {Math.round(noPrice * 100)}¢</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-punt-green rounded-full transition-all"
                          style={{ width: `${yesPrice * 100}%` }}
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
                        {formatDate(market.end_date)}
                      </span>
                      {market.trending === "up" ? (
                        <TrendingUp className="h-4 w-4 text-punt-green" />
                      ) : market.trending === "down" ? (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      ) : null}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="flex-1 bg-punt-green hover:bg-punt-green/90 text-primary-foreground" onClick={() => handleBet(market, 'yes')}>
                        Yes ↑
                      </Button>
                      <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleBet(market, 'no')}>
                        No ↓
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {!loading && markets.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <Filter className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p>No markets found. Try syncing from Polymarket or changing your search.</p>
              <Button onClick={handleSync} className="mt-4" disabled={syncing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} /> Sync Markets
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Bet Dialog */}
      <Dialog open={!!betDialog} onOpenChange={() => setBetDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Place Prediction</DialogTitle>
          </DialogHeader>
          {betDialog && (
            <div className="space-y-4 pt-2">
              <p className="text-sm font-medium">{betDialog.market.question}</p>
              <Badge variant={betDialog.position === 'yes' ? 'default' : 'destructive'}>
                {betDialog.position.toUpperCase()} @ {Math.round((betDialog.position === 'yes' ? betDialog.market.yes_price : 1 - betDialog.market.yes_price) * 100)}¢
              </Badge>
              <Input
                type="number"
                placeholder="PuntPoints to stake"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                min="1"
              />
              <p className="text-xs text-muted-foreground">
                Potential payout: {betAmount ? Math.round(parseInt(betAmount) / (betDialog.position === 'yes' ? Number(betDialog.market.yes_price) : 1 - Number(betDialog.market.yes_price))) : 0} PuntPoints
              </p>
              <Button onClick={placeBet} disabled={placingBet || !betAmount} className="w-full">
                {placingBet ? "Placing..." : "Confirm Prediction"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Markets;

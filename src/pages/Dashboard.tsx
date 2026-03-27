import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, History, Award, ArrowUpRight, ArrowDownRight, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { walletApi } from "@/lib/api/wallet";
import { marketsApi } from "@/lib/api/markets";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [puntPoints, setPuntPoints] = useState(0);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [balanceData, preds, txns] = await Promise.all([
        walletApi.getBalance(),
        marketsApi.getUserPredictions(),
        supabase
          .from('wallet_transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20),
      ]);

      setBalance(balanceData?.balance || 0);
      setPuntPoints(balanceData?.puntPoints || 0);
      setPredictions(preds || []);
      setTransactions(txns.data || []);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    }
  };

  const handleDeposit = async () => {
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) return;
    setIsLoading(true);
    try {
      const result = await walletApi.deposit(amt);
      setBalance(result.balance);
      setDepositAmount("");
      setDepositOpen(false);
      toast({ title: "Deposit successful", description: `R${amt.toFixed(2)} added to your wallet` });
      loadDashboardData();
    } catch (err: any) {
      toast({ title: "Deposit failed", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt <= 0) return;
    setIsLoading(true);
    try {
      const result = await walletApi.withdraw(amt);
      setBalance(result.balance);
      setWithdrawAmount("");
      setWithdrawOpen(false);
      toast({ title: "Withdrawal successful", description: `R${amt.toFixed(2)} withdrawn` });
      loadDashboardData();
    } catch (err: any) {
      toast({ title: "Withdrawal failed", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const activePredictions = predictions.filter(p => p.status === 'active');
  const completedPredictions = predictions.filter(p => p.status !== 'active');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground mb-8">Manage your wallet, predictions and activity</p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Wallet Balance</CardTitle>
                  <Wallet className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold font-heading">R{balance.toFixed(2)}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">PuntPoints</CardTitle>
                  <Award className="h-4 w-4 text-punt-gold" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold font-heading">{puntPoints.toLocaleString()}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Predictions</CardTitle>
                  <TrendingUp className="h-4 w-4 text-punt-green" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold font-heading">{activePredictions.length}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Predictions</CardTitle>
                  <History className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold font-heading">{predictions.length}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Wallet Actions */}
          <div className="flex gap-3 mb-8">
            <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
              <DialogTrigger asChild>
                <Button className="bg-punt-green hover:bg-punt-green/90">
                  <Plus className="h-4 w-4 mr-2" /> Deposit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Deposit Funds</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    type="number"
                    placeholder="Amount in ZAR"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    min="1"
                  />
                  <Button onClick={handleDeposit} disabled={isLoading} className="w-full bg-punt-green hover:bg-punt-green/90">
                    {isLoading ? "Processing..." : "Deposit"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Minus className="h-4 w-4 mr-2" /> Withdraw
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Withdraw Funds</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <p className="text-sm text-muted-foreground">Available: R{balance.toFixed(2)}</p>
                  <Input
                    type="number"
                    placeholder="Amount in ZAR"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    min="1"
                    max={balance}
                  />
                  <Button onClick={handleWithdraw} disabled={isLoading} variant="destructive" className="w-full">
                    {isLoading ? "Processing..." : "Withdraw"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="predictions" className="space-y-4">
            <TabsList>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="predictions">
              {predictions.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <TrendingUp className="h-8 w-8 mx-auto mb-3 opacity-50" />
                    <p>No predictions yet. Head to Markets to make your first prediction!</p>
                    <Button onClick={() => navigate('/markets')} className="mt-4">Browse Markets</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {predictions.map((pred) => (
                    <Card key={pred.id}>
                      <CardContent className="flex items-center justify-between py-4">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{pred.markets?.question || 'Unknown market'}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={pred.position === 'yes' ? 'default' : 'destructive'} className="text-xs">
                              {pred.position.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {pred.amount} PuntPoints @ {Math.round(pred.price_at_prediction * 100)}¢
                            </span>
                          </div>
                        </div>
                        <Badge variant={
                          pred.status === 'active' ? 'secondary' :
                          pred.status === 'won' ? 'default' : 'destructive'
                        }>
                          {pred.status}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="transactions">
              {transactions.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <History className="h-8 w-8 mx-auto mb-3 opacity-50" />
                    <p>No transactions yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <Card key={tx.id}>
                      <CardContent className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-3">
                          {tx.amount > 0 ? (
                            <ArrowDownRight className="h-5 w-5 text-punt-green" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5 text-destructive" />
                          )}
                          <div>
                            <p className="font-medium text-sm capitalize">{tx.type.replace('_', ' ')}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(tx.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`font-bold ${tx.amount > 0 ? 'text-punt-green' : 'text-destructive'}`}>
                          {tx.amount > 0 ? '+' : ''}R{Math.abs(tx.amount).toFixed(2)}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;

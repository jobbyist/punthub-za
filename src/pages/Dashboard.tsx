import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Wallet, TrendingUp, History, Award, ArrowUpRight, ArrowDownRight,
  Plus, Minus, Gift, Users, BadgePercent, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { VerificationBadge } from "@/components/VerificationBadge";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { useAuth } from "@/contexts/AuthContext";
import { walletApi } from "@/lib/api/wallet";
import { marketsApi } from "@/lib/api/markets";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { CURRENCY_OPTIONS, FX, SYMBOL, formatCurrency } from "@/lib/currency";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [puntPoints, setPuntPoints] = useState(0);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [verification, setVerification] = useState<any>("unverified");
  const [currency, setCurrency] = useState<string>(() => localStorage.getItem("punthub-currency") || "ZAR");

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  useEffect(() => { if (user) load(); }, [user]);

  useEffect(() => { localStorage.setItem("punthub-currency", currency); }, [currency]);

  const load = async () => {
    try {
      const [balanceData, preds, txns, dep, wd, prof] = await Promise.all([
        walletApi.getBalance(),
        marketsApi.getUserPredictions(),
        supabase.from('wallet_transactions').select('*').order('created_at', { ascending: false }).limit(20),
        supabase.from('deposits').select('*').order('created_at', { ascending: false }).limit(20),
        supabase.from('withdrawals').select('*').order('created_at', { ascending: false }).limit(20),
        supabase.from('profiles').select('verification_status, first_login_at').eq('id', user!.id).maybeSingle(),
      ]);
      setBalance(balanceData?.balance || 0);
      setPuntPoints(balanceData?.puntPoints || 0);
      setPredictions(preds || []);
      setTransactions(txns.data || []);
      setDeposits(dep.data || []);
      setWithdrawals(wd.data || []);
      const status = prof.data?.verification_status || "unverified";
      setVerification(status);

      // first-login redirect rule
      if (!prof.data?.first_login_at) {
        await supabase.from('profiles').update({ first_login_at: new Date().toISOString() }).eq('id', user!.id);
        if (status !== 'approved') navigate('/verify');
      }
    } catch (e) {
      console.error('dashboard load failed', e);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

  const activePredictions = predictions.filter((p) => p.status === 'active');
  const totalDeposits = deposits.filter(d => d.status !== 'failed').reduce((s, d) => s + Number(d.amount), 0);
  const totalWithdrawals = withdrawals.filter(w => w.status === 'completed').reduce((s, w) => s + Number(w.amount), 0);
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending' || w.status === 'processing');
  const pendingWithdrawalsTotal = pendingWithdrawals.reduce((s, w) => s + Number(w.amount), 0);

  const winRate = predictions.length ? (predictions.filter(p => p.status === 'won').length / predictions.length) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-28 md:pb-12">
        <div className="container py-8">
          {/* Header */}
          <motion.div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold">Welcome back</h1>
              <p className="text-muted-foreground">Your wallet, predictions and rewards at a glance.</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <VerificationBadge status={verification} />
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-[110px] rounded-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CURRENCY_OPTIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Hero balance */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="glass-card border-none shadow-glow overflow-hidden mb-6">
              <CardContent className="py-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Wallet balance</p>
                  <p className="font-heading text-4xl md:text-5xl font-bold">
                    <AnimatedCounter value={balance * (FX[currency] ?? 1)} prefix={SYMBOL[currency] ?? ""} decimals={currency === "BTC" ? 6 : 2} />
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">≈ {formatCurrency(balance, "ZAR")} ZAR</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild className="shadow-glow"><Link to="/wallet/deposit"><Plus className="h-4 w-4 mr-1.5" /> Deposit</Link></Button>
                  <Button asChild variant="outline" disabled={verification !== 'approved'} title={verification !== 'approved' ? "Verify your account to withdraw" : ""}>
                    <Link to="/wallet/withdraw"><Minus className="h-4 w-4 mr-1.5" /> Withdraw</Link>
                  </Button>
                  {verification !== 'approved' && (
                    <Button asChild variant="secondary"><Link to="/verify">Verify Account</Link></Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* KPI grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Kpi icon={Wallet} label="Total Deposits" value={formatCurrency(totalDeposits, currency)} accent="text-primary" />
            <Kpi icon={ArrowUpRight} label="Total Withdrawals" value={formatCurrency(totalWithdrawals, currency)} accent="text-punt-green" />
            <Kpi icon={History} label="Pending Withdrawals" value={`${pendingWithdrawals.length} · ${formatCurrency(pendingWithdrawalsTotal, currency)}`} accent="text-[hsl(var(--warning))]" />
            <Kpi icon={Award} label="PuntPoints" value={puntPoints.toLocaleString()} accent="text-punt-gold" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Kpi icon={TrendingUp} label="Active Predictions" value={activePredictions.length.toString()} accent="text-primary" />
            <Kpi icon={Sparkles} label="Win Rate" value={`${winRate.toFixed(0)}%`} accent="text-punt-green" />
            <Kpi icon={BadgePercent} label="Active Bonuses" value="0" accent="text-punt-gold" />
            <Kpi icon={Users} label="Referral Earnings" value={formatCurrency(0, currency)} accent="text-primary" />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="activity" className="space-y-4">
            <TabsList className="rounded-full bg-secondary p-1">
              <TabsTrigger value="activity" className="rounded-full">Recent Activity</TabsTrigger>
              <TabsTrigger value="predictions" className="rounded-full">Predictions</TabsTrigger>
              <TabsTrigger value="transactions" className="rounded-full">Transactions</TabsTrigger>
              <TabsTrigger value="promos" className="rounded-full">Promotions</TabsTrigger>
            </TabsList>

            <TabsContent value="activity">
              {transactions.length === 0 ? (
                <Empty icon={History} label="No recent activity. Place your first prediction or deposit to get started." />
              ) : (
                <div className="space-y-2">
                  {transactions.slice(0, 8).map((tx) => (
                    <Card key={tx.id} className="glass-card border-none">
                      <CardContent className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          {tx.amount > 0 ? <ArrowDownRight className="h-5 w-5 text-punt-green" /> : <ArrowUpRight className="h-5 w-5 text-destructive" />}
                          <div>
                            <p className="font-medium text-sm capitalize">{(tx.type || "transaction").replace(/_/g, " ")}</p>
                            <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                        <span className={`font-bold ${tx.amount > 0 ? 'text-punt-green' : 'text-destructive'}`}>
                          {tx.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount), currency)}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="predictions">
              {predictions.length === 0 ? (
                <Empty icon={TrendingUp} label="No predictions yet." action={<Button onClick={() => navigate('/markets')} className="mt-4">Browse Markets</Button>} />
              ) : (
                <div className="space-y-2">
                  {predictions.map((p) => (
                    <Card key={p.id} className="glass-card border-none">
                      <CardContent className="flex items-center justify-between py-3">
                        <div className="flex-1 pr-3">
                          <p className="font-medium text-sm">{p.markets?.question || 'Unknown market'}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={p.position === 'yes' ? 'default' : 'destructive'} className="text-[10px]">{p.position?.toUpperCase()}</Badge>
                            <span className="text-xs text-muted-foreground">{p.amount} PP @ {Math.round((p.price_at_prediction ?? 0) * 100)}¢</span>
                          </div>
                        </div>
                        <Badge variant={p.status === 'active' ? 'secondary' : p.status === 'won' ? 'default' : 'destructive'}>{p.status}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="transactions">
              {transactions.length === 0 ? (
                <Empty icon={History} label="No transactions yet." />
              ) : (
                <div className="space-y-2">
                  {transactions.map((tx) => (
                    <Card key={tx.id} className="glass-card border-none">
                      <CardContent className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium text-sm capitalize">{(tx.type || "").replace(/_/g, ' ')}</p>
                          <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleString()}</p>
                        </div>
                        <span className={`font-bold ${tx.amount > 0 ? 'text-punt-green' : 'text-destructive'}`}>
                          {tx.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount), currency)}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="promos">
              <Empty icon={Gift} label="No upcoming promotions yet. Watch this space — bonuses for Founding Members go live soon." action={<Button asChild className="mt-4"><Link to="/founding-members">Founding Members</Link></Button>} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Kpi = ({ icon: Icon, label, value, accent }: any) => (
  <Card className="glass-card border-none">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
      <Icon className={`h-4 w-4 ${accent}`} />
    </CardHeader>
    <CardContent>
      <p className="text-xl md:text-2xl font-heading font-bold">{value}</p>
    </CardContent>
  </Card>
);

const Empty = ({ icon: Icon, label, action }: any) => (
  <Card className="glass-card border-none">
    <CardContent className="py-12 text-center text-muted-foreground">
      <Icon className="h-8 w-8 mx-auto mb-3 opacity-50" />
      <p>{label}</p>
      {action}
    </CardContent>
  </Card>
);

export default Dashboard;

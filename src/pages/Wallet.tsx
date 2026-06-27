import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus, History } from "lucide-react";

const Wallet = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 pb-28 md:pb-12">
      <div className="container py-10 max-w-3xl">
        <h1 className="font-heading text-3xl font-bold mb-6">Wallet</h1>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link to="/wallet/deposit" className="glass-card p-6 hover:shadow-glow transition-shadow">
            <Plus className="h-7 w-7 text-primary mb-3" />
            <p className="font-semibold">Deposit</p>
            <p className="text-xs text-muted-foreground mt-1">Visa, EFT, Crypto, 1Voucher</p>
          </Link>
          <Link to="/wallet/withdraw" className="glass-card p-6 hover:shadow-glow transition-shadow">
            <Minus className="h-7 w-7 text-destructive mb-3" />
            <p className="font-semibold">Withdraw</p>
            <p className="text-xs text-muted-foreground mt-1">R10 fee · Requires verified account</p>
          </Link>
          <Link to="/dashboard" className="glass-card p-6 hover:shadow-glow transition-shadow">
            <History className="h-7 w-7 text-foreground mb-3" />
            <p className="font-semibold">History</p>
            <p className="text-xs text-muted-foreground mt-1">All transactions in your dashboard</p>
          </Link>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Wallet;

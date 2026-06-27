import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Bot, LifeBuoy, MessageSquare, BookOpen } from "lucide-react";

const Help = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 pb-28 md:pb-12">
      <div className="container max-w-4xl py-10">
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Help Centre</h1>
        <p className="text-muted-foreground mb-8">Find answers fast, or talk to a human.</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <Tile to="/contact" icon={Bot} title="PuntHub AI" desc="Instant AI answers about deposits, withdrawals, verification and more." />
          <Tile to="/contact" icon={LifeBuoy} title="Contact Support" desc="Open a support ticket and we'll reply by email." />
          <Tile to="/contact" icon={MessageSquare} title="Support Tickets" desc="Manage your open tickets and conversations." />
          <Tile to="/contact" icon={BookOpen} title="FAQs" desc="Read frequently asked questions across all topics." />
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

const Tile = ({ to, icon: Icon, title, desc }: any) => (
  <Link to={to} className="glass-card p-6 hover:shadow-glow transition-shadow">
    <Icon className="h-7 w-7 text-primary mb-3" />
    <p className="font-heading font-bold">{title}</p>
    <p className="text-sm text-muted-foreground mt-1">{desc}</p>
  </Link>
);

export default Help;

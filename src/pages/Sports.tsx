import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const sports = [
  { name: "Football", events: 124, league: "Premier League · La Liga · UCL" },
  { name: "Rugby", events: 32, league: "URC · Six Nations · Currie Cup" },
  { name: "Cricket", events: 18, league: "Proteas · IPL · T20 World Cup" },
  { name: "Formula 1", events: 7, league: "2026 Grand Prix Season" },
  { name: "Basketball", events: 56, league: "NBA · EuroLeague" },
  { name: "Tennis", events: 42, league: "ATP · WTA · Grand Slams" },
  { name: "Boxing & MMA", events: 11, league: "UFC · WBC · IBF" },
  { name: "Golf", events: 9, league: "PGA · DP World Tour" },
];

const Sports = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 pb-28 md:pb-12">
      <div className="container py-10">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-7 w-7 text-primary" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold">Sports Betting</h1>
          <Badge variant="secondary" className="ml-2">Coming Soon</Badge>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Bet on football, rugby, cricket, F1, NBA, tennis and more with sharp South-African-focused odds. Live odds feed integration is queued for activation.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sports.map((s) => (
            <Card key={s.name} className="glass-card border-none hover:shadow-glow transition-shadow cursor-pointer">
              <CardContent className="py-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-heading font-bold">{s.name}</p>
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">{s.league}</p>
                <p className="mt-3 text-sm">{s.events} upcoming events</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Sports;

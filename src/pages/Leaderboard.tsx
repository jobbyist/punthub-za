import { motion } from "framer-motion";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  accuracy: number;
  predictions: number;
  badge: string;
}

const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "CryptoKing_SA", points: 45200, accuracy: 78, predictions: 312, badge: "🏆" },
  { rank: 2, name: "PredictorPro", points: 38900, accuracy: 74, predictions: 289, badge: "🥈" },
  { rank: 3, name: "MarketMaven", points: 34100, accuracy: 71, predictions: 256, badge: "🥉" },
  { rank: 4, name: "BettingBoss", points: 28700, accuracy: 69, predictions: 234, badge: "⭐" },
  { rank: 5, name: "SharpShooter", points: 25400, accuracy: 67, predictions: 198, badge: "⭐" },
  { rank: 6, name: "PuntMaster", points: 22100, accuracy: 65, predictions: 187, badge: "🔥" },
  { rank: 7, name: "OracleZA", points: 19800, accuracy: 63, predictions: 175, badge: "🔥" },
  { rank: 8, name: "WinStreak", points: 17500, accuracy: 62, predictions: 165, badge: "🔥" },
  { rank: 9, name: "BigBrain", points: 15200, accuracy: 60, predictions: 148, badge: "💎" },
  { rank: 10, name: "LuckyPunter", points: 13900, accuracy: 59, predictions: 142, badge: "💎" },
];

const getRankStyle = (rank: number) => {
  if (rank === 1) return "bg-punt-gold/10 border-punt-gold/30";
  if (rank === 2) return "bg-muted/60 border-muted-foreground/20";
  if (rank === 3) return "bg-primary/5 border-primary/20";
  return "";
};

const Leaderboard = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      <div className="container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground mb-8">Top predictors in the PuntHub community</p>
        </motion.div>

        {/* Top 3 podium */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {leaderboard.slice(0, 3).map((entry, i) => (
            <motion.div
              key={entry.rank}
              className={`glass-card p-6 text-center border ${getRankStyle(entry.rank)}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="text-4xl mb-2 block">{entry.badge}</span>
              <h3 className="font-heading font-bold text-lg">{entry.name}</h3>
              <p className="text-2xl font-heading font-bold text-primary mt-1">
                {entry.points.toLocaleString()} PP
              </p>
              <div className="flex justify-center gap-4 mt-3 text-xs text-muted-foreground">
                <span>{entry.accuracy}% accuracy</span>
                <span>{entry.predictions} picks</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Table for remaining */}
        <motion.div
          className="glass-card overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="text-left p-4 font-medium">Rank</th>
                  <th className="text-left p-4 font-medium">Predictor</th>
                  <th className="text-right p-4 font-medium">PuntPoints</th>
                  <th className="text-right p-4 font-medium hidden sm:table-cell">Accuracy</th>
                  <th className="text-right p-4 font-medium hidden md:table-cell">Predictions</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.slice(3).map((entry, i) => (
                  <motion.tr
                    key={entry.rank}
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <td className="p-4 font-heading font-bold text-muted-foreground">#{entry.rank}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span>{entry.badge}</span>
                        <span className="font-medium">{entry.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right font-heading font-bold text-primary">
                      {entry.points.toLocaleString()}
                    </td>
                    <td className="p-4 text-right hidden sm:table-cell text-muted-foreground">
                      {entry.accuracy}%
                    </td>
                    <td className="p-4 text-right hidden md:table-cell text-muted-foreground">
                      {entry.predictions}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Leaderboard;

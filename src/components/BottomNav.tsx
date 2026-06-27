import { Link, useLocation } from "react-router-dom";
import { Target, Dice5, Trophy, Wallet, LifeBuoy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const items = [
  { to: "/markets", label: "Markets", icon: Target },
  { to: "/casino", label: "Casino", icon: Dice5 },
  { to: "/sports", label: "Sports", icon: Trophy },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/help", label: "Help", icon: LifeBuoy },
];

const BottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return null;

  return (
    <nav
      aria-label="Primary mobile"
      className="md:hidden fixed bottom-3 left-3 right-3 z-50 glass-nav rounded-2xl px-2 py-2"
    >
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => {
          const active = location.pathname.startsWith(to);
          return (
            <li key={to} className="flex">
              <Link
                to={to}
                className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl text-[10px] font-medium transition-colors ${
                  active ? "text-primary bg-primary/10" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;

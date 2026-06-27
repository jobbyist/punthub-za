import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, Wallet, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/punthub-logo.jpeg";

const publicLinks = [
  { label: "Markets", href: "/markets" },
  { label: "Sports", href: "/sports" },
  { label: "Casino", href: "/casino" },
  { label: "Rewards", href: "/rewards" },
  { label: "Leaderboard", href: "/leaderboard" },
];

const authedLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Markets", href: "/markets" },
  { label: "Sports", href: "/sports" },
  { label: "Casino", href: "/casino" },
  { label: "Wallet", href: "/wallet", icon: Wallet },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const links = user ? authedLinks : publicLinks;

  return (
    <header className="sticky top-0 z-50 px-3 pt-3">
      <nav className="container glass-nav rounded-2xl flex items-center justify-between h-14 px-4">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <img src={logo} alt="PuntHub" className="h-8 w-auto rounded-lg" />
          <span className="font-heading font-bold text-sm hidden sm:inline">
            <span>punt</span><span className="text-primary">hub</span><span className="text-primary text-[10px] align-super">™</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname.startsWith(link.href) && link.href !== "/" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/profile"><User className="h-4 w-4 mr-1" />Profile</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-1" />Log Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button size="sm" asChild className="shadow-glow">
                <Link to="/signup">Sign Up Free →</Link>
              </Button>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <button className="p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Open menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden container mt-2 glass-card p-4 space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            {user ? (
              <>
                <Button variant="ghost" size="sm" className="flex-1" asChild>
                  <Link to="/profile" onClick={() => setMobileOpen(false)}>Profile</Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => { signOut(); setMobileOpen(false); }}>
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="flex-1" asChild>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>Log In</Link>
                </Button>
                <Button size="sm" className="flex-1" asChild>
                  <Link to="/signup" onClick={() => setMobileOpen(false)}>Sign Up Free</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

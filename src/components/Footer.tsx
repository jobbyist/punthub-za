import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-secondary/50">
    <div className="container py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <h3 className="font-heading font-bold text-lg mb-2">
            <span className="text-foreground">punt</span>
            <span className="text-primary">hub</span>
            <span className="text-primary text-xs align-super">™</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            The world's most rewarding prediction community.
          </p>
        </div>
        <div>
          <h4 className="font-heading font-semibold text-sm mb-3">Platform</h4>
          <div className="space-y-2">
            <Link to="/markets" className="block text-sm text-muted-foreground hover:text-primary">Markets</Link>
            <Link to="/leaderboard" className="block text-sm text-muted-foreground hover:text-primary">Leaderboard</Link>
            <Link to="/rewards" className="block text-sm text-muted-foreground hover:text-primary">Rewards</Link>
          </div>
        </div>
        <div>
          <h4 className="font-heading font-semibold text-sm mb-3">Company</h4>
          <div className="space-y-2">
            <span className="block text-sm text-muted-foreground">About</span>
            <span className="block text-sm text-muted-foreground">Careers</span>
            <span className="block text-sm text-muted-foreground">Contact</span>
          </div>
        </div>
        <div>
          <h4 className="font-heading font-semibold text-sm mb-3">Legal</h4>
          <div className="space-y-2">
            <span className="block text-sm text-muted-foreground">Terms of Service</span>
            <span className="block text-sm text-muted-foreground">Privacy Policy</span>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} PuntHub™. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;

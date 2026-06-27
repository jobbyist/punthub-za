import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

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
            South Africa's premier prediction community.
          </p>
        </div>
        <div>
          <h4 className="font-heading font-semibold text-sm mb-3">Platform</h4>
          <div className="space-y-2">
            <Link to="/markets" className="block text-sm text-muted-foreground hover:text-primary">Markets</Link>
            <Link to="/casino" className="block text-sm text-muted-foreground hover:text-primary">Casino</Link>
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
            <span className="block text-sm text-muted-foreground">Responsible Gaming</span>
          </div>
        </div>
      </div>

      {/* Responsible gaming disclaimer */}
      <div className="mt-10 rounded-xl border border-border bg-background p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <ShieldAlert className="h-6 w-6 text-primary shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold mb-1">Gamble Responsibly · 18+</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Gambling can be addictive. Only play with what you can afford to lose. PuntHub promotes responsible
            gaming and supports self-exclusion tools, deposit limits, and reality checks. If you or someone you
            know is struggling with gambling addiction, free confidential help is available 24/7 at{" "}
            <a
              href="https://www.gambleaware.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium underline underline-offset-2"
            >
              GambleAware®
            </a>
            {" "}or the South African Responsible Gambling Foundation (0800 006 008).
          </p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} PuntHub™. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;

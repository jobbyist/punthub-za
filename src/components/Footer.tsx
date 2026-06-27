import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-secondary/40 mt-8">
    <div className="container py-12">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <h3 className="font-heading font-bold text-lg mb-2">
            <span>punt</span><span className="text-primary">hub</span><span className="text-primary text-xs align-super">™</span>
          </h3>
          <p className="text-sm text-muted-foreground mb-2 max-w-sm">
            South Africa's premier prediction, casino & sports betting community. A wholly owned subsidiary of Gravitas Industries Pty Ltd (Reg. K2024/596436/07).
          </p>
          <p className="text-xs text-muted-foreground">7 Harvard Street · Kempton Park · Gauteng · South Africa</p>
        </div>
        <div>
          <h4 className="font-heading font-semibold text-sm mb-3">Platform</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <Link to="/markets" className="block hover:text-primary">Markets</Link>
            <Link to="/sports" className="block hover:text-primary">Sports</Link>
            <Link to="/casino" className="block hover:text-primary">Casino</Link>
            <Link to="/rewards" className="block hover:text-primary">Rewards</Link>
          </div>
        </div>
        <div>
          <h4 className="font-heading font-semibold text-sm mb-3">Company</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <Link to="/about" className="block hover:text-primary">About</Link>
            <Link to="/careers" className="block hover:text-primary">Careers</Link>
            <Link to="/founding-members" className="block hover:text-primary">Founding Members</Link>
            <Link to="/contact" className="block hover:text-primary">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="font-heading font-semibold text-sm mb-3">Support & Legal</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <Link to="/help" className="block hover:text-primary">Help Centre</Link>
            <Link to="/responsible-gaming" className="block hover:text-primary">Responsible Gaming</Link>
            <Link to="/legal/terms" className="block hover:text-primary">Terms & Conditions</Link>
            <Link to="/legal/privacy" className="block hover:text-primary">Privacy Policy</Link>
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-destructive/40 bg-destructive/5 p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <ShieldAlert className="h-6 w-6 text-destructive shrink-0" aria-hidden />
        <p className="text-xs leading-relaxed">
          <span className="font-semibold">Warning:</span> Gambling involves risk. By gambling on this website, you run the risk that you may lose. Gambling addiction is not selective; it could happen to you. Please play responsibly. No persons under the age of 18 years are permitted to gamble. Winners know when to stop. South African Responsible Gambling Foundation toll-free counselling line:{" "}
          <a href="tel:0800006008" className="font-semibold underline">0800 006 008</a> or WhatsApp HELP to{" "}
          <a href="https://wa.me/27766750710" className="font-semibold underline">076 675 0710</a>. Visit{" "}
          <a href="https://www.responsiblegambling.org.za" target="_blank" rel="noopener noreferrer" className="font-semibold underline">www.responsiblegambling.org.za</a> for more information.
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row gap-2 justify-between text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} PuntHub™ · Gravitas Industries Pty Ltd. All rights reserved.</span>
        <span>support@punthub.fun · punthub@gravitas.uno</span>
      </div>
    </div>
  </footer>
);

export default Footer;

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 pb-28 md:pb-12">
      <div className="container max-w-3xl py-12">
        <h1 className="font-heading text-4xl font-bold mb-4">About PuntHub™</h1>
        <p className="text-muted-foreground mb-6">
          PuntHub™ is a next-generation peer-to-peer social betting and prediction gaming platform built for the African market.
          Our mission is to make interactive wagering, competition and community participation more accessible, engaging and culturally relevant for a modern digital audience.
        </p>
        <p className="text-muted-foreground mb-6">
          PuntHub™ is a wholly owned subsidiary of <strong>Gravitas Industries Pty Ltd</strong> (Reg. No. K2024/596436/07), headquartered at
          7 Harvard Street, Kempton Park, Gauteng, South Africa.
        </p>
        <p className="text-muted-foreground">
          The platform combines proprietary prediction markets with integrations from Polymarket, leading iGaming providers, sports data feeds and global payment partners.
          25% of betting options across all markets are published and managed by PuntHub; 75% are pulled dynamically from Polymarket via API.
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

export default About;

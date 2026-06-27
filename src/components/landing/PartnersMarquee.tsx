const partners = [
  "Polymarket", "BetCentric", "Google", "Anthropic (Claude)", "Coinbase",
  "PaymentCloud", "Habanero", "Pragmatic Play", "Paddle", "Stripe",
  "Sportradar", "AWS",
];

const loop = [...partners, ...partners];

const PartnersMarquee = () => (
  <section className="py-16 border-t border-border bg-secondary/30 overflow-hidden">
    <div className="container mb-6 text-center">
      <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
        Powered by industry leaders
      </p>
      <h3 className="font-heading text-2xl md:text-3xl font-bold mt-2">Built on trusted technology</h3>
    </div>
    <div className="relative w-full overflow-hidden">
      <div className="flex gap-6 animate-marquee whitespace-nowrap">
        {loop.map((name, i) => (
          <div
            key={`${name}-${i}`}
            className="flex items-center justify-center px-6 py-4 min-w-[180px] rounded-2xl glass-card"
          >
            <span className="font-heading font-bold text-base text-foreground/80 tracking-tight">{name}</span>
          </div>
        ))}
      </div>
    </div>
    <p className="container mt-6 text-[11px] text-center text-muted-foreground max-w-3xl">
      Displayed organisations represent existing integrations, technology providers, commercial relationships or intended future integration partners where applicable, and should not be interpreted as endorsements unless officially announced.
    </p>
  </section>
);

export default PartnersMarquee;

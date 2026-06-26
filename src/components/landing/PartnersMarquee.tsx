const partners = [
  "Polymarket",
  "Betway",
  "PaymentCloud",
  "SportingBet",
  "Coinbase",
  "Paddle",
  "PredictStreet",
  "Claude by Anthropic",
  "iGaming",
  "Habanero",
];

// Duplicate the list so the marquee loops seamlessly
const loop = [...partners, ...partners];

const PartnersMarquee = () => (
  <section className="py-16 border-t border-border bg-secondary/30 overflow-hidden">
    <div className="container mb-8 text-center">
      <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
        Trusted partners & integrations
      </p>
    </div>
    <div className="relative w-full overflow-hidden">
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {loop.map((name, i) => (
          <div
            key={`${name}-${i}`}
            className="flex items-center justify-center px-8 py-4 min-w-[200px] rounded-xl bg-card border border-border"
          >
            <span className="font-heading font-bold text-lg text-foreground/80 tracking-tight">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PartnersMarquee;

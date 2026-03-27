import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";

const CTASection = () => (
  <section className="py-20 bg-primary text-primary-foreground">
    <div className="container text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Target className="h-10 w-10 mx-auto mb-4 opacity-80" />
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
          Join Our Community Today
        </h2>
        <p className="max-w-lg mx-auto mb-8 opacity-90">
          Sign up as a founding member and receive 500 PuntPoints instantly.
          Start predicting and climb the leaderboard.
        </p>
        <Button
          size="lg"
          variant="secondary"
          asChild
        >
          <Link to="/signup">Get Started — It's Free</Link>
        </Button>
      </motion.div>
    </div>
  </section>
);

export default CTASection;

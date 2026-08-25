import { ShieldCheck, Target, Scale, Database } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How We Test | Afforder",
  description: "Learn about our rigorous testing methodology, AI-driven analysis, and commitment to objective product recommendations.",
};

export default function HowWeTestPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 pt-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-900 dark:bg-primary-900/30 dark:text-primary-100 text-sm font-medium mb-6 ring-1 ring-inset ring-primary-200 dark:ring-primary-800">
            <ShieldCheck className="w-4 h-4" />
            <span>Our Editorial Standards</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-outfit font-extrabold text-slate-900 dark:text-white mb-6">
            How We Test & Compare
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-inter">
            At Afforder, we believe you deserve the absolute truth before making a purchase. We rely on hard data, real-world utility, and AI-driven aggregation to cut through marketing hype.
          </p>
        </div>

        <div className="space-y-12">
          
          {/* Section 1 */}
          <section className="glass-panel p-8 md:p-10">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                <Database className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-outfit font-bold text-slate-900 dark:text-white mb-3">1. Data Aggregation</h2>
                <p className="text-slate-600 dark:text-slate-400 font-inter leading-relaxed">
                  We start by collecting every verifiable specification from manufacturers. We don't just look at the top-line numbers; we dig into the thermal limits, battery chemistry, and build materials. This forms our objective baseline.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="glass-panel p-8 md:p-10">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-xl bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center text-accent-600 dark:text-accent-400 flex-shrink-0">
                <Target className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-outfit font-bold text-slate-900 dark:text-white mb-3">2. Real-World Benchmarks</h2>
                <p className="text-slate-600 dark:text-slate-400 font-inter leading-relaxed">
                  A processor might perform well in a laboratory, but how does it handle opening 50 browser tabs while rendering a video? We source and aggregate independent benchmark data that reflects actual human workflows, not synthetic scores.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="glass-panel p-8 md:p-10">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                <Scale className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-outfit font-bold text-slate-900 dark:text-white mb-3">3. AI Sentiment Analysis</h2>
                <p className="text-slate-600 dark:text-slate-400 font-inter leading-relaxed">
                  We use advanced AI models to read through thousands of verified customer reviews across the web. The AI filters out fake reviews and identifies consistent patterns (e.g., "the hinge broke after 3 months"). This allows us to spot long-term durability issues that a day-one review would miss.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-slate-900 dark:bg-black rounded-3xl p-8 md:p-12 text-center text-white shadow-xl mt-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-accent-600/20 mix-blend-overlay"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-outfit font-bold mb-4">Our Independence Guarantee</h2>
              <p className="text-slate-300 font-inter max-w-2xl mx-auto text-lg">
                We are never paid to rank a product higher. While we may earn an affiliate commission if you purchase through our links, our AI verdicts and spec comparisons are strictly mathematical and unalterable by sponsors.
              </p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}

import Globe from "@/components/ui/globe";

export default function AchievementsSection() {
  return (
    <section className="spacing-section">
      <h2 className="heading-section">Our <span className="font-bold text-primary">achievements</span></h2>
      <div className="flex-col md:flex-row gap-4 lg:gap-16 flex items-center">
        <div className="flex-shrink-0 size-[360px] md:size-[440px] lg:size-[600px]">
          <Globe />
        </div>
        <div className="space-y-6 lg:space-y-12 text-center md:text-left">
          <div>
            <p className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted">
              72,000+
            </p>
            <p className="mt-2 text-muted-foreground lg:text-lg">
              wallets analyzed
            </p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted">
              5,700+
            </p>
            <p className="mt-2 text-muted-foreground lg:text-lg">
              threats detected
            </p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted">
              1,100+
            </p>
            <p className="mt-2 text-muted-foreground lg:text-lg">
              criminals arrested
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

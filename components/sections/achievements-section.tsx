import Globe from "@/components/ui/globe";

interface AchievementStatProps {
  value: string;
  description: string;
}

function AchievementStat({ value, description }: AchievementStatProps) {
  return (
    <div>
      {/* Use a gradient to create a slightly faded effect at the end of the text */}
      <p className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted">
        {value}
      </p>
      <p className="mt-2 text-muted-foreground lg:text-lg">{description}</p>
    </div>
  );
}

export default function AchievementsSection() {
  return (
    <section className="spacing-section">
      <h2 className="heading-section">
        Our <span className="font-bold text-primary">achievements</span>
      </h2>
      <div className="flex-col md:flex-row gap-4 lg:gap-16 flex items-center">
        <div className="flex-shrink-0 size-[360px] md:size-[440px] lg:size-[600px]">
          <Globe />
        </div>
        <div className="space-y-6 lg:space-y-12 text-center md:text-left">
          <AchievementStat value="72,000+" description="wallets analyzed" />
          <AchievementStat value="5,700+" description="threats detected" />
          <AchievementStat value="1,100+" description="criminals arrested" />
        </div>
      </div>
    </section>
  );
}

import Globe from "@/components/ui/globe";
import ClientOnly from "@/components/client-only";

interface AchievementStatProps {
  value: string;
  description: string;
}

function AchievementStat({ value, description }: AchievementStatProps) {
  return (
    <div>
      {/* Use a gradient to create a slightly faded effect at the end of the text */}
      <p className="bg-gradient-to-r from-foreground to-muted bg-clip-text text-4xl font-bold text-transparent md:text-5xl lg:text-6xl xl:text-7xl">
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
      <div className="flex flex-col items-center gap-4 md:flex-row lg:gap-16">
        <div className="size-[360px] flex-shrink-0 md:size-[440px] lg:size-[600px]">
          {/* Render the globe component only on the client side (do not prerender on the server because that causes issues for some reason) */}
          <ClientOnly>
            <Globe />
          </ClientOnly>
        </div>
        <div className="space-y-6 text-center md:text-left lg:space-y-12">
          <AchievementStat value="72,000+" description="wallets analyzed" />
          <AchievementStat value="5,700+" description="threats detected" />
          <AchievementStat value="1,100+" description="criminals arrested" />
        </div>
      </div>
    </section>
  );
}

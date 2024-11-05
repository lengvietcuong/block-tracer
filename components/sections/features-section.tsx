import { IconType } from "react-icons";
import { PiCubeFocus as BlockchainIcon } from "react-icons/pi";
import { TbEyeSearch as EyeIcon } from "react-icons/tb";

interface FeatureCardProps {
  icon: IconType;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="relative max-w-sm overflow-hidden rounded border p-6 md:p-8">
      {/* This div renders a dot pattern that fades from top to bottom */}
      <div className="absolute inset-0 -z-20 bg-dot-white/25 before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:to-background" />

      {/* This div renders a soft radial light from the top */}
      <div className="absolute left-1/2 top-0 -z-10 block h-1/2 w-full -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(farthest-side,hsl(var(--primary)),rgba(0,0,0,0))] opacity-25" />

      <Icon className="size-20 text-primary lg:size-24" />
      <div>
        <h3 className="mt-3 text-lg font-bold md:mt-5 md:text-xl lg:text-2xl">
          {title}
        </h3>
        <p className="mt-3 max-w-md text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section className="spacing-section">
      <h2 className="heading-section">
        How our platform{" "}
        <span className="font-bold text-primary">combats fraud</span>
      </h2>
      <div className="mt-8 flex flex-col gap-6 md:mt-10 md:flex-row md:justify-center md:gap-8 lg:mt-12 lg:gap-20">
        <FeatureCard
          icon={BlockchainIcon}
          title="Detailed analytics"
          description="Gain deep insights into transactions with real-time data and comprehensive reports to quickly detect suspicious activities."
        />
        <FeatureCard
          icon={EyeIcon}
          title="Powerful visualization"
          description="Easily track complex transaction flows with intuitive graphs and charts, simplifying the investigation process for even the most complex cases."
        />
      </div>
    </section>
  );
}

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
    <div className="relative overflow-hidden max-w-sm p-6 md:p-8 rounded border bg-dot-white/[0.2]">
      <div className="opacity-25 absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 block bg-[radial-gradient(farthest-side,hsl(var(--primary)),rgba(0,0,0,0))] w-full h-1/2 -z-10" />
      <Icon className="size-20 lg:size-24 text-primary" />
      <div>
        <h3 className="mt-3 md:mt-5 font-bold text-lg md:text-xl lg:text-2xl">
          {title}
        </h3>
        <p className="mt-3 max-w-md text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section className="spacing-section">
      <h2 className="heading-section">
        How our platform{" "}
        <span className="text-primary font-bold">combats fraud</span>
      </h2>
      <div className="flex flex-col md:flex-row md:justify-center gap-6 md:gap-8 lg:gap-20 mt-8 md:mt-10 lg:mt-12">
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

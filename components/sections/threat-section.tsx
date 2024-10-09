import CrimeDataChart from "@/components/crime-data-chart";
import { PiArrowUpRightBold as UpRightArrowIcon } from "react-icons/pi";

export default function ThreatSection() {
  // This section states the problem the platform aims to solve
  return (
    <section className="spacing-section">
      <h2 className="heading-section">
        The threat is{" "}
        <span className="font-bold text-destructive">unprecedented</span>
      </h2>
      <p className="mt-2 md:mt-3 text-center text-muted-foreground text-sm">
        Source:{" "}
        <a
          href="https://www.ic3.gov/Media/PDF/AnnualReport/2023_IC3CryptocurrencyReport.pdf"
          target="_blank"
          className="hover:underline underline-offset-4 peer hover:text-foreground transition-colors"
        >
          FBI
        </a>
        <UpRightArrowIcon className="inline-block ml-1 peer peer-hover:fill-foreground transition-colors" />
      </p>
      <div className="flex flex-col lg:flex-row mt-6 md:mt-9 lg:mt-12 gap-12">
        <div className="w-full lg:w-1/2 flex-shrink-0 h-96">
          <h3 className="font-bold text-center text-lg md:text-xl lg:text-2xl">
            Loss from crypto fraud
          </h3>
          <CrimeDataChart />
        </div>

        <div className="lg:max-w-sm">
          <p className="text-muted-foreground">
            In 2023, the FBI received over{" "}
            <span className="text-foreground font-bold">
              69,000 complaints
            </span>{" "}
            from more than{" "}
            <span className="text-foreground font-bold">200 countries</span>{" "}
            about crypto fraud, with losses exceeding{" "}
            <span className="text-foreground font-bold">$5.6 billion</span>.
          </p>
          <br />
          <p className="text-muted-foreground">
            Being{" "}
            <span className="text-foreground font-bold">
              decentralized, fast, and irreversible
            </span>
            , cryptocurrencies attract criminals and make recovering stolen
            funds difficult.
          </p>
          <br />
          <p className="text-muted-foreground">
            <span className="text-foreground font-bold">
              Quick, accurate reporting is crucial
            </span>{" "}
            for investigation.
          </p>
        </div>
      </div>
    </section>
  );
}

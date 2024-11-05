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
      <p className="mt-2 text-center text-sm text-muted-foreground md:mt-3">
        Source:{" "}
        <a
          href="https://www.ic3.gov/Media/PDF/AnnualReport/2023_IC3CryptocurrencyReport.pdf"
          target="_blank"
          className="peer underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          FBI
        </a>
        <UpRightArrowIcon className="peer ml-1 inline-block transition-colors peer-hover:fill-foreground" />
      </p>
      <div className="mt-6 flex flex-col gap-8 md:mt-9 md:gap-10 lg:mt-12 lg:flex-row lg:gap-20">
        <div className="w-full flex-shrink-0 lg:w-1/2">
          <h3 className="text-center text-lg font-bold md:text-xl lg:text-2xl">
            Loss from crypto fraud
          </h3>
          <CrimeDataChart />
        </div>

        <div className="lg:max-w-sm">
          <p className="text-muted-foreground">
            In 2023, the FBI received over{" "}
            <span className="font-bold text-foreground">69,000 complaints</span>{" "}
            from more than{" "}
            <span className="font-bold text-foreground">200 countries</span>{" "}
            about crypto fraud, with losses exceeding{" "}
            <span className="font-bold text-foreground">$5.6 billion</span>.
          </p>
          <br />
          <p className="text-muted-foreground">
            Being{" "}
            <span className="font-bold text-foreground">
              decentralized, fast, and irreversible
            </span>
            , cryptocurrencies attract criminals and make recovering stolen
            funds difficult.
          </p>
          <br />
          <p className="text-muted-foreground">
            <span className="font-bold text-foreground">
              Quick, accurate reporting is crucial
            </span>{" "}
            for investigation.
          </p>
        </div>
      </div>
    </section>
  );
}

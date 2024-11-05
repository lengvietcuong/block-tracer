import { FaFacebook as FacebookIcon } from "react-icons/fa6";
import { FaApple as AppleIcon } from "react-icons/fa";
import { FaAmazon as AmazonIcon } from "react-icons/fa";
import { RiNetflixFill as NetflixIcon } from "react-icons/ri";
import { FaGoogle as GoogleIcon } from "react-icons/fa";
import { FaEthereum as EtheriumIcon } from "react-icons/fa";
import Image from "next/image";
import profileImage from "@/public/vitalik-buterin.png";
import { IconType } from "react-icons";

interface BrandCardProps {
  Icon: IconType;
  name: string;
}

function BrandCard({ Icon, name }: BrandCardProps) {
  // This component renders a square card containing the brand logo and name, with a soft white shadow
  return (
    <div className="flex size-16 flex-col items-center justify-center gap-2 rounded border shadow-[0_0_20px_5px_hsl(var(--muted-foreground)/0.25)] md:size-24 lg:size-36">
      <Icon className="size-6 md:size-9 lg:size-12" />
      <p className="hidden lg:block">{name}</p>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="spacing-section pb-20 md:pb-24">
      <h2 className="heading-section">
        <span className="font-bold text-primary">Trusted</span> by industry
        leaders
      </h2>
      <div className="mx-auto mt-8 flex max-w-screen-lg justify-evenly md:mt-10 lg:mt-12">
        <BrandCard Icon={FacebookIcon} name="Facebook" />
        <BrandCard Icon={AppleIcon} name="Apple" />
        <BrandCard Icon={AmazonIcon} name="Amazon" />
        <BrandCard Icon={NetflixIcon} name="Netflix" />
        <BrandCard Icon={GoogleIcon} name="Google" />
      </div>
      <div className="mx-auto mt-14 flex max-w-screen-md gap-4 md:mt-16 md:gap-8 lg:mt-20">
        <div className="size-20 flex-shrink-0 overflow-hidden rounded-full bg-muted md:size-36 lg:size-48">
          <Image src={profileImage} alt="Vitalik Buterin" />
        </div>
        <div className="self-stretch border-l border-muted"></div>
        <div>
          {/* He didn't say this */}
          <p className="italic lg:text-lg">
            Block Tracer is truly an incredible platform for transaction
            tracing. I can&apos;t imagine how the world would be like without
            it.
          </p>
          <br />
          <p className="text-lg font-bold text-primary">Vitalik Buterin</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Founder of Etherium
            <EtheriumIcon className="ml-1 inline-block size-3" />
          </p>
        </div>
      </div>
    </section>
  );
}

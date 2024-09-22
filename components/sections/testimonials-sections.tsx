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
  return (
    <div className="rounded shadow-[0_0_20px_5px_hsl(var(--muted-foreground)/0.25)] size-16 md:size-24 lg:size-36 border flex justify-center items-center flex-col gap-2">
      <Icon className="size-6 md:size-9 lg:size-12" />
      <p className="hidden lg:block">{name}</p>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="spacing-section pb-20 md:pb-24">
      <h2 className="text-center text-3xl md:text-4xl lg:text-5xl">
        <span className="font-bold">Trusted</span> by the best.
      </h2>
      <div className="mt-8 md:mt-10 lg:mt-12 flex mx-auto max-w-screen-lg justify-evenly">
        <BrandCard Icon={FacebookIcon} name="Facebook" />
        <BrandCard Icon={AppleIcon} name="Apple" />
        <BrandCard Icon={AmazonIcon} name="Amazon" />
        <BrandCard Icon={NetflixIcon} name="Netflix" />
        <BrandCard Icon={GoogleIcon} name="Google" />
      </div>
      <div className="mx-auto flex mt-14 md:mt-16 lg:mt-20 gap-4 md:gap-8 max-w-screen-md">
        <div className="flex-shrink-0 size-20 md:size-36 lg:size-48 bg-muted rounded-full overflow-hidden">
          <Image src={profileImage} alt="Vitalik Buterin" />
        </div>
        <div className="border-l self-stretch border-muted"></div>
        <div>
          <p className="italic lg:text-lg">
            Block Tracer is truly an incredible platform for transaction
            tracing. I can&apos;t imagine how the world would be like without
            it.
          </p>
          <br />
          <p className="text-lg text-primary font-bold">Vitalik Buterin</p>
          <p className="mt-1 text-muted-foreground text-sm">
            Founder of Etherium
            <EtheriumIcon className="inline-block ml-1 size-3" />
          </p>
        </div>
      </div>
    </section>
  );
}

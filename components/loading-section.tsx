import Image from "next/image";
import rotatingCat from "@/public/rotating_cat.gif";
import LoadingSpinner from "@/components/icons/loading-spinner";

export default function Loading() {
  return (
    <div className="animate-[spin_3s_linear_infinite] [animation-play-state:running] relative w-24 h-24">
      <div className="absolute inset-0 animate-[scale_2s_ease-in-out_infinite]">
        <LoadingSpinner className="fill-primary"/>
      </div>
      <Image src={rotatingCat} alt="Rotating Cat" className="w-full h-full" />
    </div>
  );
}

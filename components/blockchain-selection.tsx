import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BlockchainSymbol } from "@/types";
import { BLOCKCHAIN_NAMES } from "@/constants";
import Etherium from "./icons/etherium";
import Binance from "./icons/binance";
import Avalanche from "./icons/avalanche";
import Polygon from "./icons/polygon";
import Klaytn from "./icons/klaytn";
import Swincoin from "./icons/swincoin";

const BLOCKCHAIN_ICONS = {
  ETH: Etherium,
  BNB: Binance,
  AVAX: Avalanche,
  MATIC: Polygon,
  KLAY: Klaytn,
  SWC: Swincoin,
};

interface BlockchainSelectionProps {
  className?: string;
  blockchain: BlockchainSymbol;
  setBlockchain: (blockchain: BlockchainSymbol) => void;
}

export default function BlockchainSelection({
  className,
  blockchain,
  setBlockchain,
}: BlockchainSelectionProps) {
  function renderBlockchain(symbol: BlockchainSymbol) {
    const Icon = BLOCKCHAIN_ICONS[symbol];
    return (
      <div className="flex items-center gap-2">
        <Icon className="size-4" />
        {symbol}
      </div>
    );
  }

  return (
    <Select value={blockchain} onValueChange={setBlockchain}>
      <SelectTrigger
        id="blockchain"
        aria-label="Select blockchain"
        className={className}
      >
        <SelectValue placeholder="Blockchain" />
      </SelectTrigger>
      <SelectContent side="bottom">
        {Object.keys(BLOCKCHAIN_NAMES).map((key) => (
          <SelectItem key={key} value={key}>
            {renderBlockchain(key as keyof typeof BLOCKCHAIN_NAMES)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BlockchainSymbol } from "@/types";
import { BLOCKCHAIN_NAMES } from "@/constants";
import Etherium from "../icons/etherium";
import Binance from "../icons/binance";
import Avalanche from "../icons/avalanche";
import Polygon from "../icons/polygon";
import Klaytn from "../icons/klaytn";
import Swincoin from "../icons/swincoin";

const BLOCKCHAIN_ICONS = {
  eth: Etherium,
  bnb: Binance,
  avax: Avalanche,
  matic: Polygon,
  klay: Klaytn,
  swc: Swincoin,
};

interface BlockchainSelectionProps {
  className?: string;
  blockchainSymbol: BlockchainSymbol;
  setBlockchainSymbol: (blockchainSymbol: BlockchainSymbol) => void;
}

export default function BlockchainSelection({
  className,
  blockchainSymbol,
  setBlockchainSymbol,
}: BlockchainSelectionProps) {
  function renderBlockchain(symbol: BlockchainSymbol) {
    const Icon = BLOCKCHAIN_ICONS[symbol];
    return (
      <div className="flex items-center gap-2">
        <Icon className="size-4" />
        {symbol.toUpperCase()}
      </div>
    );
  }

  return (
    <Select value={blockchainSymbol} onValueChange={setBlockchainSymbol}>
      <SelectTrigger
        id="blockchainSymbol"
        aria-label="Select blockchainSymbol"
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

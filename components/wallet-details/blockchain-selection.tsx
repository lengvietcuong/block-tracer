import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BlockchainSymbol } from "@/types";
import { BLOCKCHAIN_NAMES } from "@/constants";
import Etherium from "@/components/icons/etherium";
import Binance from "@/components/icons/binance";
import Avalanche from "@/components/icons/avalanche";
import Polygon from "@/components/icons/polygon";
import Klaytn from "@/components/icons/klaytn";
import Swincoin from "@/components/icons/swincoin";

// Map of blockchain symbols to their respective icon components
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
  blockchainSymbol: BlockchainSymbol; // Current selected blockchain symbol
  setBlockchainSymbol: (blockchainSymbol: BlockchainSymbol) => void; // Function to update selected blockchain
}

export default function BlockchainSelection({
  className,
  blockchainSymbol,
  setBlockchainSymbol,
}: BlockchainSelectionProps) {
  // Helper function to render each blockchain item with its icon and symbol
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
        id="blockchain-symbol"
        aria-label="Select blockchain symbol"
        className={className}
      >
        <SelectValue placeholder="Blockchain" />
      </SelectTrigger>
      {/* Render all supported blockchains in the dropdown */}
      <SelectContent side="bottom">
        {Object.keys(BLOCKCHAIN_NAMES).map((key) => (
          <SelectItem key={key} value={key}>
            {renderBlockchain(key as BlockchainSymbol)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

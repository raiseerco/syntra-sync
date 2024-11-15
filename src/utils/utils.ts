import { SiweMessage } from "siwe";

export function weiToEther(wei: string | number): string {
  const weiBigInt = BigInt(wei);
  const ether = weiBigInt / BigInt(10 ** 18);
  const etherString = ether.toString();
  return (
    parseFloat(etherString) +
    parseFloat("0." + String(weiBigInt % BigInt(10 ** 18)).padStart(18, "0"))
  ).toString();
}

const domain = "syntra.pro";
const uri = "https://www.syntra.pro";

export function createSiweMessage(
  address: string,
  statement: string,
  nonce: string,
) {
  const siweMessage = new SiweMessage({
    domain,
    address,
    statement,
    uri,
    version: "1",
    chainId: 1,
    nonce,
  });

  return siweMessage.prepareMessage();
}

export async function delay(ms: string | number) {
  return new Promise(resolve => setTimeout(resolve, parseInt(ms.toString())));
}

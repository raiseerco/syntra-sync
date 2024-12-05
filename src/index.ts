import { fetchProposalsAgora } from "./api/agora";
import { fetchProposalsSnapshot } from "./api/snapshot";
import { fetchProposalsTally } from "./api/tally";
import { saveProposalsBatch } from "./services/firestore";
import { sendTelegramMessage } from "./services/telegram";

const TALLY_ORGANIZATION_ID = "2206072050315953936"; // TODO take from firebase
const SNAPSHOT_DAO_ADDRESS = "arbitrumfoundation.eth"; // TODO take from firebase

async function start() {
  try {
    sendTelegramMessage("🏁 Sync process started...");
    const proposalsAgora = await fetchProposalsAgora();
    const proposalsTally = await fetchProposalsTally(
      TALLY_ORGANIZATION_ID as string,
    );
    const proposalsSnapshot = await fetchProposalsSnapshot(
      SNAPSHOT_DAO_ADDRESS as string,
    );

    const allData: any[] = [
      ...(proposalsAgora.ok && proposalsAgora.data ? proposalsAgora.data : []),
      ...(proposalsTally.ok && proposalsTally.data ? proposalsTally.data : []),
      ...(proposalsSnapshot.ok && proposalsSnapshot.data
        ? proposalsSnapshot.data
        : []),
    ];

    await saveProposalsBatch(allData);
    const endingMessage = `✅ Sync finished ok. Processed ${allData.length} proposals.`;

    console.log(endingMessage);
    sendTelegramMessage(endingMessage);
  } catch (error: any) {
    console.error("❌ Error in start function:", error);
    sendTelegramMessage("❌ Sync error: " + error.message);
    throw error;
  }
}

start();

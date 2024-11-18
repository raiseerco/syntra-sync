import { fetchProposalsAgora } from "./api/agora";
import { fetchProposalsSnapshot } from "./api/snapshot";
import { fetchProposalsTally } from "./api/tally";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { saveProposalsBatch } from "./services/firestore";

const TALLY_ORGANIZATION_ID = "2206072050315953936"; // TODO take from firebase
const SNAPSHOT_DAO_ADDRESS = "arbitrumfoundation.eth"; // TODO take from firebase

async function start() {
  try {
    const [proposalsAgora, proposalsTally, proposalsSnapshot] =
      await Promise.all([
        fetchProposalsAgora(),
        fetchProposalsTally(TALLY_ORGANIZATION_ID as string),
        fetchProposalsSnapshot(SNAPSHOT_DAO_ADDRESS as string),
      ]);

    const allData: any[] = [
      ...(proposalsAgora.ok && proposalsAgora.data ? proposalsAgora.data : []),
      ...(proposalsTally.ok && proposalsTally.data ? proposalsTally.data : []),
      ...(proposalsSnapshot.ok && proposalsSnapshot.data
        ? proposalsSnapshot.data
        : []),
    ];

    await saveProposalsBatch(allData);
    console.log(`*** Processed ${allData.length} proposals successfully`);
  } catch (error) {
    console.error("Error in start function:", error);
    throw error;
  }
}

export const dailySync = onSchedule(
  {
    schedule: "0 10 * * *", // 10 AM UTC = 7 AM GMT-3
    timeZone: "America/Argentina/Buenos_Aires",
    retryCount: 3,
    memory: "256MiB",
  },
  async event => {
    try {
      await start();
      console.log("Daily sync completed successfully");
    } catch (error) {
      console.error("Error during daily sync:", error);
      throw error;
    }
  },
);

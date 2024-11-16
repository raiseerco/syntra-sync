import dotenv from "dotenv";
import { fetchProposalsAgora } from "./api/agora";
import { fetchProposalsSnapshot } from "./api/snapshot";
import { fetchProposalsTally } from "./api/tally";
import { saveProposalsBatch } from "./services/firestore";

dotenv.config();

const TALLY_ORGANIZATION_ID = process.env.TALLY_ORGANIZATION_ID;
const SNAPSHOT_DAO_ADDRESS = process.env.SNAPSHOT_DAO_ADDRESS;

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
  } catch (error) {
    console.error("Error ", error);
  }
}

start(); // Executes the fetch and store

// executed at midnight UTC
// export const scheduledFetchAndStore = functions.pubsub
//   .schedule("0 0 * * *")
//   .onRun(async () => {
//     try {
//       console.log("Running scheduled fetch and store");
//       await start();
//     } catch (error) {
//       console.error("Error al obtener o guardar datos:", error);
//     }
//   });

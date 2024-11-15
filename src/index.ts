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

start();

// // Función programada que corre diariamente a la medianoche UTC
// export const scheduledFetchAndStore = functions.pubsub
//   .schedule("0 0 * * *")
//   .onRun(async () => {
//     try {
//       // 1. fetch data from apis

//       //

//       const response = await fetch("https://api.example.com/data");
//       if (!response.ok) {
//         throw new Error(`Error en la API: ${response.statusText}`);
//       }
//       const data = await response.json();

//       // 2. store in Firestore
//       await db.collection("externalData").add({
//         ...data,
//         fetchedAt: admin.firestore.FieldValue.serverTimestamp(),
//       });

//       console.log("Datos guardados correctamente en Firestore.");
//     } catch (error) {
//       console.error("Error al obtener o guardar datos:", error);
//     }
//   });

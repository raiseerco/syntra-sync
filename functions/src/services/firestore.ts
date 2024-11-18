import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

if (process.env.GOOGLE_CLOUD_PROJECT) {
  // IF script is in Google Cloud Functions, we use the default service account
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.FBASE_DATABASE_URL,
  });
} else {
  // If script is running locally, we use the service account
  const serviceAccount = JSON.parse(
    process.env.FBASE_CREDENTIALS_JSON as string,
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FBASE_DATABASE_URL,
  });
}

const db = admin.firestore();

export async function saveProposalsBatch(proposals: any[]) {
  //  split proposals into each DAO
  console.log("*** Attempt to write");
  const batchSize = 500; // Max length in Firestore

  const DAOCollection = db.collection("DAOS");

  try {
    const snapshot = await DAOCollection.get();
    for (const doc of snapshot.docs) {
      // each DAO

      const daoId = doc.id;
      const proposalsCollection = db.collection(`DAOS/${daoId}/proposals`);
      const daoProposals = proposals.filter(i => i.dao === daoId);

      const chunks = [];
      for (let i = 0; i < daoProposals.length; i += batchSize) {
        chunks.push(daoProposals.slice(i, i + batchSize));
      }

      for (const chunk of chunks) {
        const batch = db.batch();

        chunk.forEach(proposal => {
          const proposalDoc = proposalsCollection.doc(proposal.id);
          batch.set(proposalDoc, proposal);
        });

        try {
          await batch.commit();
          console.log(
            `* ${daoId}: Batch of ${chunk.length} saved successfully.`,
          );
        } catch (error) {
          console.error("Error: ", error);
        }
      }
    }
    console.log("*** Write done");
  } catch (error) {
    console.error("Error retrieving DAOs: ", error);
  }
}

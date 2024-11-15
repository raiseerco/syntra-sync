import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

if (process.env.GOOGLE_CLOUD_PROJECT) {
  // Si el script corre en Google Cloud Functions, usamos las credenciales x default de Google
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
} else {
  // Si ejecuta el script fuera de Google Cloud Functions (en local o en otro entorno), usa el archivo JSON con las credenciales
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_CREDENTIALS_JSON as string,
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const db = admin.firestore();

export async function saveProposalsBatch(proposals: any[]) {
  const batchSize = 500; // max len in firestore
  const proposalsCollection = db.collection("proposals");
  const chunks = [];

  for (let i = 0; i < proposals.length; i += batchSize) {
    chunks.push(proposals.slice(i, i + batchSize));
  }

  for (const chunk of chunks) {
    const batch = db.batch();

    chunk.forEach(proposal => {
      const proposalDoc = proposalsCollection.doc(proposal.id);
      batch.set(proposalDoc, proposal);
    });

    try {
      await batch.commit();
      console.log(`Batch of ${chunk.length} saved successfully.`);
    } catch (error) {
      console.error("Error: ", error);
    }
  }
}

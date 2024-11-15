# Syntra Sync

These are the central scripts for gathering all the DAO APIs data. Read them all, unify them all into a single storage structure for using later with the Syntra Platform.

Basic flow for proposals:

- reads from Agora
- reads from Snapshot
- reads from Tally
- unifies the proposals properties into a single standardized structure
- splits the data into batches of 500 proposals (max allowed by Firestore)
- saves the data in Firestore
- all set into a cron job that runs every 24 hours

## Environment variables

These are the required env vars:
```
AGORA_SIGNER_MNE
AGORA_MAX_LIMIT_PROPOSALS
AGORA_URL
TALLY_API_KEY
TALLY_GRAPHQL_URL
TALLY_ORGANIZATION_ID
API_RETRY_DELAY
SNAPSHOT_GRAPHQL_URL
SNAPSHOT_DAO_ADDRESS
FIREBASE_API_KEY
FIREBASE_AUTH_DOMAIN
FIREBASE_PROJECT_ID
FIREBASE_STORAGE_BUCKET
FIREBASE_MESSAGING_SENDER_ID
FIREBASE_APP_ID
FIREBASE_CREDENTIALS_JSON
FIREBASE_DATABASE_URL
```

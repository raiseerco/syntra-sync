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
AGORA_SIGNER_MN
TALLY_API_KEY
FBASE_DATABASE_URL
FBASE_CREDENTIALS_JSON
```

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
Stored in Github secrets:

AGORA_SIGNER_MNE An erc20 wallet mnemonic used for signing into Agora service
TALLY_API_KEY Tally API key
FBASE_DATABASE_URL Firebase database url
FBASE_CREDENTIALS_JSON Firebase credentials json


Stored in Github env vars:

BOT_TOKEN Telegram bot token, acquired from BotFather (this could be in the upper section though)
CHAT_ID Telegram chat id, acquired from BotFather

```

This vars setup is specified in `sync.yml` file.

## Debugging

Just populate the env vars in `.env` file and run:

```bash
npm run dev
```

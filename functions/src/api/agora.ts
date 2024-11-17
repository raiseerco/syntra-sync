import { AGORA_MAX_LIMIT_PROPOSALS, AGORA_URL } from "../utils/constants";

import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

const MNE = process.env.AGORA_SIGNER_MNE;

const DAO_NAME = "optimism"; // TODO change this for future DAOs

async function getNonce() {
  try {
    const response = await fetch(`${AGORA_URL}/auth/nonce`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP status error: ${response.status}`);
    }

    const data = await response.text();
    return data;
  } catch (error: any) {
    throw new Error(`Http status error: ${error.message}`);
  }
}

async function authWithAgora() {
  try {
    if (!MNE) {
      throw new Error("No mnemonic found in the environment variables");
    }

    const nonce = await getNonce();
    const wallet = ethers.Wallet.fromPhrase(MNE);
    const statement = "Log in to Agora API with account ";
    const domain = "syntra.pro";
    const uri = "https://www.syntra.pro";
    const message = `${domain} wants you to sign in with your Ethereum account:\n${
      wallet.address
    }\n\n${statement}\n\nURI: ${uri}\nVersion: ${1}\nChain ID: ${1}\nNonce: ${nonce}\nIssued At: ${new Date().toISOString()}`;
    const signature = await wallet.signMessage(message);
    const body = JSON.stringify({
      message,
      signature,
      nonce,
    });

    const response = await fetch(`${AGORA_URL}/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if (!response.ok) {
      return { ok: false, error: response.statusText };
    }

    const data = await response.json();
    const token = data.access_token;
    return { ok: true, token };
  } catch (error) {
    return { ok: false, error };
  }
}

export async function fetchProposalsAgora() {
  try {
    // auth
    const resultAgora = await authWithAgora();
    if (!resultAgora.ok) {
      throw resultAgora;
    }
    const agoraToken = resultAgora.token;

    // fetch
    let offset = 0;
    let more = true;
    const allProposals = [];
    console.log(`AGORA: Start.`);
    do {
      const resAgora = await fetch(
        `${AGORA_URL}/proposals?limit=${AGORA_MAX_LIMIT_PROPOSALS}&offset=${offset}&filter=everything`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${agoraToken}`,
          },
        },
      );

      if (!resAgora.ok) {
        return { ok: false, status: resAgora.status };
      }

      const dataAgora = await resAgora.json();
      const clippedAgora = dataAgora.data.map((i: any) => ({
        id: i.id,
        dao: DAO_NAME,
        title: i.markdowntitle,
        body: i.description,
        createdTime: i.createdTime,
        scores: [],
        scores_state: "not set",
        scores_total: "",
        scores_updated: "",
        start: new Date(i.startTime).getTime() / 1000,
        end: new Date(i.endTime).getTime() / 1000,
        author: {
          address: i.proposer,
          picture: `https://cdn.stamp.fyi/avatar/eth:${i.proposer}`,
        },
        link: `https://vote.optimism.io/proposals/${i.id}`,
        space: "",
        status: i.status,
        state:
          new Date(i.endTime).getTime() < new Date().getTime()
            ? "closed"
            : "active",
        source: "agora",
      }));

      allProposals.push(...clippedAgora);

      offset += 50;
      console.log("AGORA: Fetched proposals up to cursor:", offset);
      more = dataAgora.meta.has_next;
    } while (more);

    console.log(`AGORA: Read ${allProposals.length} records.`);
    return { ok: true, data: allProposals };
  } catch (error) {
    console.error("AGORA: Error fetching proposals: ", error);
    return { ok: false, status: error };
  }
}

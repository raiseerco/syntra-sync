import { SNAPSHOT_GRAPHQL_URL } from "../utils/constants";
// import { API_RETRY_DELAY } from "../utils/constants";
import dotenv from "dotenv";

dotenv.config();

const DAO_NAME = "arbitrum"; // TODO change this for future DAOs

export async function fetchProposalsSnapshot(daoAddress: string) {
  // Snapshot does not support pagination, therefore all proposals
  // are fetched at once

  try {
    console.log(`SNAPSHOT: Start.`);
    const querySnapshot = `
    query Proposals($space: String!) {
      proposals(
        first: 1000, 
        skip: 0,
        where: {
          space_in: [$space]
        },
        orderBy: "created",
        orderDirection: desc
      ) {
          id
          title
          body
          choices
          scores
          scores_state
          scores_total
          scores_updated
          start
          end
          snapshot
          state
          author
          link
          space {
            id
            name
          }
      }
    }`;

    // let lastCursor = "";
    // const allProposals = [];

    const varSnapshot = {
      space: daoAddress,
    };

    const resSnapshot = await fetch(SNAPSHOT_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: querySnapshot, variables: varSnapshot }),
    });

    const dataSnapshot = await resSnapshot.json();

    const queryUserSnapshot = `
    query getUsers($ids: [String!]) {
      users(where: { id_in: $ids }) {
        id
        name
        twitter
        about
        avatar
      }
    }
  `;

    const varUserSnapshot = {
      ids: dataSnapshot.data.proposals.map((i: any) => i.author),
    };

    const resUserSnapshot = await fetch(SNAPSHOT_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: queryUserSnapshot,
        variables: varUserSnapshot,
      }),
    });

    const dataUserSnapshot = await resUserSnapshot.json();

    // find author in dataUserSnapshot by id
    const findAuthor = (id: string) => {
      const author = dataUserSnapshot.data.users.find((i: any) => i.id === id);
      return author;
    };

    const dataSnapshotClipped = dataSnapshot.data.proposals.map((i: any) => {
      const author = findAuthor(i.author);
      return {
        ...i,
        dao: DAO_NAME,
        source: "snapshot",
        choices: i.choices.map((choice: any, index: number) => ({
          type: choice,
          votesCount: i.scores[index],
          votersCount: i.scores_total,
          percent:
            i.scores_total === 0 ? 0 : (i.scores[index] / i.scores_total) * 100,
        })),
        author: {
          address: i.author,
          ens: author?.name,
          twitter: author?.twitter,
          name: author?.name,
          bio: author?.about,
          picture: `https://cdn.stamp.fyi/avatar/eth:${i.author}`,
        },
      };
    });

    console.log(`SNAPSHOT: Read ${dataSnapshotClipped.length} records.`);
    const d: any[] = dataSnapshotClipped;
    return { ok: true, data: d };
  } catch (error) {
    console.error("SNAPSHOT: Error fetching proposals: ", error);
    return { ok: false, status: error };
  }
}

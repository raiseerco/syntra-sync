import { delay, weiToEther } from "../utils/utils";

import dotenv from "dotenv";

dotenv.config();
const TALLY_GRAPHQL_URL = process.env.TALLY_GRAPHQL_URL as string;
const TALLY_API_KEY = process.env.TALLY_API_KEY as string;
const API_RETRY_DELAY = process.env.API_RETRY_DELAY as string;
const DAO_NAME = "arbitrum"; // TODO change this for future DAOs

export async function fetchProposalsTally(organizationId: string) {
  console.log(`TALLY: Start.`);

  try {
    const queryTally = `
    query Proposals($input: ProposalsInput!) {
      proposals(input: $input) {
        nodes {
          ... on Proposal {
            id
            onchainId
            block {
              id
              number
              timestamp
              ts
            }
            chainId
            creator {
              id
              address
              ens
              twitter
              name
              bio
              picture
              safes
              type
            }
            end {
              ... on Block {
                ts
                id
                timestamp
              }
              ... on BlocklessTimestamp {
                timestamp
              }
            }
            events {
              block {
                ts
                id
                timestamp
              }
              chainId
              createdAt
              type
              txHash
            }
            executableCalls {
              calldata
              chainId
              index
              signature
              target
              type
              value
            }
            governor {
              id
              chainId
              isIndexing
              isBehind
              isPrimary
              kind
              lastIndexedBlock {
                timestamp
                ts
              }
              name
              organization {
                id
                creator {
                  name
                  email
                  twitter
                  ens
                  address
                  isOFAC
                  safes
                }
                chainIds
                proposalsCount
                hasActiveProposals
                delegatesCount
                tokenOwnersCount
                metadata {
                  contact {
                    name
                    email
                    twitter
                    discord
                  }
                }
              }
              proposalStats {
                active
                total
                failed
                passed
              }
              quorum
              slug
              timelockId
              tokenId
              token {
                name
                id
                type
                symbol
              }
              type
              delegatesCount
              delegatesVotesCount
              tokenOwnersCount
              metadata {
                description
              }
            }
            metadata {
              title
              description
              eta
              ipfsHash
              previousEnd
              timelockId
              txHash
              discourseURL
              snapshotURL
            }
            organization {
              id
              slug
              name
              chainIds
              governorIds
              tokenIds
              metadata {
                socials {
                  website
                  telegram
                  twitter
                  discord
                }
                description
                contact {
                  name
                  email
                  discord
                  twitter
                }
                karmaName
                icon
                color
              }
              creator {
                address
                name
                email
              }
              hasActiveProposals
              proposalsCount
              delegatesCount
              delegatesVotesCount
              tokenOwnersCount
            }
            proposer {
              id
              address
              ens
              twitter
              name
              bio
              picture
              safes
              type
            }
            quorum
            status
            start {
              ... on Block {
                id
                ts
                number
                timestamp
              }
              ... on BlocklessTimestamp {
                timestamp
              }
            }
            voteStats {
              type
              votesCount
              votersCount
              percent
            }
          }
        }
        pageInfo {
          firstCursor
          lastCursor
          count
        }
      }
    }`;

    let lastCursor = "";
    const allProposals = [];

    do {
      const varTally = {
        input: {
          filters: {
            organizationId: organizationId || "",
          },
          page: {} as {
            afterCursor?: string;
          },
        },
      };

      if (lastCursor !== "") {
        varTally.input.page.afterCursor = lastCursor;
      }

      const resTally = await fetch(TALLY_GRAPHQL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-key": TALLY_API_KEY,
        },
        body: JSON.stringify({ query: queryTally, variables: varTally }),
      });

      if (!resTally.ok) {
        console.error("Error:", resTally.status, resTally.statusText);
        return { ok: false, status: resTally.status };
      }

      const { data } = await resTally.json();
      const { nodes, pageInfo } = data.proposals;
      allProposals.push(...nodes);

      lastCursor = pageInfo.lastCursor;
      console.log("TALLY: Fetched proposals up to cursor: ", lastCursor);
      await delay(API_RETRY_DELAY);
    } while (lastCursor !== "");

    const dataTallyClipped = allProposals.map((i: any) => ({
      id: i.id,
      dao: DAO_NAME,
      title: i.metadata.title,
      body: i.metadata.description,
      quorum: i.quorum,
      choices: i.voteStats.map((v: any) => ({
        ...v,
        votesCount: weiToEther(v.votesCount),
      })),
      start: new Date(i.start.timestamp).getTime() / 1000,
      end: new Date(i.end.timestamp).getTime() / 1000,
      author: {
        // FIXME proposer?
        address: i.creator.address,
        ens: i.creator.ens,
        twitter: i.creator.twitter,
        name: i.creator.name,
        bio: i.creator.bio,
        picture: i.creator.picture,
        // safes: i.creator.safes, // TBD
        // type: i.creator.type,
      },
      // HACK: rebuilds the url using its own metadata
      link: `https://www.tally.xyz/gov/${i.organization.slug}/proposal/${i.id}`,
      snapshot: i.block.number,
      state: i.status,
      space: "dummy",
      source: "tally",
    }));

    console.log(`TALLY: Read ${dataTallyClipped.length} records.`);
    const d: any[] = dataTallyClipped;
    return { ok: true, data: d };
  } catch (error) {
    console.error("TALLY: Error fetching proposals: ", error);
    return { ok: false, status: error };
  }
}

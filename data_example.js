// Data example for each provider

const agora = {
  id: "89934444025525534467725222948723300602129924689317116631018191521555230364343",
  dao: "optimism",
  title: "Test vote 2: Electric Boogaloo",
  body: "Test vote 2: Electric Boogaloo \\n\\n JK, let's use this one :)",
  createdTime: "2022-12-01T11:02:40.000Z",
  scores: [],
  scores_state: "not set",
  scores_total: "",
  scores_updated: "",
  start: 1669895847.5,
  end: 1669918861,
  author: {
    address: "0xe4553b743e74da3424ac51f8c1e586fd43ae226f",
    picture:
      "https://cdn.stamp.fyi/avatar/eth:0xe4553b743e74da3424ac51f8c1e586fd43ae226f",
  },
  link: "https://vote.optimism.io/proposals/89934444025525534467725222948723300602129924689317116631018191521555230364343",
  space: "",
  status: "DEFEATED",
  state: "closed",
  source: "agora",
};

const tally = {
  id: "2024935492524442929",
  dao: "arbitrum",
  title: "art dra",
  body: "# art dra\n### ## # ***[\n\n- ![](`\n\n> bi\n\n`)\n\n](url)***",
  quorum: "315311209982390942500000000",
  choices: [[Object], [Object], [Object], [Object], [Object], [Object]],
  start: 1679867543,
  end: 1681097951,
  author: {
    address: "0xF07210273DE1ad682650F8e283cBC98778B16652",
    ens: "",
    twitter: "",
    name: "",
    bio: "",
    picture: null,
  },
  link: "https://www.tally.xyz/gov/arbitrum/proposal/2024935492524442929",
  snapshot: 72951811,
  state: "defeated",
  space: "dummy",
  source: "tally",
};

const snapshot = {
  id: "0xf7a22aac925d24841f102c310be08944a31489fb1f2040033a46b48dfff81435",
  dao: "arbitrum",
  title: "Connext - LTIPP [Post Council Feedback]",
  body:
    "Following the initial feedback of LTIPP Council, Connext would like to re-submit its LTIPP application.\n" +
    "The Connext team agrees to return to the Arbitrum DAO any unused ARB funds once the 12-week LTIPP program is concluded.",
  choices: [[Object], [Object], [Object]],
  scores: [125976309.07751586, 1473829.69592462, 18758420.212230414],
  scores_state: "final",
  scores_total: 146208558.9857025,
  scores_updated: 1714561658,
  start: 1713954690,
  end: 1714559490,
  snapshot: 204308407,
  state: "closed",
  author: {
    address: "0xd333Bc5c9670C9cEb18f9A2CF02C6E86807a8227",
    ens: "Max Lomu",
    twitter: null,
    name: "Max Lomu",
    bio: "Optimistic Builder",
    picture:
      "https://cdn.stamp.fyi/avatar/eth:0xd333Bc5c9670C9cEb18f9A2CF02C6E86807a8227",
  },
  link: "https://snapshot.org/#/arbitrumfoundation.eth/proposal/0xf7a22aac925d24841f102c310be08944a31489fb1f2040033a46b48dfff81435",
  space: { id: "arbitrumfoundation.eth", name: "Arbitrum DAO" },
  source: "snapshot",
};

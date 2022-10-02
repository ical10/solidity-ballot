import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];
const selectedVoter = "0xd6e9b48D59D780F28a6BEEbe8098f3b095c003d7";

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function main() {
  const provider = ethers.providers.getDefaultProvider("goerli");

  const lastBlock = await provider.getBlock("latest");
  console.log({ lastBlock });
  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  PROPOSALS.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });

  const [signer] = await ethers.getSigners();
  const balanceBN = await signer.getBalance();
  const balance = Number(ethers.utils.formatEther(balanceBN));
  console.log(`Wallet balance ${balance}`);
  if (balance < 0.01) throw new Error("Not enough Ether");

  const ballotFactory = new Ballot__factory(signer);
  //NOTE: important to convert from string array to bytes32 to pack data and cost less gas
  const ballotContract = await ballotFactory.deploy(
    convertStringArrayToBytes32(PROPOSALS)
  );
  await ballotContract.deployed();

  for (let index = 0; index < PROPOSALS.length; index++) {
    const proposal = await ballotContract.proposals(index);
    const name = ethers.utils.parseBytes32String(proposal.name);
    console.log({ index, name, proposal });
  }

  const chairperson = await ballotContract.chairperson();
  console.log({ chairperson });

  let voterForAddress1 = await ballotContract.voters(selectedVoter);
  console.log({ voterForAddress1 });

  console.log("Giving right to vote to address1");
  const giveRightToVoteTx = await ballotContract.giveRightToVote(selectedVoter);
  const giveRightToVoteTxReceipt = await giveRightToVoteTx.wait();
  console.log(giveRightToVoteTxReceipt);

  voterForAddress1 = await ballotContract.voters(selectedVoter);
  console.log({ voterForAddress1 });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

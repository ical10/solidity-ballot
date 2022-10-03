import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

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

  const [deployer, account1] = await ethers.getSigners();
  const balanceBN = await deployer.getBalance();
  const balance = Number(ethers.utils.formatEther(balanceBN));
  console.log(`Wallet balance ${balance}`);
  if (balance < 0.01) throw new Error("Not enough Ether");

  const ballotFactory = new Ballot__factory(deployer);
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

  let voterForAddress1 = await ballotContract.voters(account1.address);
  console.log({ voterForAddress1 });

  console.log("Giving right to vote to address1");
  const giveRightToVoteTx = await ballotContract.giveRightToVote(
    account1.address
  );
  const giveRightToVoteTxReceipt = await giveRightToVoteTx.wait();
  console.log(giveRightToVoteTxReceipt);

  //Check if giving right to vote succeed
  voterForAddress1 = await ballotContract.voters(account1.address);
  console.log({ voterForAddress1 });

  //Delegating vote
  const delegateVoteTx = await ballotContract.delegate(account1.address);
  const delegateVoteTxReceipt = await delegateVoteTx.wait();
  console.log(delegateVoteTxReceipt);

  //Check if delegation succeed
  voterForAddress1 = await ballotContract.voters(deployer.address);
  console.log({ voterForAddress1 });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

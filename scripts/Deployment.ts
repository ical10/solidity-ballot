import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function main() {
  let ballotContract: Ballot;
  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  PROPOSALS.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  const ballotFactory = await ethers.getContractFactory("Ballot");
  //NOTE: important to convert from string array to bytes32 to pack data and cost less gas
  ballotContract = await ballotFactory.deploy(
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
  const accounts = await ethers.getSigners();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

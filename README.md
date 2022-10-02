# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

# Hardhat Config Setup

Install dotenv

```shell
yarn add dotenv
```

Create `.env` file. The template is in `.env-template`
NOTE: DO NOT MODIFY `hardhat.config.ts`

Deploy to goerli network using `Deployment.ts` script:

```shell
yarn hardhat --network goerli run scripts/Deployment.ts
```

Sample contract: `https://goerli.etherscan.io/address/0x7bcb7a284aa1f41e4020782d10cec21aae1cd117`

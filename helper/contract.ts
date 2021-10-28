import { Contract } from "ethers";

import { SimpleNFT } from "../types/SimpleNFT";

const hre = require("hardhat");

export const deployContract = async <ContractType extends Contract>(
  contractName: string,
  args: any[],
  libraries?: {}
) => {
  const signers = await hre.ethers.getSigners();
  const contract = (await (
    await hre.ethers.getContractFactory(contractName, signers[0], {
      libraries: {
        ...libraries,
      },
    })
  ).deploy(...args)) as ContractType;

  return contract;
};

export const deploySimpleNFT = async () => {
  return await deployContract<SimpleNFT>("SimpleNFT", []);
};

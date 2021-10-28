import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { chainIdToNetwork } from '../helper/data';

const waitSeconds = (sec: number) => new Promise(resolve => setTimeout(resolve, sec * 1000));

const deploy = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, getChainId, ethers } = hre;
  const { deployer } = await getNamedAccounts();
  const chainId = parseInt(await getChainId());
  const network = chainIdToNetwork[chainId];

  if (!network) return;

  // Deploy SimpleNFT
  const simpleNFT = await deployments.deploy(
    'SimpleNFT',
    {
      from: deployer,
      args: [],
      log: true,
    }
  );

  // Verify
  await waitSeconds(60);
  await hre.run('verify:verify', {
    address: simpleNFT.address,
  })
};

deploy.tags = ['SimpleNFT'];
export default deploy;

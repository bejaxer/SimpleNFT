import { expect } from 'chai';
import { Contract, Signer } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from 'hardhat';

import {
  deploySimpleNFT,
} from '../helper/contract';
import { SimpleNFT } from '../types';

describe('SimpleNFT test', async () => {
  let chainId: number;
  let signers: SignerWithAddress[];
  let owner: SignerWithAddress;
  let user0: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let simpleNFT: SimpleNFT;
  let token1URI = "ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/1";
  let token2URI = "ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/2";
  let token3URI = "ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/3";
  let token4URI = "ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/4";
  let zeroAddress = "0x0000000000000000000000000000000000000000";

  // Contract Setup
  before(async () => {
    signers = await ethers.getSigners();
    owner = signers[0];
    user0 = signers[1];
    user1 = signers[2];
    user2 = signers[3];
    chainId = (await ethers.provider.getNetwork()).chainId;

    // SimpleNFT
    simpleNFT = await deploySimpleNFT();
  });

  describe('SimpleNFT Info', async () => {
    it('SimpleNFT name', async () => {
      expect(await simpleNFT.name()).to.equal(
        "SimpleNFT"
      );
    });

    it('SimpleNFT symbol', async () => {
      expect(await simpleNFT.symbol()).to.equal(
        "NFT"
      );
    });
  });

  describe('SimpleNFT mint', async () => {
    it('Mint token1 to user0', async () => {
      await simpleNFT.mintNFT(user0.address, token1URI)

      expect(await simpleNFT.balanceOf(user0.address)).to.equal(1);
      expect(await simpleNFT.ownerOf(1)).to.equal(user0.address);
    })

    it('Mint token2 to user1', async () => {
      await simpleNFT.mintNFT(user1.address, token2URI)

      expect(await simpleNFT.balanceOf(user1.address)).to.equal(1);
      expect(await simpleNFT.ownerOf(2)).to.equal(user1.address);
    })

    it('Mint token3 to user2', async () => {
      await simpleNFT.mintNFT(user2.address, token3URI)

      expect(await simpleNFT.balanceOf(user2.address)).to.equal(1);
      expect(await simpleNFT.ownerOf(3)).to.equal(user2.address);
    })

    it('Mint token4 to user0', async () => {
      await simpleNFT.mintNFT(user0.address, token4URI)

      expect(await simpleNFT.balanceOf(user0.address)).to.equal(2);
      expect(await simpleNFT.ownerOf(4)).to.equal(user0.address);
    })
  })

  describe('SImpleNFT transfer', async () => {
    it('Transfer to zero address', async () => {
      await expect(simpleNFT.connect(user0).transferFrom(user0.address, zeroAddress, 1)).to.be.revertedWith('ERC721: transfer to the zero address')
    })

    it('Transfer token that is not own', async () => {
      await expect(simpleNFT.connect(user0).transferFrom(user0.address, user1.address, 2)).to.be.revertedWith('ERC721: transfer caller is not owner nor approved')
    })

    it('Transfer token that is not approved', async () => {
      await expect(simpleNFT.connect(user0).transferFrom(user1.address, user2.address, 2)).to.be.revertedWith('ERC721: transfer caller is not owner nor approved')
    })

    it('Transfer token1 from user0 to user1', async () => {
      await simpleNFT.connect(user0).transferFrom(user0.address, user1.address, 1)

      expect(await simpleNFT.balanceOf(user0.address)).to.equal(1);
      expect(await simpleNFT.balanceOf(user1.address)).to.equal(2);
      expect(await simpleNFT.ownerOf(1)).to.equal(user1.address);
    })

    it('Transfer token3 from user2 to user1 by user0', async () => {
      await simpleNFT.connect(user2).approve(user0.address, 3);
      await simpleNFT.connect(user0).transferFrom(user2.address, user1.address, 3)

      expect(await simpleNFT.balanceOf(user2.address)).to.equal(0);
      expect(await simpleNFT.balanceOf(user1.address)).to.equal(3);
      expect(await simpleNFT.ownerOf(3)).to.equal(user1.address);
    })
  })
});

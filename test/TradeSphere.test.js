const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TradeSphere DEX", function () {
  let TradeSphereFactory;
  let TradeSphereRouter;
  let factory;
  let router;
  let owner;
  let addr1;
  
  // Mock ERC20 tokens
  let TokenA;
  let TokenB;
  let tokenA;
  let tokenB;

  beforeEach(async function () {
    // Get signers
    [owner, addr1] = await ethers.getSigners();
    
    // Deploy Mock ERC20 tokens (simplified - no WETH needed for basic tests)
    const TokenFactory = await ethers.getContractFactory("ERC20Mock");
    tokenA = await TokenFactory.deploy("Token A", "TKNA", owner.address, ethers.utils.parseEther("1000000"));
    tokenB = await TokenFactory.deploy("Token B", "TKNB", owner.address, ethers.utils.parseEther("1000000"));
    await tokenA.deployed();
    await tokenB.deployed();
    
    // Deploy TradeSphereFactory
    TradeSphereFactory = await ethers.getContractFactory("TradeSphereFactory");
    factory = await TradeSphereFactory.deploy(owner.address);
    await factory.deployed();
    
    // For router tests, we'll use a mock WETH address
    const WETH_ADDRESS = "0x0000000000000000000000000000000000000000"; // Mock address for testing
    
    // Deploy TradeSphereRouter
    TradeSphereRouter = await ethers.getContractFactory("TradeSphereRouter");
    router = await TradeSphereRouter.deploy(factory.address, WETH_ADDRESS);
    await router.deployed();
  });

  describe("Factory", function () {
    it("Should set correct feeToSetter", async function () {
      expect(await factory.feeToSetter()).to.equal(owner.address);
    });

    it("Should create a pair", async function () {
      await expect(factory.createPair(tokenA.address, tokenB.address))
        .to.emit(factory, "PairCreated");
      
      const pairAddress = await factory.getPair(tokenA.address, tokenB.address);
      expect(pairAddress).to.not.equal(ethers.constants.AddressZero);
    });

    it("Should not create pair with identical addresses", async function () {
      await expect(factory.createPair(tokenA.address, tokenA.address))
        .to.be.revertedWith("TradeSphere: IDENTICAL_ADDRESSES");
    });
  });

  describe("Router", function () {
    it("Should set correct factory address", async function () {
      expect(await router.factory()).to.equal(factory.address);
    });
  });
});
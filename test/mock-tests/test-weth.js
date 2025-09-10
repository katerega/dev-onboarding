async function main() {
  console.log("Testing WETH deployment...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  const WETH_ADDRESS = '0x778e5A0026BFB3283615861DF768072124FCd2f9';
  
  try {
    // Try to interact with WETH
    const code = await ethers.provider.getCode(WETH_ADDRESS);
    console.log("WETH contract code length:", code.length);
    
    if (code === '0x') {
      console.log("❌ WETH contract not deployed at this address");
      
      // Deploy a simple WETH contract
      console.log("Deploying new WETH...");
      const WETH = await ethers.getContractFactory("contracts/mocks/WETH.sol:WETH");
      const weth = await WETH.deploy();
      await weth.deployed();
      console.log("✅ WETH deployed at:", weth.address);
      
      return;
    }
    
    const weth = await ethers.getContractAt("IWETH", WETH_ADDRESS);
    console.log("✅ WETH contract exists");
    
    // Test deposit
    console.log("Testing WETH deposit...");
    const depositTx = await weth.deposit({ value: ethers.utils.parseEther("0.1") });
    await depositTx.wait();
    console.log("✅ WETH deposit successful");
    
  } catch (error) {
    console.log("❌ WETH test failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

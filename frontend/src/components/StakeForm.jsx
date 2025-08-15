import { useState } from "react";
import { ethers } from "ethers";
import stakingAbi from "../abi/StakingRegistry.json";

export default function StakeForm({ stakingAddress }) {
  const [amount, setAmount] = useState("100000");

  async function handleStake() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const stakingContract = new ethers.Contract(stakingAddress, stakingAbi, signer);
    const tokenAddress = await stakingContract.token();

    const tokenContract = new ethers.Contract(tokenAddress, ["function approve(address,uint256)"], signer);
    await tokenContract.approve(stakingAddress, ethers.parseUnits(amount, 18));
    await stakingContract.stake(ethers.parseUnits(amount, 18));

    alert("Stake successful!");
  }

  return (
    <div>
      <h2>Stake Tokens to Deploy</h2>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={handleStake}>Stake</button>
    </div>
  );
}

import { ethers } from "ethers";
import gateAbi from "../abi/KitDeploymentGate.json";

export default function DeployButton({ gateAddress, kitType, chain }) {
  async function handleDeploy() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const gateContract = new ethers.Contract(gateAddress, gateAbi, signer);
    await gateContract.deployKit(kitType, chain);
    alert("Kit deployed!");
  }

  return <button onClick={handleDeploy}>Deploy {kitType} to {chain}</button>;
}

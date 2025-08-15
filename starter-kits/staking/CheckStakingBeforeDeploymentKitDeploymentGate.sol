// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IStakingRegistry {
    function hasStake(address user) external view returns (bool);
}

contract KitDeploymentGate {
    address public stakingRegistry;

    event KitDeployed(address indexed developer, string kitType, string chain);

    constructor(address registryAddress) {
        stakingRegistry = registryAddress;
    }

    function deployKit(string memory kitType, string memory chain) external {
        require(IStakingRegistry(stakingRegistry).hasStake(msg.sender), "Stake required before deployment");

        // You can add logic here to trigger the kit's deployment process.
        emit KitDeployed(msg.sender, kitType, chain);
    }
}

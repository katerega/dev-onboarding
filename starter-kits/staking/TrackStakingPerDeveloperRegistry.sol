// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StakingRegistry {
    IERC20 public token;
    uint256 public constant REQUIRED_STAKE = 100_000 * 1e18; // 100k tokens

    mapping(address => uint256) public stakes;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
    }

    function stake(uint256 amount) external {
        require(amount >= REQUIRED_STAKE, "Minimum stake required");
        token.transferFrom(msg.sender, address(this), amount);
        stakes[msg.sender] += amount;
        emit Staked(msg.sender, amount);
    }

    function hasStake(address user) external view returns (bool) {
        return stakes[user] >= REQUIRED_STAKE;
    }

    function unstake() external {
        uint256 amount = stakes[msg.sender];
        require(amount > 0, "No stake found");
        stakes[msg.sender] = 0;
        token.transfer(msg.sender, amount);
        emit Unstaked(msg.sender, amount);
    }
}

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

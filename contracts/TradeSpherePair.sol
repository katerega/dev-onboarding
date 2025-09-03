// SPDX-License-Identifier: MIT
pragma solidity =0.6.6;

contract TradeSpherePair {
    address public factory;
    address public token0;
    address public token1;
    
    uint112 private reserve0;
    uint112 private reserve1;
    uint32 private blockTimestampLast;
    
    event Mint(address indexed sender, uint amount0, uint amount1);
    event Burn(address indexed sender, uint amount0, uint amount1, address indexed to);
    
    constructor() public {
        factory = msg.sender;
    }
    
    function initialize(address _token0, address _token1) external {
        require(msg.sender == factory, 'TradeSphere: FORBIDDEN');
        token0 = _token0;
        token1 = _token1;
    }
    
    function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
        _blockTimestampLast = blockTimestampLast;
    }
    
    // Safe math functions
    function safeAdd(uint a, uint b) internal pure returns (uint) {
        uint c = a + b;
        require(c >= a, "SafeMath: addition overflow");
        return c;
    }
    
    function safeSub(uint a, uint b) internal pure returns (uint) {
        require(b <= a, "SafeMath: subtraction overflow");
        return a - b;
    }
    
    function safeMul(uint a, uint b) internal pure returns (uint) {
        if (a == 0) return 0;
        uint c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");
        return c;
    }
}
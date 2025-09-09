// SPDX-License-Identifier: MIT
pragma solidity 0.6.6;

import '../libraries/SafeMath.sol';

contract WETH {
    using SafeMath for uint;
    
    string public name = "Wrapped Ether";
    string public symbol = "WETH";
    uint8 public decimals = 18;
    
    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;
    
    uint public totalSupply;
    
    event Approval(address indexed src, address indexed guy, uint wad);
    event Transfer(address indexed src, address indexed dst, uint wad);
    event Deposit(address indexed dst, uint wad);
    event Withdrawal(address indexed src, uint wad);
    
    receive() external payable {
        deposit();
    }
    
    function deposit() public payable {
        balanceOf[msg.sender] = balanceOf[msg.sender].add(msg.value);
        totalSupply = totalSupply.add(msg.value);
        emit Deposit(msg.sender, msg.value);
        emit Transfer(address(0), msg.sender, msg.value);
    }
    
    function withdraw(uint wad) public {
        require(balanceOf[msg.sender] >= wad, "WETH: Insufficient balance");
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(wad);
        totalSupply = totalSupply.sub(wad);
        msg.sender.transfer(wad);
        emit Withdrawal(msg.sender, wad);
        emit Transfer(msg.sender, address(0), wad);
    }
    
    function approve(address guy, uint wad) public returns (bool) {
        allowance[msg.sender][guy] = wad;
        emit Approval(msg.sender, guy, wad);
        return true;
    }
    
    function transfer(address dst, uint wad) public returns (bool) {
        return transferFrom(msg.sender, dst, wad);
    }
    
    function transferFrom(address src, address dst, uint wad) public returns (bool) {
        require(balanceOf[src] >= wad, "WETH: Insufficient balance");
        
        if (src != msg.sender && allowance[src][msg.sender] != uint(-1)) {
            require(allowance[src][msg.sender] >= wad, "WETH: Insufficient allowance");
            allowance[src][msg.sender] = allowance[src][msg.sender].sub(wad);
        }
        
        balanceOf[src] = balanceOf[src].sub(wad);
        balanceOf[dst] = balanceOf[dst].add(wad);
        
        emit Transfer(src, dst, wad);
        
        return true;
    }
}

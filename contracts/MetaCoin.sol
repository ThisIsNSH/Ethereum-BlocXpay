pragma solidity ^0.4.2;

import "./ConvertLib.sol";

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract MetaCoin {

	mapping (address => uint) balances;
	mapping (address => string) messages;

	event Transfer(address indexed _from, address indexed _to, uint256 _value, string _messageR, string _messageS);

	function MetaCoin() {
		balances[tx.origin] = 10000;
		messages[tx.origin] = "none";
	}

	function sendCoin(address receiver, uint amount, string messageR, string messageS) returns(bool sufficient) {
		if (balances[msg.sender] < amount) return false;
		balances[msg.sender] -= amount;
		balances[receiver] += amount;
		messages[receiver] = messageR;
		messages[msg.sender] = messageS;
		Transfer(msg.sender, receiver, amount, messageR, messageS);
		return true;
	}

	function getBalanceInEth(address addr) returns(uint){
		return ConvertLib.convert(getBalance(addr),2);
	}

	function getBalance(address addr) returns(uint) {
		return balances[addr];
	}

	function getMessage(address addr) returns(string) {
		return messages[addr];
	}
}

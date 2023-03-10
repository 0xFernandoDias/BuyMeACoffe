// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Deployed to Goerli at 0x5848D0ff33Bd360A966379877b0Ee0490Dbce2c7

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract BuyMeACoffee {
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    struct Memo{
        address from;
        uint timestamp;
        string name;
        string message;
    }

    Memo[] memos;

    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    /** 
    * @param _name name of the coffee buyer
    * @param _message message of the coffee buyer
    */
    function buyACoffee(string memory _name, string memory _message) public payable {
        require(msg.value >= 0.01 ether, "You need to pay at least 0.01 ETH");

        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    function getMemos() public view returns(Memo[] memory) {
        return memos;
    }

    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }
    
}

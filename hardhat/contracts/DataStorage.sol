// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DataStorage {
    string public lastData;
    uint256 public lastTimestamp;
    address public owner;

    event DataUpdated(string data, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function updateData(string memory _data) public onlyOwner {
        lastData = _data;
        lastTimestamp = block.timestamp;
        emit DataUpdated(_data, block.timestamp);
    }

    function getData() public view returns (string memory, uint256) {
        return (lastData, lastTimestamp);
    }
} 
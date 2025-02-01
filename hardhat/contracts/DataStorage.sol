// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DataStorage {
    struct ValidatorInfo {
        uint256 balance;
        uint256 rewards;
        uint256 lastTimestamp;
    }

    // Mapping from validator ID to their info (using bytes32 instead of string)
    mapping(bytes32 => ValidatorInfo) public validatorBalances;
    // Array to keep track of all validator IDs
    bytes32[] public validatorIds;
    address public owner;

    event ValidatorUpdated(
        bytes32 indexed validatorId, 
        uint256 balance, 
        uint256 rewards, 
        uint256 timestamp
    );
    event ValidatorAdded(bytes32 indexed validatorId);
    event ValidatorRemoved(bytes32 indexed validatorId);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function updateValidator(
        bytes32 _validatorId, 
        uint256 _balance,
        uint256 _rewards
    ) public onlyOwner {
        validatorBalances[_validatorId] = ValidatorInfo({
            balance: _balance,
            rewards: _rewards,
            lastTimestamp: block.timestamp
        });

        // Add validator ID to array if it doesn't exist
        bool exists = false;
        for (uint i = 0; i < validatorIds.length; i++) {
            if (validatorIds[i] == _validatorId) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            validatorIds.push(_validatorId);
            emit ValidatorAdded(_validatorId);
        }

        emit ValidatorUpdated(_validatorId, _balance, _rewards, block.timestamp);
    }

    function removeValidator(bytes32 _validatorId) public onlyOwner {
        delete validatorBalances[_validatorId];
        
        // Remove from validatorIds array
        for (uint i = 0; i < validatorIds.length; i++) {
            if (validatorIds[i] == _validatorId) {
                validatorIds[i] = validatorIds[validatorIds.length - 1];
                validatorIds.pop();
                emit ValidatorRemoved(_validatorId);
                break;
            }
        }
    }

    function getAllValidators() public view returns (bytes32[] memory) {
        return validatorIds;
    }

    function getValidatorInfo(bytes32 _validatorId) public view returns (ValidatorInfo memory) {
        return validatorBalances[_validatorId];
    }

    function getAllValidatorsInfo() public view returns (
        bytes32[] memory ids,
        uint256[] memory balances,
        uint256[] memory rewards,
        uint256[] memory timestamps
    ) {
        uint256 length = validatorIds.length;
        balances = new uint256[](length);
        rewards = new uint256[](length);
        timestamps = new uint256[](length);
        
        for (uint i = 0; i < length; i++) {
            ValidatorInfo memory info = validatorBalances[validatorIds[i]];
            balances[i] = info.balance;
            rewards[i] = info.rewards;
            timestamps[i] = info.lastTimestamp;
        }
        
        return (validatorIds, balances, rewards, timestamps);
    }
} 
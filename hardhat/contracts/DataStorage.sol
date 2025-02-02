// SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

    contract DataStorage {
        struct ValidatorInfo {
            uint256 balance;
            uint256 rewards;
            uint256 lastTimestamp;
        }

        struct PriceInfo {
            uint256 price;  // ETH price in USD (with 8 decimals)
            uint256 lastTimestamp;
        }

        // Mapping from validator ID to their info (using string instead of bytes32)
        mapping(string => ValidatorInfo) public validatorBalances;
        // Array to keep track of all validator IDs
        string[] public validatorIds;
        // ETH price data
        PriceInfo public ethPrice;
        
        address public owner;

        event ValidatorUpdated(
            string indexed validatorId, 
            uint256 balance, 
            uint256 rewards, 
            uint256 timestamp
        );
        event ValidatorAdded(string validatorId);
        event ValidatorRemoved(string validatorId);
        event PriceUpdated(uint256 price, uint256 timestamp);

        constructor() {
            owner = msg.sender;
        }

        modifier onlyOwner() {
            require(msg.sender == owner, "Not owner");
            _;
        }

        function updateValidator(
            string memory _validatorId, 
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
                if (keccak256(bytes(validatorIds[i])) == keccak256(bytes(_validatorId))) {
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

        function updatePrice(uint256 _price) public onlyOwner {
            ethPrice = PriceInfo({
                price: _price,
                lastTimestamp: block.timestamp
            });
            emit PriceUpdated(_price, block.timestamp);
        }

        function removeValidator(string memory _validatorId) public onlyOwner {
            delete validatorBalances[_validatorId];
            
            // Remove from validatorIds array
            for (uint i = 0; i < validatorIds.length; i++) {
                if (keccak256(bytes(validatorIds[i])) == keccak256(bytes(_validatorId))) {
                    validatorIds[i] = validatorIds[validatorIds.length - 1];
                    validatorIds.pop();
                    emit ValidatorRemoved(_validatorId);
                    break;
                }
            }
        }

        function getAllValidators() public view returns (string[] memory) {
            return validatorIds;
        }

        function getValidatorInfo(string memory _validatorId) public view returns (ValidatorInfo memory) {
            return validatorBalances[_validatorId];
        }

        function getAllValidatorsInfo() public view returns (
            string[] memory ids,
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
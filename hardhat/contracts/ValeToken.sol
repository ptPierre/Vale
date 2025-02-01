// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ValeToken is ERC721, Ownable {
    // Available public keys definition
    uint256[] public availablePublicKeys = [
        0x91104f28e17de8c6bec26c5a8e64a149ba3ed2a35273197c33ed2f2bc74b8dbd, //21958
        0x820b2cf260a032e87555692de4732ae05f92b37f9a9153e684c43e31aea4b974, //66456
        0x85ba506bab27f6f32063a5c1b8392390c65f2ef5a6ca11ed29d3edae4788aec3, //17970
        0xaed72df183c23c2820774bf4729402130bcce5d83e861a9eb2cf6b7e12eca818, //89290
        0x9217e329dbf1ec6f2ef3f048c92e2035d7dea61ad0a6ed2a82db40769635d5e0 //17021
    ];
    
    uint256 private currentKeyIndex;
    uint256 private _nextTokenId;

    // Mapping to associate tokenId with its public key
    mapping(uint256 => uint256) private tokenToPublicKey;

    constructor() ERC721("ValeToken", "VALE") Ownable(msg.sender) {
        // Mint all NFTs at deployment
        for(uint256 i = 0; i < availablePublicKeys.length; i++) {
            mint(msg.sender);
        }
    }

    function mint(address to) public onlyOwner {
        require(currentKeyIndex < availablePublicKeys.length, "All public keys have been assigned");
        
        uint256 tokenId = _nextTokenId++;
        uint256 publicKey = availablePublicKeys[currentKeyIndex];
        

        _safeMint(to, tokenId);
        tokenToPublicKey[tokenId] = publicKey;
        currentKeyIndex++;
    }

    function getPublicKey(uint256 tokenId) public view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return tokenToPublicKey[tokenId];
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ValeToken is ERC721, Ownable {
    // Available public keys definition
    string[] public availablePublicKeys = [
    "0x91104f28e17de8c6bec26c5a8e64a149ba3ed2a35273197c33ed2f2bc74b8dbda96f9098517a6e946247c169c89deb34", //21958
    "0x820b2cf260a032e87555692de4732ae05f92b37f9a9153e684c43e31aea4b974245a33fecf9e137408c8ede88fe54f1e", //66458
    "0x85ba506bab27f6f32063a5c1b8392390c65f2ef5a6ca11ed29d3edae4788aec30c8e5af99412e47c66cbd10a6a34f92f", //17970
    "0xaed72df183c23c2820774bf4729402130bcce5d83e861a9eb2cf6b7e12eca818df39088c35a109437a6f4fa06649fb37", //89290
    "0x9217e329dbf1ec6f2ef3f048c92e2035d7dea61ad0a6ed2a82db40769635d5e024a8fd1ef38892a77bbc56f99decc34a" //170221
    ];
    
    uint256 private currentKeyIndex;
    uint256 private _nextTokenId;

    // Mapping to associate tokenId with its public key
    mapping(uint256 => string) private tokenToPublicKey;

    constructor() ERC721("ValeToken", "VALE") Ownable(msg.sender) {
        // Mint all NFTs at deployment
        for(uint256 i = 0; i < availablePublicKeys.length; i++) {
            mint(msg.sender);
        }
    }

    function mint(address to) public onlyOwner {
        require(currentKeyIndex < availablePublicKeys.length, "All public keys have been assigned");
        
        uint256 tokenId = _nextTokenId++;
        string memory publicKey = availablePublicKeys[currentKeyIndex];
        
        _safeMint(to, tokenId);
        tokenToPublicKey[tokenId] = publicKey;
        currentKeyIndex++;
    }

    function getPublicKey(uint256 tokenId) public view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return tokenToPublicKey[tokenId];
    }
}

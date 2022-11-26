//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Whitelist {
    //max number of whitelisted addresses allowed
    uint public maxWhitelistedAddresses;

    //Create a mapping of whitelistedAddresses
    //it is false by default
    mapping(address => bool) public whitelistedAddresses;
    
    //it would be used to keep track of how many addresses have been whitelisted
    uint public numAddressesWhitelisted;

    //setting the Max number of whitelisted addresses
    constructor(uint8 _maxWhitelistedAddresses) {
        maxWhitelistedAddresses = _maxWhitelistedAddresses;
    }

    function addAddressToWhitelist() public {
        require(!whitelistedAddresses[msg.sender],"Sender has already been whitelisted");
        require(numAddressesWhitelisted < maxWhitelistedAddresses, "More addresses cant be added, limit reached");
        whitelistedAddresses[msg.sender] = true;
        numAddressesWhitelisted += 1;
    }
}


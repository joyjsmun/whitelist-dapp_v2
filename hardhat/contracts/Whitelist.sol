//SPDX-License-Identifier:Unlicense
pragma solidity ^0.8.0;

contract Whitelist {
    uint8 public maxWhiteListedAddresses;

    //if an address is whitelisted,it would set it to true, it is false by default for all other address.
    mapping(address => bool) public whiteListedAddresses;

    uint8 public numAddressesWhitelisted;

    //setting the max number of whiltelisted addresses
    //user will put the value at the time of deployment
    constructor(uint8 _maxWhitelistedAddresses){
        maxWhiteListedAddresses = _maxWhitelistedAddresses;
    }

    //this func adds the address of the sender to the whitelist
    function addAddressToWhitelist() public{
        //check if the user has already been whitelisted
        require(!whiteListedAddresses[msg.sender],"Sender has already been whitelisted");

        //check if the number of whitelisted address < max number off whitelisted address, if not then throw an error.
        require(numAddressesWhitelisted < maxWhiteListedAddresses,"More addresses cant be added,limit readched");

        //Add the address which called the function to the whitelistedAddress array
        whiteListedAddresses[msg.sender] = true;
        numAddressesWhitelisted += 1;

    }
}
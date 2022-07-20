const {ethers} = require("hardhat");
const { Contract } = require("hardhat/internal/hardhat-network/stack-traces/model");

async function main(){

  /*A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so whitelistContract here is a factory for instances of our Whitelist Contract. */
  const WhitelistContact = await ethers.getContractFactory("Whitelist");

  //deploy contract here "deploy()"
  //10 is the max number of whitelisted addresses allowed
  const deployedWhitelistContract = await WhitelistContact.deploy(10);

  //wait for it to finish deploying "deployed()"
  await deployedWhitelistContract.deployed()
  
  console.log("Whitelist Contract Address:",deployedWhitelistContract.address);
}

//call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  })
import Head from 'next/head'
import Web3Modal from "web3modal"
import { useEffect, useRef, useState } from 'react'
import { Contract, providers } from "ethers"
import { abi, WHITELIST_CONTRACT_ADDRESS } from '../constants';




export default function Home() {
  //check the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  
  const [numOfWhitelisted,setNumOfWhitelisted] = useState(0);
//check the current metamask address has joined the whitelist or not
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
    //waiting for a transaction to get mined
  const [loading,setLoading] = useState(false);
  //Create a reference to the Web3Modal(used for connecting to Metamask)
  const web3ModalRef = useRef();


/*
Returns a Provider or Signer object representing the Ethereum RPC with or without the signing the capabilities of metamask attached

Provider is need to interact with the blockchain - reading transaction, reading balances, reading state, etc

Signer is a special type of Provider used in case a 'write' transacting needs to be made to the blockchain, which involves the connected account
needing to make a digital signature to authorize the transaction being sent. => Metamask exposes a Signer API to allow your website to request a 
signature from the user using Signer function 

needSigner - True if you need the signer, default false otherwise
*/

  const getProviderOrSigner = async(needSigner = false) => {
    try {
      //connect to Metamask
      //Since we store 'web3Modal' as a reference, we need to access the 'current' value to get access to the underlying object
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);


      //if user is not connected to the Rinkeby network, let them know and throw an error
      const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 4) {
      window.alert("Change the network to Rinkeby");
      throw new Error("Change network to Rinkeby");
    }
  
      if (needSigner) {
        const signer = web3Provider.getSigner();
        return signer;
      }
      return web3Provider;


    } catch (error) {
      console.log(error)
    }
  }

  const addAddressToWhitelist = async () => {
    try {
      //need a Signer here since this is a 'write' transaction
      const signer = await getProviderOrSigner(true);

      //create a new instance of the Contract with Signer, which allows update methods
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );

      //call the function-addAddressToWhitelist() from the contract
      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);
      //wait for the transaction to get mined
      await tx.wait();
      setLoading(false);
      //get the updated number of addresses in the whitelist
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch (error) {
      console.log(error)
    }
  }

  const checkIfAddressIsWhitelisted = async () => {
    try {
      //need the Signer later to get the user's address
      //even though it is a read transaction, since Signers are just special kinds of Providers, it can use in it's place
      const signer = getProviderOrSigner(true)
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );

      //get the address associated to the signer which is connected to Metamask
      const address = await signer.getAddress()
      const _joinedWhitelist = await whitelistContract.whiteListedAddresses(
        address
      )
      setJoinedWhitelist(_joinedWhitelist);

    } catch (error) {
      console.log(error)
    }
  }



  const getNumberOfWhitelisted = async () => {
    try {
      //Get the provider from web3Modal, which in our case is Metamask
      //No need for the Signer here, it only reading state from the blockchain
      const provider = await getProviderOrSigner();
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );

      const _numOfWhitelisted = await whitelistContract.numAddressesWhitelisted();
      setNumOfWhitelisted(_numOfWhitelisted);

    } catch (error) {
      
    }
  }

  const renderButton = () => {
    if(walletConnected){
      if(joinedWhitelist){
        return (
          <div className='font-bold font-ProtoMono-LightShadow text-[2rem]'>
            Thanks for joining the Whitelist!! :)
          </div>
        )
      }else if(loading){
        return <button>
          Loading....
        </button>
      }else{
        return (
          <button onClick={addAddressToWhitelist}>
            Join the Whitelist
          </button>
        )
      }
    }else{
      return (
        <button onClick={connectWallet}>
        Connect your wallet
      </button>
      )
    }
  }

  //connectWallet: Connects the Metamask wallet

  const connectWallet = async () => {
    try {
      //get the provider from web3Modal, which in our case is MetaMask
      //when used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();

      setWalletConnected(true)
      checkIfAddressIsWhitelisted();
      getNumberOfWhitelisted();
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    //if wallet is not connected, create a new instance of Web3Modal and connect the Metamask wallet
    if(!walletConnected){
      //Assign the Web3Modal class to the reference object by setting it's current' value
      //The current value is persisted as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network:"rinkeby",
        providerOptions:{},
        disableInjectedProvider:false
      });
      connectWallet() 
    }
  },[walletConnected]);

  return (
    <div className='font-bold font-nato p-9'>
      <Head>
        <title>Whitelist dApp</title>
        <meta name="description" content='Whitelist-dApp' />
        <link rel="icon" href='/favicon.ico' />
      </Head>
      <div className='min-h-[90vh] flex flex-row justify-around items-center font-nato' id="main" >
        <div className='h-full '>
          <h1 className='font-bold font-nato text-[2rem]'>Welcome to Crypto Devs!</h1>
          <div className='magin-[2rem 0] font-[1.2rem] '>
            It&apos;s an NFT collection for developers in Crypto.
          </div>
          <div className='magin-[2rem 0] font-[1.2rem] mb-10'>
            <span className='text-blue-600 text-2xl'>{numOfWhitelisted}</span> have already joined the Whitelist
          </div>
          {renderButton()}
        </div>  
          <div className="w-[30vw] h-[30vw] bg-center bg-cover  bg-my_bg_image"></div>
      </div>
      <footer className='text-center font-[1.2rem]'>
        @2022 - Whitelist dApp 
      </footer>
    </div>
  )
}

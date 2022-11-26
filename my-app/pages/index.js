import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers,Contract } from "ethers";
import { useEffect,useRef,useState } from "react";
import {WHITELIST_CONTRACT_ADDRESS,abi} from "../constants";

export default function Home(){
  //1. Keep track of whether the current user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  //2. Keep tract of whether the current metamask address has joined the whitelist or not
  const [joinedWhitelist,setJoinedWhitelist] = useState(false);
  //3. Loading is set true when we are waiting for a transaction to get mined
  const [loading,setLoading] = useState(false);
  //4. numberOfWhiteListed tracks the number of address's whitlelisted
  const [numberOfWhiteListed,setNumberOfWhitelisted] = useState(0);
  //5. Create a reference to the Web3 Modal which persists as long as the page is open
  const web3modalRef = useRef();


  //Returns a Provider or Signer object representing the Ethereum RPC with or without the signing capabilities of metamask attached
  const getProviderOrSigner = async (needSigner = false) => {
    //1.connect to Metamask
    const provider = await web3modalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);


    //2.If user is not connected to the Goerli network, let them know and throw an error
    const {chainId} = await web3Provider.getNetwork();
    if (chainId !==5){
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");
    } 

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }

    return web3Provider;
  }


  // addAddressToWhitelist : add the current connected address to the whitelist

  const addAddressToWhitelist = async () => {
    try{
      const signer = await getProviderOrSigner(true);
      //create a new instance of the Contract with a signer, which allows update methods
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      //call the addAddressToWhitelist from the contract
        const tx = await whitelistContract.addAddressToWhitelist();
        setLoading(true);
        //wait for the transaction to get mined
        await tx.wait();
        setLoading(false);
        //get the updated number of addresses in the whitelist
        await getNumberOfWhitelisted(); 

    }catch (err){
      console.error(err);
    }
  }


  const getNumberOfWhitelisted = async () => {
    try {
      //Get the provider from web3Modal, which in our case is Metamask
      //No need for the signer here, as we are only reading state from the blockchain
      const provider = await getProviderOrSigner();
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );

      //call the numAddressesWhitelisted from the contract
        const _numberOfWhitelisted = await whitelistContract.numAddressesWhitelisted(); 
        setNumberOfWhitelisted(_numberOfWhitelisted);

    } catch (err) {
      console.error(err);
    }
  }


  const checkIfAddressInWhitelist = async() => {
    try {
      //we will need the signer later to get the user's address
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      )
      //get the address associated to the signer which is conncected to Metamask
      const address = await signer.getAddress();
      //call the whitelistedAddresses from the contract
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(address);
      setJoinedWhitelist(_joinedWhitelist);

    } catch (err) {
      console.log(err);
    }
  }


  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);

      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();
    } catch (err) {
      console.log(err);
    }
  }


  const renderButton = () => {
    if(walletConnected) {
      if(joinedWhitelist){
        return(
          <div className={styles.description}>Thanks for joining the Whitelist</div>
        );
      }else if(loading){
        return (
          <button className={styles.button}>Loading...</button>
        );
      }else{
        return (
          <button  onClick={addAddressToWhitelist} className={styles.button}>Join the Whitelist</button>
        )
      }
    }else{
      return (
        <button onClick={connectWallet} className={styles.button}>Connect to your Wallet</button>
      )
    }
  }

  useEffect(() => {
    //if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if(!walletConnected){
      //Assign the Web3Modal class to the reference object by setting it's 'current' value
      //The current value is persisted throughout as long as this page is open
      web3modalRef.current = new Web3Modal({
        network:"goerli",
        providerOptions:{},
        disableInjectedProvider:false,
      });
    }
  },[walletConnected]);

  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp"/>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!!!!!</h1>
          <div className={styles.description}>
            Its an NFT collection for developer in Crypto.
          </div>
          <div className={styles.description}>
            {numberOfWhiteListed} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.svg" />
        </div>
      </div>
      <footer className={styles.footer}>
      Made with &#10084; by Joy M
      </footer>
    </div>
  )



}
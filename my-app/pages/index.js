import Head from 'next/head'
import Web3Modal from "web3modal"
import { useEffect, useRef, useState } from 'react'
import { Contract, providers } from "ethers"
import { abi, WHITELIST_CONTRACT_ADDRESS } from '../constants';




export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [numOfWhitelisted,setNumOfWhitelisted] = useState(0);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [loading,setLoading] = useState(false);
  const web3ModalRef = useRef();

  const getProviderOrSigner = async(needSigner = false) => {
    try {
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);

      const {chainId} = await web3Provider.getNetwork();
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
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );

      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch (error) {
      console.log(error)
    }
  }

  const checkIfAddressIsWhitelisted = async () => {
    try {
      const signer = getProviderOrSigner(true)
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );

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
      <button onClick={connectWallet}>
        Connect your wallet
      </button>
    }
  }

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true)
      checkIfAddressIsWhitelisted();
      getNumberOfWhitelisted();
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(!walletConnected){
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
    </div>
  )
}

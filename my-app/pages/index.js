import Head from "next/head";
import styles from "../styles/Home.modules.css";
import Web3Modal from "web3modal";
import { providers,Contract } from "ethers";
import { useEffect,useState } from "react";
import {WHITELIST_CONTRACT_ADDRESS,abi} from "../constants";
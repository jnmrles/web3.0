import React, {useEffect, useState} from "react";

import {ethers} from 'ethers'

import {contractABI, contractAddress} from '../utils/constants'

export const TransactionContext = React.createContext()


const {ethereum} = window
// fetches eth contract
const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(contractAddress, contractABI, signer)

console.log({
  provider,signer, transactionContract
})

}

export const TransactionProvider = ({children}) =>{
  let initialState;

  const [connectedAccount,setConnectedAccount] = useState(initialState)

  const checkIfWalletIsConnected = async () => {

    try{
      if(!ethereum) return alert("Please Install MetaMask")

      const accounts = await ethereum.request({method:'eth_accounts'})

      if(accounts.length){
        setConnectedAccount(accounts[0])
      }
      else(
        console.log("No Accounts Found")

      )
      console.log(accounts)
    }catch(err){
      console.log(error)
      throw new Error("No ethereum Object")
    }

  }

  const connectWallet = async () => {
    try{
      if(!ethereum) return alert("Please Install MetaMask")
      const accounts = await ethereum.request({method:'eth_requestAccounts'})

    }
    catch(err){
      console.log(err)
      throw new Error("No ethereum Object")

    }
  }

  useEffect(()=>{
    checkIfWalletIsConnected()

  }, [])

  return(
    <TransactionContext.Provider value={{connectWallet, connectedAccount}}>
      {children}

    </TransactionContext.Provider>
  )
}

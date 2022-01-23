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

return transactionContract

}

export const TransactionProvider = ({children}) =>{
  let initialState;

  const [connectedAccount,setConnectedAccount] = useState(initialState)
  const [formData,setFormData] = useState({addressTo: '', amount: '',keyword: '', message: '' })
  const [isLoading, setIsLoading] =  useState(false)
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'))

  const handleChange  = (e, name )=>{
    setFormData((prevState)=>({...prevState, [name]: e.target.value}))

  }

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

  const sendTransaction = async () =>{
    try {
      if(!ethereum) return alert("Please install metamask")

      const {addressTo, amount, keyword,message } = formData
      const transactionContract = getEthereumContract()

      const parsedAmount = ethers.utils.parseEther(amount)

      await ethereum.request({
        method: 'eth_sendTransaction',
        params:[{
          from: connectedAccount,
          to: addressTo,
          gas: '0x5208',
          value: parsedAmount._hex,
        }]
      })

      const  transactionHash = await transactionContract.addToBlockChain(addressTo, parsedAmount, message, keyword)

      setIsLoading(true)
      console.log("sending eth.....")

      await transactionHash.wait()

      setIsLoading(false)

      const transactionCount = await transactionContract.getTransactionsCount()

      setTransactionCount(transactionCount.toNumber())

      console.log("ETH SENT!")

    } catch (error) {
      console.log(error)

    }
  }

  useEffect(()=>{
    checkIfWalletIsConnected()

  }, [])

  return(
    <TransactionContext.Provider value={{connectWallet, connectedAccount, formData, setFormData, handleChange, sendTransaction}}>
      {children}

    </TransactionContext.Provider>
  )
}

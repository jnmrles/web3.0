import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

// Metamask injects ethereum object into window. We need this to check if there is a metamask available
const { ethereum } = window;

// fetches our contract
const fetchEthereumContract = () => {
  // connects to eth network
  const provider = new ethers.providers.Web3Provider(ethereum);
  // interacts with state changing operations
  const signer = provider.getSigner();
  // fetched our contract
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionsContract;
};

const ethereumExists = () => {
  if(!ethereum) return alert("Ethereum does not exist: Please install MetaMask")

}

export const TransactionProvider = ({ children }) => {



  const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
  const [transactions, setTransactions] = useState([]);


  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };
//


const connectWallet = async () => {
  try {
    ethereumExists();
    // Ethereum method to request account connectivity
    const accounts = await ethereum.request({ method: "eth_requestAccounts", });
    setCurrentAccount(accounts[0]);
  } catch (error) {
    console.log(error);

    throw new Error("No ethereum object");
  }
};

  const checkIfWalletIsConnect = async () => {
    try {
      ethereumExists();
      // method to fetch connected accounts
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllTransactions();

      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };



  const checkIfTransactionsExists = async () => {
    try {
        ethereumExists();
        //  fetch our transactions contract so we can access our contract functions
        const transactionsContract = fetchEthereumContract();
        const currentTransactionCount = await transactionsContract.getTransactionsCount();

        // data returned is not sensitive. set to localStorage
        window.localStorage.setItem("transactionCount", currentTransactionCount);

    } catch (error) {
      console.log(error);
    }
  };

  //  fetches all transactions on our contract using our contract methods
  const getAllTransactions = async () => {
    try {
        ethereumExists();

        const transactionsContract = fetchEthereumContract();
        const availableTransactions = await transactionsContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map((transaction) => ({
          addressTo: transaction.reciever,
          addressFrom: transaction.sender,
          timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount._hex) / (10 ** 18)
        }));

        console.log(structuredTransactions);

        setTransactions(structuredTransactions);

    } catch (error) {
      console.log(error);
    }
  };


  // emits transaction
  const sendTransaction = async () => {3
    try {
      ethereumExists();
        const { addressTo, amount, keyword, message } = formData;
        const transactionsContract = fetchEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount);

        // sends transaction from user to user
        await ethereum.request({
          method: "eth_sendTransaction",
          params: [{
            from: currentAccount,
            to: addressTo,
            gas: "0x5208",  //21000 GWei
            value: parsedAmount._hex,
          }],
        });

        //  adds transaction details to the blockchain
        const transactionHash = await transactionsContract.addToBlockChain(addressTo, parsedAmount, message, keyword);

        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);

        const transactionsCount = await transactionsContract.getTransactionsCount();

        setTransactionCount(transactionsCount.toNumber());

    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };



  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
  }, [transactionCount, currentAccount]);



  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

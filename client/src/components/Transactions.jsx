import React, {useContext} from "react"
import {TransactionContext} from "../context/TransactionContext"
import dummyData from '../utils/dummyData'
import { shortenAddress } from "../utils/shortenAddress"

const Transactions = () =>{

  const { connectedAccount } = useContext(TransactionContext)
  return (
<div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
  <div className="flex flex-col md:p-12 px-4">
    {connectedAccount ? (<h3 className="text-white text-3xl text-center my-2"> Latest Transactions </h3>): (<h3 className="text-white text-3xl text-center my-2"> Connect your Account </h3>)}

<div className="flex flex-wrap justify-center items-center mt-10">
  {
    dummyData.reverse().map((transactions, i)=>(<TransactionCard key={i} {...transactions} />))
  }

</div>
  </div>
</div>
  )
}

export default Transactions

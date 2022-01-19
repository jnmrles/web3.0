//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

// contract is like a class in javascript
contract Transactions {
    // declare types of variables
    uint256 transactionsCounter;

    //  event is like a function
    event Transfer(
        address from,
        address reciever,
        uint256 amount,
        string message,
        uint256 timestamp,
        string keyword
    );

    // similar to object

    struct TransferStruct {
        address sender;
        address reciever;
        uint256 amount;
        string message;
        uint256 timestamp;
        string keyword;
    }
    // define an array of all transactions

    TransferStruct[] transactions;

    function addToBlockChain(
        address payable receiver,
        uint256 amount,
        string memory message,
        string memory keyword
    ) public {
        transactionsCounter += 1;
        // sender is something u automatically get in msg when u call a function in the blockchain
        transactions.push(
            TransferStruct(
                msg.sender,
                receiver,
                amount,
                message,
                block.timestamp,
                keyword
            )
        );

        emit Transfer(
            msg.sender,
            receiver,
            amount,
            message,
            block.timestamp,
            keyword
        );
    }

    // this function is public and returns an array of transferStructs from memory
    function getAllTransactions()
        public
        view
        returns (TransferStruct[] memory)
    {
        return transactions;
    }

    function getTransactionsCount() public view returns (uint256) {
        return transactionsCounter;
    }
}

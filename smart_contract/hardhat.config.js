// https://eth-ropsten.alchemyapi.io/v2/tnc5aYc7B_8Ezq_aCWOTq9BzjZz_mQ7m

require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/tnc5aYc7B_8Ezq_aCWOTq9BzjZz_mQ7m`,
      accounts: [
        "4aafe27943f158328310df15ba148363ddca23fbc3761366b04da2cf45134802",
      ],
    },
  },
};

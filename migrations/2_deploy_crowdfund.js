const CrowdFund = artifacts.require("CrowdFund");

module.exports = function (deployer) {
  // Set your fundraising goal here (in wei)
  const goal = web3.utils.toWei("10", "ether"); // Example: 10 ETH goal

  deployer.deploy(CrowdFund, goal);
};

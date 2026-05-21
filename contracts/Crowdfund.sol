// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title CrowdFund
 * @dev Fundraising campaign contract for Lesela Medical Center
 *
 * Features:
 * - Users can donate ETH to the campaign
 * - Owner can withdraw funds only if goal is reached
 * - Tracks total raised amount vs goal
 */
contract CrowdFund {
    uint256 public goal;           // Fundraising goal in wei
    uint256 public raisedAmount;   // Total amount raised in wei
    address public owner;          // Contract owner

    event DonationReceived(address donor, uint256 amount);
    event FundsWithdrawn(address owner, uint256 amount);

    /**
     * @dev Constructor sets the fundraising goal.
     * @param _goal The fundraising goal in wei.
     */
    constructor(uint256 _goal) {
        require(_goal > 0, "Goal must be greater than 0");
        goal = _goal;
        owner = msg.sender;
        raisedAmount = 0;
    }

    /**
     * @dev Allows anyone to donate ETH to the campaign.
     */
    function donate() public payable {
        require(msg.value > 0, "Donation must be greater than 0");

        raisedAmount += msg.value;

        emit DonationReceived(msg.sender, msg.value);
    }

    /**
     * @dev Allows owner to withdraw if the goal is met.
     */
    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        require(raisedAmount >= goal, "Goal not reached");
        require(address(this).balance > 0, "No funds to withdraw");

        uint256 amount = address(this).balance;
        raisedAmount = 0;

        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Transfer failed");

        emit FundsWithdrawn(owner, amount);
    }

    /**
     * @dev Returns the contract balance.
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Returns progress percentage.
     */
    function getProgressPercentage() public view returns (uint256) {
        if (goal == 0) return 0;
        return (raisedAmount * 100) / goal;
    }
}

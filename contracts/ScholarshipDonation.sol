// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ScholarshipDonation
 * @dev A contract for handling donations to the scholarship platform
 */
contract ScholarshipDonation {
    // Event emitted when a donation is made
    event DonationReceived(address indexed donor, uint256 amount, string message);
    
    // Event emitted when funds are withdrawn
    event FundsWithdrawn(address indexed recipient, uint256 amount);
    
    // Owner of the contract
    address public owner;
    
    // Total donations collected
    uint256 public totalDonations;
    
    // Track individual donations
    struct Donation {
        address donor;
        uint256 amount;
        string message;
        uint256 timestamp;
    }
    
    // Array to store all donations
    Donation[] public donations;
    
    // Mapping to track total donations per donor
    mapping(address => uint256) public donorTotalAmount;
    
    // Constructor
    constructor() {
        owner = msg.sender;
    }
    
    // Modifier to restrict certain functions to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
    
    /**
     * @dev Function to make a donation
     * @param message A message from the donor
     */
    function donate(string memory message) public payable {
        require(msg.value > 0, "Donation amount must be greater than 0");
        
        // Add donation to the array
        donations.push(Donation({
            donor: msg.sender,
            amount: msg.value,
            message: message,
            timestamp: block.timestamp
        }));
        
        // Update donor's total donation amount
        donorTotalAmount[msg.sender] += msg.value;
        
        // Update total donations
        totalDonations += msg.value;
        
        // Emit event
        emit DonationReceived(msg.sender, msg.value, message);
    }
    
    /**
     * @dev Function to withdraw funds (only owner)
     * @param amount The amount to withdraw
     * @param recipient The address to send the funds to
     */
    function withdrawFunds(uint256 amount, address payable recipient) public onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        
        // Transfer the specified amount to the recipient
        recipient.transfer(amount);
        
        // Emit event
        emit FundsWithdrawn(recipient, amount);
    }
    
    /**
     * @dev Function to get the contract balance
     * @return The current balance of the contract
     */
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Function to get the total number of donations
     * @return The total number of donations
     */
    function getDonationCount() public view returns (uint256) {
        return donations.length;
    }
    
    /**
     * @dev Function to get donor's total donation amount
     * @param donor The address of the donor
     * @return The total amount donated by the donor
     */
    function getDonorTotalAmount(address donor) public view returns (uint256) {
        return donorTotalAmount[donor];
    }
    
    /**
     * @dev Function to get the latest donations
     * @param count The number of latest donations to fetch
     * @return donors Array of donation addresses
     * @return amounts Array of donation amounts
     * @return messages Array of donation messages
     * @return timestamps Array of donation timestamps
     */
    function getLatestDonations(uint256 count) public view returns (
        address[] memory donors,
        uint256[] memory amounts,
        string[] memory messages,
        uint256[] memory timestamps
    ) {
        // Calculate the start index
        uint256 startIndex = 0;
        if (donations.length > count) {
            startIndex = donations.length - count;
        }
        
        // Determine the actual count
        uint256 actualCount = donations.length > count ? count : donations.length;
        
        // Initialize arrays
        donors = new address[](actualCount);
        amounts = new uint256[](actualCount);
        messages = new string[](actualCount);
        timestamps = new uint256[](actualCount);
        
        // Fill arrays with data
        for (uint256 i = 0; i < actualCount; i++) {
            Donation memory donation = donations[startIndex + i];
            donors[i] = donation.donor;
            amounts[i] = donation.amount;
            messages[i] = donation.message;
            timestamps[i] = donation.timestamp;
        }
        
        return (donors, amounts, messages, timestamps);
    }
} 
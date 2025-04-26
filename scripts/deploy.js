const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying ScholarshipDonation contract...");

  // Get the contract factory
  const ScholarshipDonation = await ethers.getContractFactory("ScholarshipDonation");
  
  // Deploy the contract
  const scholarshipDonation = await ScholarshipDonation.deploy();
  
  // Wait for deployment to finish
  await scholarshipDonation.deployed();
  
  console.log("ScholarshipDonation deployed to:", scholarshipDonation.address);
  
  // Log information for verification
  console.log("----------------------------------------------------");
  console.log("To verify the contract on Basescan:");
  console.log(`npx hardhat verify --network base-sepolia ${scholarshipDonation.address}`);
  console.log("----------------------------------------------------");
  
  // Reminder to update the contract address
  console.log("Don't forget to update the contract address in utils/contractUtils.ts");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 
import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const MediShare = await ethers.getContractFactory("Medishare");
  const contract = await MediShare.deploy();

  await contract.waitForDeployment();

  console.log("Contract deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

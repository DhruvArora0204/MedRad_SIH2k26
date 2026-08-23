// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";



contract Medishare is ERC721Enumerable, Ownable {
    struct Medicine {
        string name;
        string brand;
        bytes32 batchId;
        uint256 expiryDate;
        string manufacturerDetails;
        address manufacturer;
        bool isVerified;
        bool isAuthenticated;
        bool exists;
        bool isActive;
        uint256 tokenId;
        bool isNFTValid;
    }

    struct VerificationResult {
        bool isValid;
        bool isVerified;
        bool isAuthenticated;
        address manufacturer;
        uint256 expiryDate;
        bool isActive;
        uint256 tokenId;
        bool isNFTValid;
    }

    mapping(bytes32 => Medicine) private _medicines;
    mapping(uint256 => bytes32) private _tokenToBatch;
    mapping(address => uint256[]) private _manufacturerNFTs;

    event MedicineAdded(bytes32 batchId);
    event MedicineVerified(bytes32 batchId);
    event MedicineAuthenticated(bytes32 batchId, uint256 tokenId);
    event MedicineExpired(bytes32 batchId);
    event NFTInvalidated(uint256 tokenId);

    constructor() ERC721("MediAuthToken", "MAT") Ownable(msg.sender) {}

    /**
     * @dev Add new medicine batch with future expiry
     */
    function addMedicine(
        string calldata batchNumber,
        string calldata name,
        string calldata brand,
        uint256 expiryDate,
        string calldata manufacturerDetails,
        address manufacturer
    ) external onlyOwner {
        require(expiryDate > block.timestamp, "Expiry must be future");
        bytes32 batchId = keccak256(abi.encodePacked(batchNumber));
        require(!_medicines[batchId].exists, "Batch exists");

        _medicines[batchId] = Medicine({
            name: name,
            brand: brand,
            batchId: batchId,
            expiryDate: expiryDate,
            manufacturerDetails: manufacturerDetails,
            manufacturer: manufacturer,
            isVerified: false,
            isAuthenticated: false,
            exists: true,
            isActive: true,
            tokenId: 0,
            isNFTValid: false
        });

        emit MedicineAdded(batchId);
    }

    /**
     * @dev Verify medicine batch with auto-expiry check
     */
    function verifyMedicine(string calldata batchNumber, bool status) external onlyOwner {
        bytes32 batchId = keccak256(abi.encodePacked(batchNumber));
        Medicine storage med = _medicines[batchId];
        require(med.exists, "Batch not found");
        
        _autoExpireCheck(med);
        require(med.isActive, "Medicine expired");
        
        med.isVerified = status;
        emit MedicineVerified(batchId);
    }



    /**
     * @dev Get full details of a medicine batch without modifying state.
     */
    function getMedicineDetails(string calldata batchNumber) external view returns (Medicine memory) {
        bytes32 batchId = keccak256(abi.encodePacked(batchNumber));
        Medicine memory med = _medicines[batchId];
        require(med.exists, "Batch not found");
        return med;
    }



    /**
     * @dev User verification with automatic state updates
     */
    function verifyBatch(string calldata batchNumber) view external returns (VerificationResult memory) {
        bytes32 batchId = keccak256(abi.encodePacked(batchNumber));
        Medicine storage med = _medicines[batchId];
        require(med.exists, "Batch not found");
        
        // _autoExpireCheck(med);

        return VerificationResult({
            isValid: med.isActive && block.timestamp < med.expiryDate,
            isVerified: med.isVerified,
            isAuthenticated: med.isAuthenticated,
            manufacturer: med.manufacturer,
            expiryDate: med.expiryDate,
            isActive: med.isActive,
            tokenId: med.tokenId,
            isNFTValid: med.isNFTValid
        });
    }

/**
 * @dev Mint NFT with duplicate prevention safeguards.
 * Now accepts an address parameter for the NFT recipient.
 */
function authenticateBatch(string calldata batchNumber, address recipient) external onlyOwner {
    bytes32 batchId = keccak256(abi.encodePacked(batchNumber));
    Medicine storage med = _medicines[batchId];
    require(med.exists, "Batch not found");
    
    _autoExpireCheck(med);
    require(med.isActive, "Medicine expired");
    require(med.isVerified, "Not verified");
    require(med.tokenId == 0, "NFT already minted");
    require(recipient == med.manufacturer, "Invalid recipient");

    uint256 newTokenId = totalSupply() + 1;
    _safeMint(recipient, newTokenId);
    
    med.tokenId = newTokenId;
    med.isAuthenticated = true;
    med.isNFTValid = true;
    _tokenToBatch[newTokenId] = batchId;
    _manufacturerNFTs[recipient].push(newTokenId);

    emit MedicineAuthenticated(batchId, newTokenId);
}


    /**
     * @dev Automatic expiry check and state update
     */
    function _autoExpireCheck(Medicine storage med) private {
        if (med.isActive && block.timestamp >= med.expiryDate) {
            med.isActive = false;
            med.isVerified = false;
            med.isAuthenticated = false;
            med.isNFTValid = false;
            emit MedicineExpired(med.batchId);
            
            if (med.tokenId != 0) {
                emit NFTInvalidated(med.tokenId);
            }
        }
    }

    /**
     * @dev Get manufacturer's NFTs
     */
    function getManufacturerNFTs(address manufacturer) external view returns (uint256[] memory) {
        return _manufacturerNFTs[manufacturer];
    }

    /**
     * @dev Check NFT validity status
     */
    function isNFTValid(uint256 tokenId) external view returns (bool) {
        bytes32 batchId = _tokenToBatch[tokenId];
        return _medicines[batchId].isNFTValid;
    }
}



//addMedicine("BATCH001", "Paracetamol", "MediPharm", block.timestamp + 30 days, "MediPharm Inc.", 0x1234567890abcdef1234567890abcdef12345678);
// verifyMedicine("BATCH001", true);
//isNFTValid(1); // Assuming tokenId 1 exists


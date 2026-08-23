# MediShare: Revolutionizing Healthcare with Blockchain and AI

Welcome to **MediShare**, an innovative platform designed to transform healthcare by integrating blockchain technology, generative AI, and real-time communication. Our mission is to enhance patient care, ensure medication authenticity, and foster a collaborative health community.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
  - [1. Medical Report Summarization](#1-medical-report-summarization)
  - [2. Smart Medication Scanning](#2-smart-medication-scanning)
  - [3. Medicine Donation Network](#3-medicine-donation-network)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Usage](#usage)
- [License](#license)
- [Contact](#contact)

## Introduction

In today's fast-paced world, accessing accurate medical information and authentic medications is crucial. **MediShare** addresses these challenges by offering:

- **Comprehensive Medical Summaries**: Upload medical reports to receive concise summaries, including diagnosed conditions, prescribed medications with their uses, and personalized lifestyle suggestions.
- **Medication Verification**: Scan medication QR codes to obtain detailed information, verify authenticity via blockchain, and prevent counterfeit drug usage.
- **Community-Driven Medicine Donations**: Connect with government hospitals, NGOs, and individuals to donate or acquire unused, unexpired medications, reducing waste and promoting health equity.

## Features

### 1. Medical Report Summarization

Utilizing generative AI, our platform analyzes uploaded medical reports to provide:

- **Diagnosed Conditions**: Clear identification of medical issues.
- **Prescribed Medications**: Details of medications, their purposes, and dosages.
- **Lifestyle Suggestions**: Tailored advice to support health and well-being.

*Example*: Upload a blood test report to receive insights into cholesterol levels with dietary recommendations.

### 2. Smart Medication Scanning

Our smart scanning feature enables users to:

- **Verify Medication Authenticity**: Scan QR codes to access blockchain-stored data, ensuring the medication's legitimacy.
- **Access Detailed Information**: Learn about medication uses, side effects, and guidelines.
- **Prevent Counterfeit Consumption**: Blockchain integration safeguards against fake medicines, promoting user safety.

*Example*: Before consuming a medication, scan its QR code to confirm its authenticity and access usage instructions.

### 3. Medicine Donation Network

**MediShare** fosters a community of care by enabling:

- **Donations of Unused Medications**: Individuals can donate unexpired medicines to those in need.
- **Collaboration with Hospitals and NGOs**: Streamlined processes for organizations to distribute medications effectively.
- **Duplication Prevention**: Blockchain ensures transparent tracking, preventing duplicate donations and misuse.

*Example*: A person with surplus medication can list it on the platform, allowing nearby hospitals or individuals to claim and utilize it appropriately.

### 4. AI-Powered Chatbot (RAG-Based)
MediShare includes an intelligent Retrieval-Augmented Generation (RAG) based chatbot to enhance user interaction and support. This chatbot is capable of:

Context-Aware Assistance: Understands platform policies, user queries, and donation workflows.

Real-Time Recommendations: Provides suggestions based on available medicines in the donation database, ensuring accurate and up-to-date information.

Document + Data Integration: Combines knowledge from uploaded reports and live backend data to offer highly personalized responses.

🔧 Powered By:

Groq API with Gamma Model: For fast and efficient natural language understanding.

FAISS Vector Database: To index and retrieve contextual data from donation records and policies.

LLaMA Embeddings: Used to convert textual data (like reports and medicines) into vector format for smarter retrieval.

Example: A user asks, “Can I donate expired medicine?” — the chatbot fetches policy context and responds accurately. Or, if asked, “Which painkillers are currently available for donation?” — it checks live data and replies accordingly.

## Technology Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Blockchain**:
  - **Smart Contracts**: Developed using Solidity
  - **Development Framework**: Hardhat
  - **API Integration**: Ethers.js
- **Artificial Intelligence**: Gemini 3 flash, Groq
- **Real-Time Communication**: WebSockets for live data updates
- **Database**: MongoDB, Qdrant
- **Deployment**: Docker and cloud platforms like AWS

## Architecture

**MediShare** is built with a modular architecture:

- **API Gateway**: Manages and routes user requests efficiently.
- **AI Service**: Processes medical reports and generates summaries with lifestyle recommendations.
- **Blockchain Service**: Manages smart contract interactions to verify medication authenticity and record donation transactions.
- **Real-Time Service**: Uses WebSockets to provide live updates and notifications to users.
- **Donation Matching Engine**: Connects donors with recipients by tracking and verifying medicine donations securely via blockchain.


## Usage

- **Medical Report Summarization:**  
  Navigate to the "Upload Report" section, submit your report, and instantly receive a summary with actionable insights.

- **Smart Medication Scanning:**  
  Use the "Scan Medication" feature to verify drug authenticity by scanning the QR code on your medicine. Receive detailed drug information and safety guidelines in real-time.

- **Medicine Donation:**  
  Register as a donor or recipient. Post available medicines or list needs, and let our donation matching engine connect you with government hospitals, NGOs, or individuals for safe, verified medicine transactions.


## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For collaboration, questions, or further information, please reach out:

- **Shourya Singh** – shourya124sensei@gmail.com  
- **Ansh Mahajan** – anshmahajan2006@gmail.com  
- **Priyansh** – priyansh56701@gmail.com  
- **Arman Singh** – [LinkedIn](https://www.linkedin.com/in/arman-singh-9bb83628a/)  

Join us in redefining healthcare. With MediShare, every medical report is simplified, every medication verified, and every donation transparently managed. Let's build a healthier future—together.
 ```

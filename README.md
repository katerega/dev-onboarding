# Simple Swap DEX Starter Kit

This project is a streamlined starter kit for a decentralized exchange (DEX), based on the core principles of Uniswap/PancakeSwap. It provides the essential contracts and scripts for deployment.

---

## Prerequisites

Before you begin, ensure you have the following installed:
- Docker
- Docker Compose

---

## One-Command Deployment

This project is configured for a simple, one-command deployment using Docker.

1.  **Clone the repository:**
   
    git clone <your-new-repo-link>
    

2.  **Navigate to the project directory:**

    cd clean-dex


3.  **Build and run the deployment container:**
    
    docker-compose up --build


This command will build the Docker image and run the `deploy.sh` script automatically, deploying the smart contracts.

---

## Manual Scripts

You can also run the provided scripts manually.

-   **Deploy Contracts:**
    
    ./scripts/deploy.sh
    
-   **Start Application:**
    
    ./scripts/start.sh
    
-   **Stop Application:**
    
    ./scripts/stop.sh
    

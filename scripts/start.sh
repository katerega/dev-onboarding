#!/bin/bash

# This script is the entry point for the container.
# It should run your deployment command.

echo "Deploying smart contracts..."

# cd /usr/src/app

# Run the Hardhat deployment script
# You might need to adjust this command based on your project's specific setup.
npx hardhat run scripts/deploy.ts --network localhost

# Keep the container running to view logs, etc.
tail -f /dev/null

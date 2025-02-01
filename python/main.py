import os
import time
import requests
from dotenv import load_dotenv
from web3 import Web3
from eth_account import Account
import json

# Load environment variables
load_dotenv()

# Configure Web3
w3 = Web3(Web3.HTTPProvider(os.getenv('HOLESKY_RPC_URL')))
private_key = os.getenv('PRIVATE_KEY')
account = Account.from_key(private_key)

# Contract configuration
CONTRACT_ADDRESS = os.getenv('CONTRACT_ADDRESS')
with open('../hardhat/artifacts/contracts/DataStorage.sol/DataStorage.json', 'r') as f:
    contract_abi = json.load(f)['abi']
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=contract_abi)

def get_api_data():
    """Fetch data from the API"""
    api_key = os.getenv('API_KEY')
    api_url = os.getenv('API_URL')
    
    headers = {'Authorization': f'Bearer {api_key}'}
    response = requests.get(api_url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        # Extract balance from the first validator in the data array
        balance = data['data'][0]['balance']
        print(f"Current validator balance: {balance}")
        return balance
    else:
        raise Exception(f"API request failed with status code: {response.status_code}")

def update_contract_data(data):
    """Update data in the smart contract"""
    nonce = w3.eth.get_transaction_count(account.address)
    
    # Prepare the transaction
    transaction = contract.functions.updateData(str(data)).build_transaction({
        'from': account.address,
        'nonce': nonce,
        'gas': 200000,
        'gasPrice': w3.eth.gas_price
    })
    
    # Sign and send the transaction
    signed_txn = w3.eth.account.sign_transaction(transaction, private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
    
    # Wait for transaction receipt
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    return tx_receipt

def main():
    while True:
        try:
            # Get data from API
            api_data = get_api_data()
            
            # Update contract
            tx_receipt = update_contract_data(api_data)
            print(f"Data updated successfully. Transaction hash: {tx_receipt['transactionHash'].hex()}")
            
            # Wait for 1 minute
            time.sleep(60)
            
        except Exception as e:
            print(f"Error occurred: {str(e)}")
            time.sleep(60)  # Wait before retrying

if __name__ == "__main__":
    main() 
import os
import time
import requests
from dotenv import load_dotenv
from web3 import Web3
from eth_account import Account
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from threading import Thread
import csv
import pathlib

app = Flask(__name__)
CORS(app, resources={r"/validator": {"origins": "http://localhost:5173"}})

# Load environment variables
load_dotenv()

# Configure Web3
w3 = Web3(Web3.HTTPProvider(os.getenv('HOLESKY_RPC_URL')))
private_key = os.getenv('PRIVATE_KEY')
account = Account.from_key(private_key)

# Contract configuration
CONTRACT_ADDRESS = os.getenv('CONTRACT_ADDRESS')  # Avec "0x" au début

# Get the absolute path to the artifacts directory
current_dir = os.path.dirname(os.path.abspath(__file__))
artifact_path = os.path.join(current_dir, '..', 'hardhat', 'artifacts', 'contracts', 'DataStorage.sol', 'DataStorage.json')

try:
    with open(artifact_path, 'r') as f:
        contract_abi = json.load(f)['abi']
except FileNotFoundError:
    print(f"Could not find contract artifacts at: {artifact_path}")
    print("Make sure you've compiled your contracts with 'npx hardhat compile'")
    raise

# Lors de l'initialisation du contrat, assurez-vous que l'adresse est checksum
CONTRACT_ADDRESS = Web3.to_checksum_address(CONTRACT_ADDRESS)
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=contract_abi)

# CSV file configuration
VALIDATORS_FILE = 'validators.csv'

def load_validators():
    """Load validators from CSV file"""
    if not pathlib.Path(VALIDATORS_FILE).exists():
        return set()
    
    with open(VALIDATORS_FILE, 'r') as f:
        reader = csv.reader(f)
        return set(row[0] for row in reader)

def save_validator(validator_id):
    """Save validator to CSV file"""
    validators = load_validators()
    if validator_id not in validators:
        with open(VALIDATORS_FILE, 'a', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([validator_id])

def remove_validator(validator_id):
    """Remove validator from CSV file"""
    validators = load_validators()
    if validator_id in validators:
        validators.remove(validator_id)
        with open(VALIDATORS_FILE, 'w', newline='') as f:
            writer = csv.writer(f)
            for vid in validators:
                writer.writerow([vid])

def get_api_data(validator_id):
    """Fetch data from the API for a specific validator"""
    api_key = os.getenv('API_KEY')
    base_url = "https://api.kiln.fi/v1/eth/stakes"
    api_url = f"{base_url}?validators={validator_id}"
    
    headers = {'Authorization': f'Bearer {api_key}'}
    response = requests.get(api_url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()['data'][0]
        balance = int(data['balance'])
        rewards = int(data['rewards'])
        print(f"Current validator {validator_id}:")
        print(f"  Balance: {balance} wei")
        print(f"  Rewards: {rewards} wei")
        return balance, rewards
    else:
        raise Exception(f"API request failed with status code: {response.status_code}")

def get_eth_price():
    """Fetch current ETH price from CryptoCompare"""
    url = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        # Get price and convert to integer with 8 decimals
        price = int(float(data['RAW']['ETH']['USD']['PRICE']) * 100000000)
        print(f"Current ETH price: ${price/100000000:.2f}")
        return price
    else:
        raise Exception(f"Price API request failed with status code: {response.status_code}")

def update_price_data(price):
    """Update price in the smart contract"""
    nonce = w3.eth.get_transaction_count(account.address)
    
    transaction = contract.functions.updatePrice(
        int(price)
    ).build_transaction({
        'from': account.address,
        'nonce': nonce,
        'gas': 500000,
        'gasPrice': w3.eth.gas_price
    })
    
    signed_txn = w3.eth.account.sign_transaction(transaction, private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
    
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    return tx_receipt

def update_contract_data(validator_id, balance, rewards):
    """Update validator data in the smart contract"""
    nonce = w3.eth.get_transaction_count(account.address)
    
    transaction = contract.functions.updateValidator(
        validator_id,
        int(balance),
        int(rewards)
    ).build_transaction({
        'from': account.address,
        'nonce': nonce,
        'gas': 500000,
        'gasPrice': w3.eth.gas_price
    })
    
    signed_txn = w3.eth.account.sign_transaction(transaction, private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
    
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    return tx_receipt

def monitor_validators():
    """Monitor all validators from the CSV file"""
    while True:
        try:
            # Update ETH price
            price = get_eth_price()
            price_receipt = update_price_data(price)
            print(f"Price updated. Tx hash: {price_receipt['transactionHash'].hex()}")
            
            # Update validator data
            validators = load_validators()
            for validator_id in validators:
                try:
                    balance, rewards = get_api_data(validator_id)
                    tx_receipt = update_contract_data(validator_id, balance, rewards)
                    print(f"Balance updated for {validator_id}. Tx hash: {tx_receipt['transactionHash'].hex()}")
                except Exception as e:
                    print(f"Error updating {validator_id}: {str(e)}")
            time.sleep(60)
        except Exception as e:
            print(f"Error in monitor loop: {str(e)}")
            time.sleep(60)

@app.route('/validator', methods=['POST'])
def add_validator():
    data = request.get_json()
    validator_id = data.get('validator_id')
    
    if not validator_id:
        return jsonify({'error': 'validator_id is required'}), 400
    
    save_validator(validator_id)
    return jsonify({'message': f'Added validator {validator_id}'}), 200

@app.route('/validator', methods=['DELETE'])
def delete_validator():
    data = request.get_json()
    validator_id = data.get('validator_id')
    
    if not validator_id:
        return jsonify({'error': 'validator_id is required'}), 400
    
    remove_validator(validator_id)
    return jsonify({'message': f'Removed validator {validator_id}'}), 200

@app.route('/validators', methods=['GET'])
def get_validators():
    validators = load_validators()
    return jsonify({'validators': list(validators)}), 200

if __name__ == "__main__":
    # Start monitoring thread
    monitor_thread = Thread(target=monitor_validators)
    monitor_thread.daemon = True
    monitor_thread.start()
    
    # Run Flask app
    app.run(host='0.0.0.0', port=5001)
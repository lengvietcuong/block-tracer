from neo4j import GraphDatabase
import pandas as pd

# Set up the connection to Neo4j
uri = "neo4j+s://302c9ded.databases.neo4j.io"
username = "neo4j"
password = "ZudlOJe1GAgCvMgq4CCk_XHwORwosn2KOMZ-kuYrEr8"
driver = GraphDatabase.driver(uri, auth=(username, password))

def close_driver():
    driver.close()

# Function to read the CSV file using pandas
def read_csv(file_path):
    return pd.read_csv(file_path).to_dict(orient='records')

# Function to create Address nodes
def create_address_nodes(tx, address):
    query = """
    MERGE (n:Address {addressId: $addressId})
    ON CREATE SET n.type = $type
    """
    tx.run(query, 
        addressId=address['addressId'], 
        type=address['type'])

# Function to create Address nodes and Transaction nodes with relationships
def create_transaction_with_relationship(tx, transaction):
    query = """
    MERGE (from:Address {address: $from_address})
    MERGE (to:Address {address: $to_address})
    CREATE (t:Transaction {
        hash: $hash,
        value: $value,
        input: $input,
        transaction_index: $transaction_index,
        gas: $gas,
        gas_used: $gas_used,
        gas_price: $gas_price,
        transaction_fee: $transaction_fee,
        block_number: $block_number,
        block_hash: $block_hash,git 
        block_timestamp: $block_timestamp
    })
    MERGE (from)-[:SENT]->(t)
    MERGE (t)-[:RECEIVED_BY]->(to)
    """
    tx.run(query, 
        from_address=transaction['from_address'], 
        to_address=transaction['to_address'],
        hash=transaction['hash'],
        value=transaction['value'],
        input=transaction['input'],
        transaction_index=transaction['transaction_index'],
        gas=transaction['gas'],
        gas_used=transaction['gas_used'],
        gas_price=transaction['gas_price'],
        transaction_fee=transaction['transaction_fee'],
        block_number=transaction['block_number'],
        block_hash=transaction['block_hash'],
        block_timestamp=transaction['block_timestamp'])

# Insert Address nodes into Neo4j
def insert_address_nodes_to_neo4j(csv_data):
    with driver.session() as session:
        for row in csv_data:
            session.write_transaction(create_address_nodes, row)

# Insert Transaction nodes and relationships into Neo4j
def insert_transaction_data_to_neo4j(csv_data):
    with driver.session() as session:
        for row in csv_data:
            session.write_transaction(create_transaction_with_relationship, row)

# Main execution
if __name__ == "__main__":
    # Step 1: Load Address nodes
    nodes_csv_file_path = "nodes.csv"  # Update with your actual nodes.csv file path
    nodes_csv_data = read_csv(nodes_csv_file_path)
    
    # Insert nodes into Neo4j
    insert_address_nodes_to_neo4j(nodes_csv_data)
    
    # Step 2: Load Relationships (transactions)
    transactions_csv_file_path = "relationships.csv"  # Update with your actual relationships.csv file path
    transactions_csv_data = read_csv(transactions_csv_file_path)
    
    # Insert relationships into Neo4j
    insert_transaction_data_to_neo4j(transactions_csv_data)
    
    # Close Neo4j driver when done
    close_driver()

from pymongo import MongoClient
import os
from dotenv import load_dotenv
load_dotenv()

class MongoDB(object):
    # Init MongoDB class variable and database name
    def __init__(self, db_name):
        self.client = MongoClient("mongodb://{}:{}/".format(os.getenv('DB_HOST'), int(os.getenv('DB_PORT'))))
        self.db = self.client[db_name]

    # Insert document in db collection
    def insert(self, coll, data):
        self.db[coll].insert(data)
        return

    # Update one document in db collection
    def update_one(self, coll, filter_data, set_data):
        self.db[coll].update_one(
                filter_data, 
                { "$set": set_data}
            )
        return

    # Find many document in db collection
    def find(self, coll, data):
        return self.db[coll].find(data)

    # Find only one document in db collection
    def find_one(self, coll, data):
        return self.db[coll].find_one(data)

    # Delete one document in db collection
    def delete_one(self, coll, data):
        self.db[coll].delete_one(data)
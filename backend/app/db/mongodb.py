
from pymongo import MongoClient
from app.core.config import settings

class MongoDB:
    client: MongoClient = None
    db = None

    def connect(self):
        if self.client is not None:
            return
        try:
            print(f"Connecting to MongoDB at {settings.MONGO_URI}...")
            self.client = MongoClient(settings.MONGO_URI, serverSelectionTimeoutMS=5000)
            # The ismaster command is cheap and does not require auth.
            self.client.admin.command('ismaster')
            self.db = self.client[settings.MONGO_INITDB_DATABASE]
            print(f"Successfully connected to MongoDB database: {settings.MONGO_INITDB_DATABASE}")
        except Exception as e:
            print(f"Critical Error: Could not connect to MongoDB: {e}")
            self.client = None
            self.db = None

    def close(self):
        if self.client:
            self.client.close()
            print("Closed MongoDB connection")

db = MongoDB()

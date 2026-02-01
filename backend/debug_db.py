
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/phish_guard_ai")
DATABASE = os.getenv("MONGO_INITDB_DATABASE", "phish_guard_ai")

print(f"Connecting to: {MONGO_URI}")
print(f"Database: {DATABASE}")

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    # The ismaster command is cheap and does not require auth.
    client.admin.command('ismaster')
    print("MongoDB connection successful")
    
    db = client[DATABASE]
    users_count = db.users.count_documents({})
    print(f"Users count: {users_count}")
    
    for user in db.users.find().limit(5):
        print(f"User: {user.get('email')}, Role: {user.get('role')}, Provider: {user.get('authProvider')}")

except Exception as e:
    print(f"MongoDB connection failed: {e}")

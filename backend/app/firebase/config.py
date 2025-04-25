import firebase_admin
from firebase_admin import credentials, auth, firestore
import os
from dotenv import load_dotenv

load_dotenv()

cred = credentials.Certificate("firebase-admin-key.json")
firebase_admin.initialize_app(cred)

db = firestore.client()
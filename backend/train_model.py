
import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
import os

# Dataset Path
DATASET_PATH = "datasets/phishing_urls.csv"
MODEL_PATH = "app/ml/phishing_model.joblib"

def train():
    print("Loading dataset...")
    try:
        if not os.path.exists(DATASET_PATH):
            print(f"Error: Dataset not found at {DATASET_PATH}")
            print("Please download a relevant dataset (e.g. from Kaggle) and place it in backend/datasets/")
            return

        # Attempt to read CSV - robust handling for different formats
        try:
            df = pd.read_csv(DATASET_PATH)
        except:
             df = pd.read_csv(DATASET_PATH, encoding='latin-1')

        # Normalize column names
        df.columns = [c.lower().strip() for c in df.columns]
        
        # Identify URL and Label columns
        url_col = 'url' if 'url' in df.columns else next((col for col in df.columns if 'url' in col), None)
        label_col = 'phishing' if 'phishing' in df.columns else next((col for col in df.columns if 'label' in col or 'class' in col or 'status' in col), None)
        
        if not url_col or not label_col:
            print("Could not identify 'url' and 'label' columns. Please rename them in the CSV.")
            print(f"Columns found: {df.columns}")
            return

        print(f"Training on {len(df)} records using columns: {url_col}, {label_col}")
        
        # Text/Features and Labels
        X = df[url_col].astype(str)
        y = df[label_col]
        
        # Split Data (Optional, but good for validation)
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        print("Training Random Forest Model (this may take a while)...")
        
        # Create Pipeline
        # ngram_range=(1,2) helps capture specific sub-patterns in URLs
        pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(stop_words='english', ngram_range=(1,1), max_features=5000)),
            ('clf', RandomForestClassifier(n_estimators=50, n_jobs=-1, random_state=42))
        ])
        
        pipeline.fit(X_train, y_train)
        
        # Validation score
        accuracy = pipeline.score(X_test, y_test)
        print(f"Model Accuracy: {accuracy:.2f}")
        
        # Save
        joblib.dump(pipeline, MODEL_PATH)
        print(f"Model saved to {MODEL_PATH}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    train()

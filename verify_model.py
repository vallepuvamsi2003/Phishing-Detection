
import joblib
import os

model_path = "app/ml/phishing_model.joblib"

if os.path.exists(model_path):
    print(f"Model found at {model_path}")
    try:
        model = joblib.load(model_path)
        print("Model loaded successfully.")
        res = model.predict(["https://google.com"])
        print(f"Prediction for google.com: {res[0]}")
    except Exception as e:
        print(f"Error loading model: {e}")
else:
    print("Model not found.")

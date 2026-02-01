
import requests
import os


url = "https://raw.githubusercontent.com/phishing-ml/phishing-ml/main/phishing_site_urls.csv"

output_path = "datasets/phishing_urls.csv"

def download_file():
    print(f"Downloading {url}...")
    try:
        if not os.path.exists("datasets"):
            os.makedirs("datasets")
            
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        with open(output_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Download complete: {output_path}")
    except Exception as e:
        print(f"Download failed: {e}")

if __name__ == "__main__":
    download_file()


import joblib
import os
import pandas as pd
import re
from datetime import datetime
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline

class PhishingDetector:
    def __init__(self):
        self.model_path = "app/ml/phishing_model_v6.joblib"
        
        # --- DOMAIN & URL-BASED PATTERNS ---
        self.suspicious_tlds = ['.ml', '.cf', '.tk', '.ga', '.icu', '.cc', '.xyz', '.vip', '.top', '.click']
        self.free_hosting = ['github.io', 'vercel.app', 'netlify.app', 'pages.dev', 'weebly.com', 'gitbook.io', 'wixsite.com']
        self.cloud_tunneling = ['trycloudflare.com', 'ngrok.io', 'ngrok-free.app', 'replit.app']
        self.shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'surl.li', 'u.to', 'kutt.it']
        
        # --- TRUSTED BRANDS ---
        self.trusted_brands = ['google', 'microsoft', 'amazon', 'apple', 'netflix', 'paypal', 'facebook', 'instagram', 'linkedin', 'bankofamerica', 'chase', 'wellsfargo', 'roblox']
        
        self.model = None
        self._load_or_train_model()

    def _load_or_train_model(self):
        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
                print("Loaded ML model v6.")
            except:
                self._train_model()
        else:
            self._train_model()

    def _train_model(self):
        data = [
            ("Your account has been compromised. Reset password.", "phishing"),
            ("Win a free iPhone now!", "phishing"),
            ("Urgent: Update your banking details.", "phishing"),
            ("PayPal: transaction failed. Login.", "phishing"),
            ("Account suspended due to unusual activity.", "phishing"),
            ("Meeting scheduled for tomorrow at 10 AM.", "legitimate"),
            ("Here is the project report.", "legitimate"),
            ("Your Amazon order has been shipped.", "legitimate")
        ]
        df = pd.DataFrame(data, columns=["text", "label"])
        self.model = Pipeline([
            ('tfidf', TfidfVectorizer(stop_words='english')),
            ('clf', RandomForestClassifier(n_estimators=100, random_state=42))
        ])
        self.model.fit(df['text'], df['label'])
        joblib.dump(self.model, self.model_path)
        print("Model v6 trained.")

    def _analyze_url(self, url):
        url = url.lower()
        indicators = []
        score = 0
        
        # 1. Look-alike or typo-squatted domains
        typo_patterns = {'paypaI': 'paypal', 'micr0soft': 'microsoft', 'robloxt': 'roblox', 'g00gle': 'google'}
        for typo in typo_patterns:
            if typo in url:
                indicators.append(f"Typo-squatting detected ({typo})")
                score += 55

        # 2. Suspicious TLDs
        if any(url.endswith(tld) or tld + '/' in url for tld in self.suspicious_tlds):
            indicators.append(f"Suspicious/Abuse-prone TLD ({url.split('.')[-1].split('/')[0]})")
            score += 35

        # 3. Free Hosting / Disposable Services
        if any(service in url for service in self.free_hosting):
            indicators.append("Free/Disposable hosting service (github.io, vercel, etc.)")
            score += 30
            
        # 4. Cloud Tunneling
        if any(tunnel in url for tunnel in self.cloud_tunneling):
            indicators.append("Cloud tunneling / Temporary host (ngrok, cloudflare)")
            score += 45

        # 5. IP-based URLs
        if re.search(r'https?://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', url):
            indicators.append("Unsafe IP-based URL detected")
            score += 50

        # 6. Excessive/Misleading Subdomains
        domain_match = re.search(r'https?://(?:www\.)?([^/]+)', url)
        if domain_match:
            domain = domain_match.group(1)
            if domain.count('.') > 3:
                indicators.append("Excessive/Misleading subdomains")
                score += 35
            
            # 7. Brand Mismatch
            for brand in self.trusted_brands:
                if brand in domain and brand not in domain.split('.')[-2]:
                    indicators.append(f"Mismatched brand vs domain ({brand} impersonation)")
                    score += 50

        # 8. URL Shorteners
        if any(short in url for short in self.shorteners):
            indicators.append("URL shortener/redirect masking")
            score += 25

        # 9. Path Patterns (Login, Verification, Wallet)
        if re.search(r'/(login|signin|verify|secure|auth|otp|wallet|pay)', url):
            indicators.append("Sensitive path detected (/login, /otp, etc.)")
            score += 20

        # 10. Query Patterns
        if re.search(r'(\?|&)(token=|session=|verify=|redirect=)', url):
            indicators.append("Encoded/Obfuscated query parameters")
            score += 15
            
        # 11. Long URLs
        if len(url) > 120:
            indicators.append("Unusually long URL hiding intent")
            score += 15

        return score, indicators

    def _analyze_text(self, text):
        text = text.lower()
        indicators = []
        score = 0
        
        # 1. Urgency & Pressure
        if any(p in text for p in ['urgent', 'act now', 'verify immediately', 'last warning', '24 hours']):
            indicators.append("Urgency/Pressure language detected")
            score += 35
            
        # 2. Fear-based Threats
        if any(p in text for p in ['account suspended', 'access blocked', 'legal action', 'unauthorized access']):
            indicators.append("Fear-based threat / Action warning")
            score += 40
            
        # 3. Reward / Bait / Prize
        if any(p in text for p in ['you won', 'free reward', 'exclusive access', 'giveaway', 'prize', 'claim now']):
            indicators.append("Reward/Prize/Giveaway bait")
            score += 35
            
        # 4. Sensitive Information Requests
        if any(p in text for p in ['password', 'otp', 'pin', 'cvv', 'recovery code', 'seed phrase', 'social security']):
            indicators.append("Request for sensitive credentials (OTP/PIN)")
            score += 50
            
        return score, indicators

    def predict(self, content, sender="", content_type="url"):
        # Primary: ML Model
        ml_probs = self.model.predict_proba([content])[0]
        ml_prob_phishing = ml_probs[list(self.model.classes_).index('phishing')]
        ml_confidence = float(ml_prob_phishing)

        # Secondary: Reasoning
        reasoning_score = 0
        all_indicators = []
        
        urls_in_content = re.findall(r'(https?://[^\s]+)', content)
        if content_type == "url" or (content_type != "url" and urls_in_content):
            target = content if content_type == "url" else (urls_in_content[0] if urls_in_content else "")
            if target:
                u_score, u_ind = self._analyze_url(target)
                reasoning_score += u_score
                all_indicators.extend(u_ind)

        t_score, t_ind = self._analyze_text(content)
        reasoning_score += t_score
        all_indicators.extend(t_ind)
            
        # Dynamic Confidence Adjustment
        num_indicators = len(set(all_indicators))
        adjustment = 0
        if num_indicators >= 2:
            adjustment += 0.25 # Significant pattern overlap
        elif num_indicators == 0:
            adjustment -= 0.15 # Ambiguous/Weak

        normalized_reasoning = min(1.0, reasoning_score / 120.0)
        final_score = (0.6 * ml_confidence) + (0.4 * normalized_reasoning) + adjustment
        final_score = max(0, min(1, final_score))
        
        verdict = "PHISHING" if final_score > 0.45 else "SAFE"
        risk_level = "High" if final_score > 0.7 else ("Medium" if final_score > 0.35 else "Low")
        
        return {
            "verdict": verdict,
            "risk_level": risk_level,
            "risk_score": int(final_score * 100),
            "ml_signal": round(ml_confidence, 2),
            "reasoning_signal": round(normalized_reasoning, 2),
            "indicators": list(set(all_indicators))[:4],
            "action": "Block Automatically" if final_score > 0.8 else ("Warn User" if final_score > 0.4 else "Allow"),
            "threat_type": content_type.capitalize() + (" + URL" if urls_in_content and content_type != "url" else "")
        }

phishing_detector = PhishingDetector()

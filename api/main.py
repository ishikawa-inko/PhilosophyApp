from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import requests

# .envファイルからAPIキーを読み込む
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

app = FastAPI()

# CORS設定（Reactからのアクセスを許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 必要に応じて制限してもOK
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gemini APIとやりとりするエンドポイント
@app.post("/gemini")
async def chat_with_gemini(request: Request):
    body = await request.json()
    prompt = body.get("prompt", "")

    url = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent"
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }

    try:
        response = requests.post(f"{url}?key={API_KEY}", headers=headers, json=data)
        response.raise_for_status()
        print("✅ Geminiの返答:", response.json())
        return response.json()
    except Exception as e:
        print("❌ エラーが発生:", e)
        return {"error": str(e)}

# モデル一覧を確認できるエンドポイント（デバッグ用）
@app.get("/models")
def get_models():
    url = "https://generativelanguage.googleapis.com/v1/models"
    headers = {"Content-Type": "application/json"}
    try:
        response = requests.get(f"{url}?key={API_KEY}", headers=headers)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": str(e)}

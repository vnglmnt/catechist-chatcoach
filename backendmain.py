from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import json
from datetime import datetime

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

def init_db():
    conn = sqlite3.connect('catechist.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS chat_history
                 (id INTEGER PRIMARY KEY, message TEXT, response TEXT, timestamp TEXT)''')
    conn.commit()
    conn.close()

init_db()

@app.get("/")
def root():
    return {"app": "Catechist ChatCoach", "status": "running"}

@app.post("/api/chat")
def chat(message: dict):
    user_msg = message.get("message", "").lower()
    
    responses = {
        "trinity": "The Trinity is one God in three Persons: Father, Son, Holy Spirit. For kids: Like water (ice, liquid, steam) - same substance, different forms.",
        "eucharist": "The Eucharist is Jesus' body and blood. Source: CCC 1324.",
        "prayer": "Prayer is raising heart and mind to God. CCC 2559.",
        "default": "I'm your Catholic teaching assistant. Ask about: Trinity, Eucharist, Prayer, Sacraments."
    }
    
    response = responses["default"]
    for key in responses:
        if key in user_msg:
            response = responses[key]
            break
    
    conn = sqlite3.connect('catechist.db')
    c = conn.cursor()
    c.execute("INSERT INTO chat_history (message, response, timestamp) VALUES (?, ?, ?)",
              (user_msg, response, datetime.now().isoformat()))
    conn.commit()
    conn.close()
    
    return {"response": response, "sources": ["CCC 2559"]}

if __name__ == "__main__":
    import uvicorn
    print("Server: http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
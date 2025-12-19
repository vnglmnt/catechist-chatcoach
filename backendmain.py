"""
Catechist ChatCoach - Backend Server
Simple FastAPI server with mock AI responses
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import sqlite3
import json
from datetime import datetime
import logging

# Setup
app = FastAPI(title="Catechist ChatCoach API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database setup
def init_db():
    conn = sqlite3.connect('catechist.db')
    cursor = conn.cursor()
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT,
        name TEXT,
        created_at TIMESTAMP
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS lessons (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        title TEXT,
        topic TEXT,
        age_group TEXT,
        duration INTEGER,
        objectives TEXT,
        activities TEXT,
        prayer TEXT,
        created_at TIMESTAMP
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS chat_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        message TEXT,
        response TEXT,
        timestamp TIMESTAMP
    )
    ''')
    
    conn.commit()
    conn.close()
    logger.info("Database initialized")

init_db()

# Models
class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = "demo_user"

class LessonRequest(BaseModel):
    topic: str
    age_group: str = "teens"
    duration_minutes: int = 60
    user_id: Optional[str] = "demo_user"

class UserRequest(BaseModel):
    name: str
    email: Optional[str] = None

# Catholic knowledge base
CATHOLIC_RESPONSES = {
    "trinity": {
        "answer": "The Trinity is one God in three Persons: Father, Son, and Holy Spirit. They are distinct but not separate, equal in divinity, and one in essence.",
        "sources": ["CCC 232-267", "John 14:26", "Matthew 28:19"],
        "teaching_tip": "For children: Use the analogy of water (ice, liquid, steam) - same substance, different forms."
    },
    "eucharist": {
        "answer": "The Eucharist is the body, blood, soul, and divinity of Jesus Christ under the appearances of bread and wine. It is the source and summit of Christian life.",
        "sources": ["CCC 1322-1419", "John 6:51", "1 Corinthians 11:23-26"],
        "teaching_tip": "Emphasize that it's not just a symbol but truly Jesus present."
    },
    "prayer": {
        "answer": "Prayer is the raising of one's heart and mind to God. It includes vocal prayer, meditation, and contemplative prayer.",
        "sources": ["CCC 2558-2565", "Matthew 6:6", "1 Thessalonians 5:17"],
        "teaching_tip": "Teach the ACTS method: Adoration, Contrition, Thanksgiving, Supplication."
    },
    "sacraments": {
        "answer": "The seven sacraments are: Baptism, Confirmation, Eucharist, Reconciliation, Anointing of the Sick, Holy Orders, and Matrimony. They are efficacious signs of grace.",
        "sources": ["CCC 1113-1134", "Catechism Part Two"],
        "teaching_tip": "Group them: Sacraments of Initiation, Healing, and Service."
    },
    "commandments": {
        "answer": "The Ten Commandments: 1. Worship God alone 2. Don't misuse God's name 3. Keep Sabbath holy 4. Honor parents 5. Don't kill 6. Don't commit adultery 7. Don't steal 8. Don't lie 9. Don't covet spouse 10. Don't covet possessions.",
        "sources": ["Exodus 20:1-17", "Deuteronomy 5:6-21", "CCC 2052-2557"],
        "teaching_tip": "For children: Simplify to 'Love God, love others'."
    }
}

@app.get("/")
def root():
    return {
        "app": "Catechist ChatCoach",
        "version": "1.0.0",
        "status": "running",
        "message": "AI Teaching Assistant for Catholic Catechists"
    }

@app.get("/api/health")
def health():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/chat")
def chat_endpoint(request: ChatRequest):
    """Main chat endpoint with Catholic AI mentor"""
    user_message = request.message.lower()
    user_id = request.user_id
    
    logger.info(f"Chat request: {user_message[:50]}...")
    
    # Find best response
    response_key = "default"
    for key in CATHOLIC_RESPONSES:
        if key in user_message:
            response_key = key
            break
    
    if response_key == "default":
        response_data = {
            "answer": "I'm your Catholic teaching assistant. I can help with: Trinity, Eucharist, Prayer, Sacraments, Commandments, or lesson planning. What would you like to know?",
            "sources": ["CCC Prologue"],
            "teaching_tip": "Try asking about a specific topic like 'How do I teach the Trinity to children?'"
        }
    else:
        response_data = CATHOLIC_RESPONSES[response_key]
    
    # Log to database
    conn = sqlite3.connect('catechist.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO chat_history (user_id, message, response, timestamp)
        VALUES (?, ?, ?, ?)
    ''', (user_id, user_message, response_data["answer"], datetime.now().isoformat()))
    conn.commit()
    conn.close()
    
    return {
        "response": response_data["answer"],
        "sources": response_data["sources"],
        "teaching_tip": response_data.get("teaching_tip", ""),
        "timestamp": datetime.now().isoformat(),
        "session_id": f"sess_{datetime.now().timestamp()}"
    }

@app.post("/api/generate-lesson")
def generate_lesson(request: LessonRequest):
    """Generate a Catholic lesson plan"""
    
    # Sample activities based on age group
    age_activities = {
        "children": ["Coloring activity", "Simple story", "Action song", "Craft"],
        "teens": ["Group discussion", "Bible study", "Role play", "Media analysis"],
        "adults": ["Lecture", "Small group sharing", "Case studies", "Q&A session"]
    }
    
    activities = age_activities.get(request.age_group, ["Discussion", "Prayer", "Reflection"])
    
    lesson_plan = {
        "id": f"lesson_{datetime.now().timestamp()}",
        "title": f"Introduction to {request.topic}",
        "topic": request.topic,
        "age_group": request.age_group,
        "duration": f"{request.duration_minutes} minutes",
        "objectives": [
            f"Understand the basic concepts of {request.topic}",
            f"Apply {request.topic} teachings to daily life",
            f"Grow in appreciation for this aspect of Catholic faith"
        ],
        "materials_needed": ["Bible", "Catechism", "Whiteboard", "Handouts"],
        "lesson_flow": [
            {"time": "5 min", "activity": "Opening Prayer", "details": "Begin with Sign of Cross"},
            {"time": "10 min", "activity": "Introduction", "details": f"Introduce {request.topic}"},
            {"time": "20 min", "activity": "Main Teaching", "details": "Core content presentation"},
            {"time": "15 min", "activity": activities[0], "details": "Interactive learning"},
            {"time": "5 min", "activity": "Reflection", "details": "Personal application"},
            {"time": "5 min", "activity": "Closing Prayer", "details": "Pray together"}
        ],
        "prayer_suggestion": f"Lord, help us understand and live out your teaching about {request.topic}. Amen.",
        "reflection_questions": [
            f"What did I learn about {request.topic}?",
            f"How does {request.topic} affect my relationship with God?",
            "What's one action I can take this week?"
        ],
        "catechism_references": ["CCC 1-10", "CCC 50-73"],
        "scripture_references": ["John 3:16", "Matthew 28:19-20"],
        "created_at": datetime.now().isoformat()
    }
    
    # Save to database
    conn = sqlite3.connect('catechist.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO lessons (id, user_id, title, topic, age_group, duration, objectives, activities, prayer, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        lesson_plan["id"],
        request.user_id,
        lesson_plan["title"],
        lesson_plan["topic"],
        lesson_plan["age_group"],
        request.duration_minutes,
        json.dumps(lesson_plan["objectives"]),
        json.dumps(lesson_plan["lesson_flow"]),
        lesson_plan["prayer_suggestion"],
        lesson_plan["created_at"]
    ))
    conn.commit()
    conn.close()
    
    return lesson_plan

@app.get("/api/lessons")
def get_lessons(user_id: str = "demo_user"):
    """Get all lessons for a user"""
    conn = sqlite3.connect('catechist.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM lessons 
        WHERE user_id = ? 
        ORDER BY created_at DESC
    ''', (user_id,))
    
    rows = cursor.fetchall()
    lessons = []
    for row in rows:
        lesson = dict(row)
        # Parse JSON fields
        for field in ['objectives', 'activities']:
            if lesson.get(field):
                lesson[field] = json.loads(lesson[field])
        lessons.append(lesson)
    
    conn.close()
    return {"lessons": lessons, "count": len(lessons)}

@app.post("/api/user")
def create_user(request: UserRequest):
    """Create or get user"""
    user_id = f"user_{datetime.now().timestamp()}"
    
    conn = sqlite3.connect('catechist.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO users (id, email, name, created_at)
        VALUES (?, ?, ?, ?)
    ''', (user_id, request.email, request.name, datetime.now().isoformat()))
    
    conn.commit()
    conn.close()
    
    return {
        "user_id": user_id,
        "name": request.name,
        "email": request.email,
        "created_at": datetime.now().isoformat(),
        "message": "User created successfully"
    }

if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*50)
    print("CATHOLIC CHATCOACH BACKEND")
    print("="*50)
    print("Server starting on http://localhost:8000")
    print("Test endpoints:")
    print("  • GET  http://localhost:8000/")
    print("  • POST http://localhost:8000/api/chat")
    print("  • POST http://localhost:8000/api/generate-lesson")
    print("="*50 + "\n")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
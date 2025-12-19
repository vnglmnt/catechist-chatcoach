"""
Optional AI integration with Ollama
Only use if you install Ollama first
"""
import requests
import json

class CatholicAIAssistant:
    def __init__(self):
        self.ollama_url = "http://localhost:11434/api/generate"
        
    def get_response(self, question, context=""):
        """Get AI response with Catholic context"""
        
        prompt = f"""You are a faithful Catholic catechist assistant. 
        Provide answers based ONLY on:
        - Catechism of the Catholic Church
        - Sacred Scripture (NABRE)
        - Vatican II Documents
        - Church Fathers
        
        If unsure, say "I recommend consulting the Catechism paragraph [number]"
        
        User Question: {question}
        
        Context: {context}
        
        Provide a faithful, accurate answer suitable for catechists:"""
        
        try:
            response = requests.post(self.ollama_url, json={
                "model": "llama3.1:8b",  # Or any model you have
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.3,  # Lower = more conservative
                    "top_p": 0.9
                }
            }, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                return {
                    "answer": result.get("response", "I apologize, I couldn't generate a response."),
                    "model": result.get("model", "unknown"),
                    "sources": ["AI-generated based on Catholic sources"]
                }
            else:
                return {
                    "answer": "AI service is unavailable. Please try the pre-built responses.",
                    "error": f"HTTP {response.status_code}"
                }
                
        except Exception as e:
            return {
                "answer": "AI service not running. Please install Ollama or use mock responses.",
                "error": str(e)
            }

# Usage example
if __name__ == "__main__":
    ai = CatholicAIAssistant()
    test = ai.get_response("How do I explain the Trinity to children?")
    print(test["answer"])
from fastapi import FastAPI
from fastapi.responses import HTMLResponse, PlainTextResponse
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI(title="HotMessCoach")

class ChatRequest(BaseModel):
    message: str

@app.get("/", response_class=HTMLResponse)
def index():
    return """
    <h2>HotMessCoach API</h2>
    <p>POST a JSON body to <code>/chat</code>:</p>
    <pre>{
  "message": "I feel like a hot mess today..."
}</pre>
    <p>Or open <a href="/docs">/docs</a> for interactive Swagger UI.</p>
    """

@app.get("/favicon.ico")
def favicon():
    return PlainTextResponse("", status_code=204)

@app.post("/chat")
def chat(req: ChatRequest):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a supportive mental coach who helps overwhelmed people feel calmer."},
            {"role": "user", "content": req.message},
        ]
    )
    return {"reply": response.choices[0].message.content}

#uv run uvicorn STEP1_app_llm:app --reload --host 0.0.0.0 --port 8000
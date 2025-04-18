from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel # Import BaseModel from Pydantic

# Define a Pydantic model for the request body
class ChatRequest(BaseModel):
    message: str

app = FastAPI()

# Define allowed origins (adjust port if your React app uses a different one)
origins = [
    "http://localhost",
    "http://localhost:3000", # Default for Create React App
    "http://127.0.0.1",
    "http://127.0.0.1:3000",
]

# Add CORS middleware to the application
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # Allow specific origins
    allow_credentials=True, # Allow cookies
    allow_methods=["*"],    # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],    # Allow all headers
)

@app.get("/")
async def read_root():
    return {"message": "Hello World from the Agent Backend!"}

# New endpoint to handle chat messages
@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    # For now, just acknowledge receipt and echo the message
    # In the future, this is where the agent logic (using ADK) will go
    print(f"Received message: {request.message}") # Log to backend console
    response_message = f"Agent received: {request.message}"
    return {"sender": "agent", "text": response_message} 
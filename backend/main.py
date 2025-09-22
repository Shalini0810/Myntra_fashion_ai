# # # from fastapi import FastAPI
# # # from routers import tryon
# # # from fastapi.middleware.cors import CORSMiddleware

# # # app = FastAPI()

# # # # Allow frontend to connect
# # # app.add_middleware(
# # #     CORSMiddleware,
# # #     allow_origins=["*"],  # or ["http://localhost:3000"] for React
# # #     allow_credentials=True,
# # #     allow_methods=["*"],
# # #     allow_headers=["*"],
# # # )

# # # app.include_router(tryon.router, prefix="/api")




# # from fastapi import FastAPI
# # from fastapi.middleware.cors import CORSMiddleware
# # from routers import tryon, styling  # Add styling import
# # import os
# # from dotenv import load_dotenv

# # # Load environment variables
# # load_dotenv()

# # app = FastAPI(title="AI Virtual Try-On API", version="1.0.0")

# # # CORS middleware
# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )

# # # Include routers
# # app.include_router(tryon.router)
# # app.include_router(styling.router)  # Add this line

# # @app.get("/")
# # async def root():
# #     return {"message": "AI Virtual Try-On API is running!"}

# # if __name__ == "__main__":
# #     import uvicorn
# #     uvicorn.run(app, host="0.0.0.0", port=8000)


# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from routers import tryon, styling
# import os
# from dotenv import load_dotenv

# # Load environment variables
# load_dotenv()

# app = FastAPI(title="AI Virtual Try-On API", version="1.0.0")

# # CORS middleware - MUST be added before including routers
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:3000", 
#         "http://127.0.0.1:3000", 
#         "http://localhost:5173", 
#         "http://127.0.0.1:5173",
#         "http://localhost:8080",
#         "http://127.0.0.1:8080"
#     ],
#     allow_credentials=True,
#     allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
#     allow_headers=["*"],
# )

# # Include routers with proper prefixes
# app.include_router(tryon.router, prefix="/api")
# app.include_router(styling.router, prefix="/api")

# @app.get("/")
# async def root():
#     return {"message": "AI Virtual Try-On API is running!", "status": "healthy"}

# @app.get("/health")
# async def health_check():
#     return {"status": "healthy", "message": "Server is running"}

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import tryon, styling, image_search, smart_pairing, occasion_styling
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="AI Virtual Try-On API", version="1.0.0")

# CORS middleware - MUST be added before including routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000", 
        "http://localhost:5173", 
        "http://127.0.0.1:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers with proper prefixes
app.include_router(tryon.router, prefix="/api")
app.include_router(styling.router, prefix="/api")
app.include_router(image_search.router, prefix="/api")
app.include_router(smart_pairing.router, prefix="/api")
app.include_router(occasion_styling.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "AI Virtual Try-On API is running!", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Server is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
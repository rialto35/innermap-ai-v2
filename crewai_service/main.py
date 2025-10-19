"""
CrewAI Analysis Service - Main FastAPI Application
"""

import time
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from loguru import logger
from pydantic import BaseModel, Field

from config import settings
from crew import AnalysisCrew
from models import AnalysisRequest, AnalysisResponse


# Lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    logger.info("🚀 Starting CrewAI Analysis Service...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"OpenAI Model: {settings.OPENAI_MODEL}")
    yield
    logger.info("👋 Shutting down CrewAI Analysis Service...")


# Initialize FastAPI app
app = FastAPI(
    title="CrewAI Analysis Service",
    description="AI-powered deep psychological analysis using CrewAI",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """Add processing time to response headers"""
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


# Exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "detail": str(exc) if settings.DEBUG else "An error occurred",
        },
    )


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "crewai-analysis",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
    }


# Analysis endpoint
@app.post("/analyze", response_model=AnalysisResponse)
async def analyze(request: AnalysisRequest):
    """
    Run deep psychological analysis using CrewAI
    
    Args:
        request: Analysis request containing user data
        
    Returns:
        AnalysisResponse: Comprehensive analysis results
    """
    start_time = time.time()
    
    try:
        logger.info(f"📊 Starting analysis for user: {request.userId}")
        
        # Initialize CrewAI crew
        crew = AnalysisCrew(
            big5=request.big5,
            mbti=request.mbti,
            inner9=request.inner9,
            hero=request.hero,
        )
        
        # Run analysis
        result = await crew.run()
        
        processing_time = time.time() - start_time
        logger.info(f"✅ Analysis completed in {processing_time:.2f}s")
        
        return AnalysisResponse(
            success=True,
            analysis=result,
            metadata={
                "model": settings.OPENAI_MODEL,
                "crewVersion": "0.86.0",
                "processingTime": processing_time,
            },
        )
        
    except Exception as e:
        logger.error(f"❌ Analysis failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}",
        )


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "CrewAI Analysis Service",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
    }


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
    )


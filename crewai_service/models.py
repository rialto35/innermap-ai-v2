"""
Pydantic models for request/response validation
"""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class Big5Model(BaseModel):
    """Big5 personality scores"""
    O: float = Field(..., ge=0, le=1, description="Openness")
    C: float = Field(..., ge=0, le=1, description="Conscientiousness")
    E: float = Field(..., ge=0, le=1, description="Extraversion")
    A: float = Field(..., ge=0, le=1, description="Agreeableness")
    N: float = Field(..., ge=0, le=1, description="Neuroticism")


class Inner9Model(BaseModel):
    """Inner9 dimension scores"""
    creation: float = Field(..., ge=0, le=100)
    will: float = Field(..., ge=0, le=100)
    insight: float = Field(..., ge=0, le=100)
    sensitivity: float = Field(..., ge=0, le=100)
    growth: float = Field(..., ge=0, le=100)
    balance: float = Field(..., ge=0, le=100)
    harmony: float = Field(..., ge=0, le=100)
    expression: float = Field(..., ge=0, le=100)


class HeroModel(BaseModel):
    """Hero archetype information"""
    code: str = Field(..., description="Hero code (e.g., H-INFP-001)")
    title: str = Field(..., description="Hero title")
    tribe: Optional[str] = Field(None, description="Tribe name")


class AnalysisRequest(BaseModel):
    """Request model for analysis endpoint"""
    userId: str = Field(..., description="User ID")
    big5: Big5Model
    mbti: Optional[str] = Field(None, description="MBTI type (e.g., INFP)")
    inner9: Inner9Model
    hero: Optional[HeroModel] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "userId": "user-123",
                "big5": {
                    "O": 0.75,
                    "C": 0.60,
                    "E": 0.55,
                    "A": 0.70,
                    "N": 0.45,
                },
                "mbti": "INFP",
                "inner9": {
                    "creation": 75,
                    "will": 60,
                    "insight": 80,
                    "sensitivity": 70,
                    "growth": 65,
                    "balance": 55,
                    "harmony": 60,
                    "expression": 75,
                },
                "hero": {
                    "code": "H-INFP-001",
                    "title": "몽상가",
                    "tribe": "dras",
                },
            }
        }


class AnalysisResult(BaseModel):
    """Analysis result model"""
    summary: str = Field(..., description="Overall personality summary")
    strengths: List[str] = Field(..., description="Key strengths")
    weaknesses: List[str] = Field(..., description="Areas for growth")
    growthAdvice: str = Field(..., description="Personalized growth advice")
    relationships: str = Field(..., description="Relationship patterns and advice")
    career: str = Field(..., description="Career recommendations")
    
    class Config:
        json_schema_extra = {
            "example": {
                "summary": "당신은 창의적이고 통찰력 있는 성격으로...",
                "strengths": [
                    "뛰어난 창의력과 상상력",
                    "깊은 통찰력과 직관",
                    "타인에 대한 공감 능력",
                ],
                "weaknesses": [
                    "과도한 완벽주의 경향",
                    "결정을 내리는 데 시간이 오래 걸림",
                    "스트레스 관리 필요",
                ],
                "growthAdvice": "당신의 창의력을 실제 행동으로 옮기는 연습을...",
                "relationships": "당신은 깊고 의미 있는 관계를 중시하며...",
                "career": "창의적 표현이 가능한 분야에서 강점을 발휘할 수 있습니다...",
            }
        }


class AnalysisResponse(BaseModel):
    """Response model for analysis endpoint"""
    success: bool = Field(..., description="Whether analysis succeeded")
    analysis: AnalysisResult
    metadata: Dict[str, any] = Field(
        ...,
        description="Metadata about the analysis (model, version, timing, etc.)",
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "analysis": {
                    "summary": "당신은 창의적이고 통찰력 있는 성격으로...",
                    "strengths": ["..."],
                    "weaknesses": ["..."],
                    "growthAdvice": "...",
                    "relationships": "...",
                    "career": "...",
                },
                "metadata": {
                    "model": "gpt-4o",
                    "crewVersion": "0.86.0",
                    "processingTime": 12.5,
                },
            }
        }


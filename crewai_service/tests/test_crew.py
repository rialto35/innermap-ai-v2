"""
Tests for CrewAI Analysis Crew
"""

import pytest
from crew import AnalysisCrew
from models import Big5Model, Inner9Model, HeroModel


@pytest.fixture
def sample_big5():
    """Sample Big5 data"""
    return Big5Model(O=0.75, C=0.60, E=0.55, A=0.70, N=0.45)


@pytest.fixture
def sample_inner9():
    """Sample Inner9 data"""
    return Inner9Model(
        creation=75,
        will=60,
        insight=80,
        sensitivity=70,
        growth=65,
        balance=55,
        harmony=60,
        expression=75,
    )


@pytest.fixture
def sample_hero():
    """Sample Hero data"""
    return HeroModel(code="H-INFP-001", title="몽상가", tribe="dras")


@pytest.mark.asyncio
async def test_analysis_crew_initialization(sample_big5, sample_inner9, sample_hero):
    """Test AnalysisCrew initialization"""
    crew = AnalysisCrew(
        big5=sample_big5,
        mbti="INFP",
        inner9=sample_inner9,
        hero=sample_hero,
    )
    
    assert crew.big5 == sample_big5
    assert crew.mbti == "INFP"
    assert crew.inner9 == sample_inner9
    assert crew.hero == sample_hero
    assert crew.personality_analyst is not None
    assert crew.growth_advisor is not None
    assert crew.relationship_expert is not None
    assert crew.career_consultant is not None
    assert crew.report_writer is not None


@pytest.mark.asyncio
async def test_prepare_context(sample_big5, sample_inner9, sample_hero):
    """Test context preparation"""
    crew = AnalysisCrew(
        big5=sample_big5,
        mbti="INFP",
        inner9=sample_inner9,
        hero=sample_hero,
    )
    
    context = crew._prepare_context()
    
    assert "Big5 성격 점수" in context
    assert "개방성 (O): 0.75" in context
    assert "MBTI 유형: INFP" in context
    assert "Inner9 차원 점수" in context
    assert "창조 (Creation): 75.0" in context
    assert "영웅 원형: 몽상가" in context


@pytest.mark.asyncio
@pytest.mark.slow
async def test_full_analysis(sample_big5, sample_inner9, sample_hero):
    """Test full analysis execution (slow test)"""
    crew = AnalysisCrew(
        big5=sample_big5,
        mbti="INFP",
        inner9=sample_inner9,
        hero=sample_hero,
    )
    
    result = await crew.run()
    
    assert result.summary is not None
    assert len(result.summary) > 0
    assert isinstance(result.strengths, list)
    assert len(result.strengths) > 0
    assert isinstance(result.weaknesses, list)
    assert len(result.weaknesses) > 0
    assert result.growthAdvice is not None
    assert result.relationships is not None
    assert result.career is not None


@pytest.mark.asyncio
async def test_analysis_without_optional_fields(sample_big5, sample_inner9):
    """Test analysis without MBTI and Hero"""
    crew = AnalysisCrew(
        big5=sample_big5,
        mbti=None,
        inner9=sample_inner9,
        hero=None,
    )
    
    context = crew._prepare_context()
    
    assert "Big5 성격 점수" in context
    assert "MBTI 유형" not in context
    assert "영웅 원형" not in context


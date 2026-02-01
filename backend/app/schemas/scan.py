
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ScanBase(BaseModel):
    content: str
    content_type: str  # 'url' or 'text'

class ScanCreate(ScanBase):
    pass

class ScanResult(ScanBase):
    id: str
    user_id: Optional[str] = None
    result_class: str
    confidence: float
    details: str
    created_at: datetime

    class Config:
        from_attributes = True

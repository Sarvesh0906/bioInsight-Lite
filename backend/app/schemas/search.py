from pydantic import BaseModel
from typing import Optional

class SearchQuery(BaseModel):
    molwt_min: Optional[float] = None
    molwt_max: Optional[float] = None
    logp_min: Optional[float] = None
    logp_max: Optional[float] = None
    psa_max: Optional[float] = None
    is_active: Optional[int] = None
    nlq: Optional[str] = None

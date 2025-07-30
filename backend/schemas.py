from pydantic import BaseModel, field_validator, model_validator
from typing import Dict, List, Literal

ValidFace = Literal['U', 'R', 'F', 'D', 'L', 'B']
ValidColor = Literal['white', 'yellow', 'green', 'blue', 'red', 'orange']

class SolveRequest(BaseModel):
    faces: Dict[ValidFace, List[ValidColor]]
    size: int = 3

    @field_validator('size')
    @classmethod
    def check_supported_size(cls, v):
        if v not in [2, 3]:
            raise ValueError("Only 2x2 and 3x3 cubes are supported.")
        return v

    @model_validator(mode='after')
    def validate_faces(self):
        faces = self.faces
        size = self.size
        expected_len = 4 if size == 2 else 9

        if faces is None or len(faces) != 6:
            raise ValueError("Exactly 6 faces (U, R, F, D, L, B) must be provided.")

        for face, stickers in faces.items():
            if len(stickers) != expected_len:
                raise ValueError(f"Face '{face}' must contain exactly {expected_len} color values.")

        return self

import os
import uuid
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from cv_processing import process_face_image, recognize_colors
from cube_solver import Cube3x3, Cube2x2
from schemas import SolveRequest

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("temp_images", exist_ok=True)

COLOR_MAPPING = {
    'white': 'U',
    'yellow': 'D',
    'green': 'F',
    'blue': 'B',
    'red': 'R',
    'orange': 'L'
}

def create_cube_state(scan_data):
    face_order = ['U', 'R', 'F', 'D', 'L', 'B']
    kociemba_string = ""
    for face in face_order:
        for color in scan_data[face]:
            if color not in COLOR_MAPPING:
                raise HTTPException(400, f"Unrecognized color '{color}' in face '{face}'")
            kociemba_string += COLOR_MAPPING[color]
    return kociemba_string

@app.post("/process-face")
async def process_face(face: str = Form(...), file: UploadFile = File(...)):
    if face not in ['U', 'R', 'F', 'D', 'L', 'B']:
        raise HTTPException(400, "Invalid face specified")

    file_ext = os.path.splitext(file.filename)[1]
    temp_path = f"temp_images/{uuid.uuid4()}{file_ext}"

    with open(temp_path, "wb") as f:
        f.write(await file.read())

    try:
        grid, processed_img = process_face_image(temp_path)
        colors = recognize_colors(grid)

        center = colors[4]
        if any(colors[i] == center for i in [0, 1, 2, 3, 5, 6, 7, 8]):
            raise HTTPException(400, "Center color must be unique and not appear on other tiles")

        return {
            "face": face,
            "colors": colors,
            "processed_image": processed_img.tolist() if processed_img is not None else None
        }

    except Exception as e:
        raise HTTPException(500, f"Processing error: {str(e)}")

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/solve-cube")
async def solve_cube(request: SolveRequest):
    try:
        cube_size = request.size

        # ✅ Check that all 6 face centers are unique
        centers = [request.faces[face][4] for face in ['U', 'R', 'F', 'D', 'L', 'B']]
        if len(set(centers)) != 6:
            raise HTTPException(400, "Duplicate center colors found across faces")

        # 🧠 Now it's safe to convert to internal cube state
        state_str = create_cube_state(request.faces)

        # 🧊 Choose cube class based on size
        if cube_size == 2:
            cube = Cube2x2(state_str)
        else:
            cube = Cube3x3(state_str)

        # ✅ Validate logical correctness of cube state
        if not cube.is_valid():
            raise HTTPException(400, "Invalid cube state")

        # 🧩 Solve the cube
        solution = cube.solve()

        return {
            "solution": solution["moves"],
            "stats": solution["stats"],
            "state_after_phase1": solution.get("state_after_phase1", ""),
            "state_after_phase2": solution.get("state_after_phase2", "")
        }

    except Exception as e:
        raise HTTPException(500, f"Solving error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

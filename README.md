# Rubik's Cube Solver with Computer Vision

A hackathon project that solves 3x3 and 2x2 Rubik's cubes using computer vision for input and a two-phase solving algorithm.

## 🎯 Project Overview

This project implements a complete Rubik's Cube solver with the following features:

- **Computer Vision Input**: Capture cube faces using your camera
- **Two-Phase Solving Algorithm**: Efficient solving using Kociemba-inspired approach
- **3D Visualization**: Interactive 3D cube display with solution animation
- **Support for 2x2 and 3x3 cubes**: Scalable architecture
- **Real-time Processing**: Fast API backend with React frontend

## 🏗️ Architecture

```
RubixCubeProject/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # API endpoints
│   │   ├── cv_processing.py # Computer vision
│   │   ├── cube_solver.py  # Solving algorithm
│   │   ├── schemas.py      # Data models
│   │   └── pattern_db.py   # Move patterns
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main app
│   │   └── components/
│   │       ├── CubeScanner.jsx    # Camera input
│   │       ├── Cube3D.jsx         # 3D visualization
│   │       ├── CubeDisplay.jsx    # 2D display
│   │       └── SolutionView.jsx   # Solution viewer
│   └── package.json       # Node dependencies
└── README.md
```

## 🚀 Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the backend server:**
   ```bash
   cd app
   python main.py
   ```
   
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

## 📱 How to Use

### 1. Scanning the Cube

1. **Start the application** and click "Start Camera"
2. **Hold the cube** with the white face (U) facing the camera
3. **Click "Capture"** to process the face
4. **Rotate the cube** to show each face in this order:
   - U (White) → F (Green) → R (Red) → B (Blue) → L (Orange) → D (Yellow)
5. **Capture each face** until all 6 faces are scanned

### 2. Solving the Cube

1. **Review the scanned state** in the 2D and 3D displays
2. **Click "Solve Cube"** to generate the solution
3. **View the solution** with step-by-step moves
4. **Use the controls** to:
   - Play/pause the solution animation
   - Step through moves manually
   - Reset to the beginning

## 🧠 Algorithm Details

### Two-Phase Solving

The solver uses a two-phase approach inspired by Kociemba's algorithm:

1. **Phase 1**: Reduce the cube to a subgroup where all edges are oriented correctly
2. **Phase 2**: Solve the cube using only moves from this subgroup

### Computer Vision

- **Color Detection**: Uses HSV color space for robust color recognition
- **Perspective Correction**: Automatically corrects for camera angle
- **Grid Extraction**: Divides each face into 9 (3x3) or 4 (2x2) cells
- **Validation**: Ensures center colors are unique and valid

### Move Notation

- **U, D, L, R, F, B**: Clockwise face turns
- **U', D', L', R', F', B'**: Counter-clockwise face turns  
- **U2, D2, L2, R2, F2, B2**: 180-degree face turns

## 🔧 Technical Features

### Backend (FastAPI)
- **RESTful API** with automatic documentation
- **Computer Vision** using OpenCV
- **Two-phase solving algorithm**
- **Input validation** and error handling
- **CORS support** for frontend integration

### Frontend (React + Three.js)
- **Real-time camera capture**
- **3D cube visualization** with Three.js
- **Solution animation** with step-by-step playback
- **Responsive design** with Tailwind CSS
- **Interactive controls** for solution navigation

## 🎨 Hackathon Features

### Problem-Solving Approach
- **Modular design** with clear separation of concerns
- **State representation** using string-based encoding
- **Move tables** for efficient state transitions
- **Heuristic functions** for guided search

### Data Structures
- **String-based state representation** (54 chars for 3x3, 24 for 2x2)
- **Move tables** as permutation arrays
- **Pattern database** for common configurations
- **Efficient search** using IDA* algorithm

### Algorithm Efficiency
- **Two-phase approach** reduces search space
- **Heuristic functions** guide the search
- **Move pruning** eliminates redundant sequences
- **Time complexity**: O(n²) where n is the number of moves

### Bonus Features
- **3D visualization** with Three.js
- **Computer vision input** for real-world interaction
- **Scalable architecture** supporting multiple cube sizes
- **Real-time solution animation**

## 🐛 Troubleshooting

### Common Issues

1. **Camera not working**: Ensure camera permissions are granted
2. **Color detection errors**: Improve lighting and hold cube steady
3. **Backend connection**: Check if backend is running on port 8000
4. **3D visualization issues**: Ensure WebGL is supported in your browser

### Performance Tips

1. **Good lighting** for better color detection
2. **Steady camera** when capturing faces
3. **Clear background** to avoid interference
4. **High contrast** between cube colors

## 🚀 Future Enhancements

- [ ] **4x4 and larger cube support**
- [ ] **Blindfolded solving mode**
- [ ] **Solution optimization** for fewer moves
- [ ] **Machine learning** for better color detection
- [ ] **Mobile app** with native camera integration
- [ ] **Multi-language support** for move notation

## 📄 License

This project was created for hackathon purposes. Feel free to use and modify as needed.

## 🤝 Contributing

This is a hackathon project, but suggestions and improvements are welcome!

---

**Happy Solving! 🧩** 
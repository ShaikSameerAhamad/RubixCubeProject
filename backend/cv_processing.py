import cv2
import numpy as np
from sklearn.cluster import KMeans

COLOR_MAP = {
    'white': [255, 255, 255],
    'yellow': [255, 255, 0],
    'green': [0, 128, 0],
    'blue': [0, 0, 255],
    'red': [255, 0, 0],
    'orange': [255, 165, 0]
}

# HSV color ranges for better color detection
COLOR_HSV_RANGES = {
    'white': ([0, 0, 200], [180, 30, 255]),
    'yellow': ([20, 100, 100], [30, 255, 255]),
    'green': ([35, 100, 100], [85, 255, 255]),
    'blue': ([100, 100, 100], [130, 255, 255]),
    'red': ([0, 100, 100], [10, 255, 255]),  # Lower red
    'orange': ([10, 100, 100], [20, 255, 255])
}

def process_face_image(image_path):
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not read image at {image_path}")
        
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Preprocessing
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        raise ValueError("No contours found in image.")

    largest_contour = max(contours, key=cv2.contourArea)
    rect = cv2.minAreaRect(largest_contour)
    box = cv2.boxPoints(rect)
    box = box.astype(np.int32)

    # Perspective correction
    width, height = 300, 300
    src_pts = box.astype("float32")
    dst_pts = np.array([[0, height - 1], [0, 0], [width - 1, 0], [width - 1, height - 1]], dtype="float32")
    matrix = cv2.getPerspectiveTransform(src_pts, dst_pts)
    warped = cv2.warpPerspective(img, matrix, (width, height))

    # Grid extraction
    grid = []
    cell_size = height // 3
    for i in range(3):
        for j in range(3):
            cell = warped[i*cell_size:(i+1)*cell_size, j*cell_size:(j+1)*cell_size]
            grid.append(cell)

    return grid, warped

def recognize_colors(grid_images):
    recognized = []
    for cell in grid_images:
        # Convert to HSV for better color detection
        cell_hsv = cv2.cvtColor(cell, cv2.COLOR_RGB2HSV)
        
        # Get dominant color using both RGB and HSV methods
        avg_color_rgb = np.mean(cell, axis=(0, 1))
        avg_color_hsv = np.mean(cell_hsv, axis=(0, 1))
        
        min_dist = float('inf')
        color_name = 'unknown'
        confidence = 0

        # Try HSV-based detection first (more reliable)
        for name, (lower, upper) in COLOR_HSV_RANGES.items():
            if (lower[0] <= avg_color_hsv[0] <= upper[0] and
                lower[1] <= avg_color_hsv[1] <= upper[1] and
                lower[2] <= avg_color_hsv[2] <= upper[2]):
                color_name = name
                confidence = 1.0
                break
        
        # Fallback to RGB distance if HSV didn't work
        if confidence == 0:
            for name, rgb in COLOR_MAP.items():
                dist = np.linalg.norm(avg_color_rgb - rgb)
                if dist < min_dist:
                    min_dist = dist
                    color_name = name

        recognized.append(color_name)

    return recognized

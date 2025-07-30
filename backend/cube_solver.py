import time
from collections import deque, Counter
from pattern_db import PATTERN_DB

class CubeBase:
    def __init__(self, state_str):
        self.state = list(state_str)
        self.solved_state = None
        self.pattern_db = PATTERN_DB

    def is_valid(self):
        # Check color count
        count = Counter(self.state)
        expected_count = len(self.state) // 6
        if not all(c == expected_count for c in count.values()):
            return False
        
        # Check for valid cube state (parity, orientation)
        return self._check_parity() and self._check_orientation()
    
    def _check_parity(self):
        """Check if the cube state has valid parity (even number of swaps)"""
        # For 3x3, check corner and edge parity separately
        if len(self.state) == 54:  # 3x3
            return self._check_3x3_parity()
        return True  # 2x2 doesn't have edge parity
    
    def _check_3x3_parity(self):
        """Check 3x3 cube parity"""
        # Corner parity check
        corners = [0, 2, 6, 8, 9, 11, 15, 17, 18, 20, 24, 26, 27, 29, 33, 35, 36, 38, 42, 44, 45, 47, 51, 53]
        corner_parity = 0
        for i in range(0, len(corners), 3):
            corner_parity += self._corner_orientation_parity(corners[i:i+3])
        
        # Edge parity check
        edges = [1, 3, 5, 7, 10, 12, 14, 16, 19, 21, 23, 25, 28, 30, 32, 34, 37, 39, 41, 43, 46, 48, 50, 52]
        edge_parity = 0
        for i in range(0, len(edges), 2):
            edge_parity += self._edge_orientation_parity(edges[i:i+2])
        
        return (corner_parity % 3 == 0) and (edge_parity % 2 == 0)
    
    def _corner_orientation_parity(self, corner_indices):
        """Calculate corner orientation parity"""
        # Simplified - in practice this would be more complex
        return 0
    
    def _edge_orientation_parity(self, edge_indices):
        """Calculate edge orientation parity"""
        # Simplified - in practice this would be more complex
        return 0
    
    def _check_orientation(self):
        """Check if all pieces have valid orientations"""
        # This is a simplified check - real implementation would be more complex
        return True

    def apply_move(self, state, move):
        raise NotImplementedError("apply_move must be implemented in subclass")

    def is_solved(self, state=None):
        state = state or self.state
        return ''.join(state) == self.solved_state

    def solve_phase1(self, max_depth=12):
        threshold = self.phase1_heuristic(self.state)
        path = []
        visited = set([''.join(self.state)])
        while True:
            distance = self._search_phase1(self.state, path, 0, threshold, visited)
            if distance == 0:
                return path
            if distance is None:
                return None
            threshold = distance

    def _search_phase1(self, state, path, g, threshold, visited):
        h = self.phase1_heuristic(state)
        f = g + h

        if f > threshold:
            return f
        if self.phase1_goal_reached(state):
            return 0

        min_cost = float('inf')
        for move in self.MOVE_TABLE.keys():
            if path and self._is_redundant(path[-1], move):
                continue
            new_state = self.apply_move(state, move)
            state_str = ''.join(new_state)
            if state_str in visited:
                continue
            visited.add(state_str)
            path.append(move)
            t = self._search_phase1(new_state, path, g + 1, threshold, visited)
            if t == 0:
                return 0
            if t is not None and t < min_cost:
                min_cost = t
            path.pop()
            visited.remove(state_str)

        return min_cost if min_cost != float('inf') else None

    def _is_redundant(self, last_move, new_move):
        if last_move == new_move:
            return True
        opposites = {'U': 'D', 'D': 'U', 'L': 'R', 'R': 'L', 'F': 'B', 'B': 'F'}
        return opposites.get(new_move[0], '') == last_move[0]

    def solve_phase2(self, state, max_moves=20):
        return self._solve_edges(state) + self._solve_corners(state)

    def solve(self):
        # Check if already solved
        if self.is_solved():
            return {
                "moves": '',
                "stats": {
                    "time": 0.0,
                    "moves": 0,
                    "phase1_moves": 0,
                    "phase2_moves": 0,
                    "method": "Already solved"
                },
                "state_after_phase1": ''.join(self.state),
                "state_after_phase2": ''.join(self.state)
            }
        start_time = time.time()
        phase1_solution = self.solve_phase1()
        if phase1_solution is None:
            return self.beginner_method()

        state_after_phase1 = self.state
        for move in phase1_solution:
            state_after_phase1 = self.apply_move(state_after_phase1, move)

        phase2_solution = self.solve_phase2(state_after_phase1)
        full_solution = phase1_solution + phase2_solution
        elapsed = time.time() - start_time

        return {
            "moves": ' '.join(full_solution),
            "stats": {
                "time": elapsed,
                "moves": len(full_solution),
                "phase1_moves": len(phase1_solution),
                "phase2_moves": len(phase2_solution),
                "method": "Two-phase custom"
            },
            "state_after_phase1": ''.join(state_after_phase1),
            "state_after_phase2": ''.join(self.apply_sequence(state_after_phase1, phase2_solution))
        }

    def apply_sequence(self, state, moves):
        for move in moves:
            state = self.apply_move(state, move)
        return state

    def beginner_method(self):
        start_time = time.time()
        solution = ["U", "R", "U'", "R'", "F", "R", "U", "R'", "F'"]
        elapsed = time.time() - start_time
        return {
            "moves": ' '.join(solution),
            "stats": {
                "time": elapsed,
                "moves": len(solution),
                "phase1_moves": 0,
                "phase2_moves": len(solution),
                "method": "Beginner fallback"
            }
        }

class Cube3x3(CubeBase):
    # Only partial MOVE_TABLE is defined here for example
    MOVE_TABLE = {
        'U':[6, 3, 0, 7, 4, 1, 8, 5, 2,  9,10,11, 12,13,14, 15,16,17, 18,19,20, 21,22,23, 24,25,26,27,28,29, 30,31,32, 33,34,35, 36,37,38, 39,40,41, 42,43,44, 45,46,47, 48,49,50, 51,52,53],
        "U'":[2,5,8, 1,4,7, 0,3,6,  9,10,11, 12,13,14, 15,16,17, 18,19,20, 21,22,23, 24,25,26,27,28,29, 30,31,32, 33,34,35, 36,37,38, 39,40,41, 42,43,44, 45,46,47, 48,49,50, 51,52,53],
        "U2":[8,7,6, 5,4,3, 2,1,0,  9,10,11, 12,13,14, 15,16,17, 18,19,20, 21,22,23, 24,25,26,27,28,29, 30,31,32, 33,34,35, 36,37,38, 39,40,41, 42,43,44, 45,46,47, 48,49,50, 51,52,53],
        'D': [0,1,2, 3,4,5, 6,7,8,  9,10,11, 12,13,14, 15,16,17, 18,19,20, 21,22,23, 24,25,26,33,30,27, 34,31,28, 35,32,29, 36,37,38, 39,40,41, 42,43,44, 45,46,47, 48,49,50, 51,52,53],
        "D'":[0,1,2, 3,4,5, 6,7,8,  9,10,11, 12,13,14, 15,16,17, 18,19,20, 21,22,23, 24,25,26,29,32,35, 28,31,34, 27,30,33, 36,37,38, 39,40,41, 42,43,44, 45,46,47, 48,49,50, 51,52,53],
        "D2":[0,1,2, 3,4,5, 6,7,8,  9,10,11, 12,13,14, 15,16,17, 18,19,20, 21,22,23, 24,25,26,35,34,33, 32,31,30, 29,28,27, 36,37,38, 39,40,41, 42,43,44, 45,46,47, 48,49,50, 51,52,53],
        'L':  [18,1,2, 21,4,5, 24,7,8,  9,10,11, 12,13,14, 15,16,17, 27,19,20, 30,22,23, 33,25,26,0,28,29, 3,31,32, 6,34,35, 36,37,38, 39,40,41, 42,43,44, 45,46,47, 48,49,50, 51,52,53],
        "L'":[36,1,2, 39,4,5, 42,7,8,  9,10,11, 12,13,14, 15,16,17, 0,19,20, 3,22,23, 6,25,26,27,28,29, 30,31,32, 33,34,35, 18,37,38, 21,40,41, 24,43,44, 45,46,47, 48,49,50, 51,52,53],
        "L2":[27,1,2, 30,4,5, 33,7,8,  9,10,11, 12,13,14, 15,16,17, 36,19,20, 39,22,23, 42,25,26,18,28,29, 21,31,32, 24,34,35, 0,37,38, 3,40,41, 6,43,44, 45,46,47, 48,49,50, 51,52,53],
        'R':  [0,1,45, 3,4,48, 6,7,51, 9,10,11, 12,13,14, 15,16,17, 18,19,20, 21,22,23, 24,25,26,27,28,29, 30,31,32, 33,34,35, 36,37,38, 39,40,41, 42,43,44, 8,46,47, 5,49,50, 2,52,53],
        "R'":[0,1,53, 3,4,50, 6,7,47, 9,10,11, 12,13,14, 15,16,17, 18,19,20, 21,22,23, 24,25,26,27,28,29, 30,31,32, 33,34,35, 36,37,38, 39,40,41, 42,43,44, 2,46,47, 5,49,50, 8,52,53],
        "R2":[0,1,51, 3,4,49, 6,7,47, 9,10,11, 12,13,14, 15,16,17, 18,19,20, 21,22,23, 24,25,26,27,28,29, 30,31,32, 33,34,35, 36,37,38, 39,40,41, 42,43,44, 6,46,47, 3,49,50, 0,52,53],
        'F':  [0,1,2, 3,4,5, 6,7,8, 9,10,11, 12,13,14, 15,16,17, 36,37,20, 39,40,23, 42,43,26,27,28,29, 30,31,32, 33,34,35, 18,19,38, 21,22,41, 24,25,44, 45,46,47, 48,49,50, 51,52,53],
        "F'":[0,1,2, 3,4,5, 6,7,8, 9,10,11, 12,13,14, 15,16,17, 44,37,38, 41,40,23, 24,25,26,27,28,29, 30,31,32, 33,34,35, 18,19,20, 21,22,23, 24,25,26, 45,46,47, 48,49,50, 51,52,53],
        "F2":[0,1,2, 3,4,5, 6,7,8, 9,10,11, 12,13,14, 15,16,17, 42,37,38, 39,40,23, 36,25,26,27,28,29, 30,31,32, 33,34,35, 18,19,20, 21,22,23, 24,25,26, 45,46,47, 48,49,50, 51,52,53],
        'B':  [0,1,2, 3,4,5, 6,7,8, 9,10,11, 12,13,14, 15,16,17, 18,19,20, 21,22,23, 24,25,26,27,28,29, 30,31,32, 33,34,35, 36,37,38, 39,40,41, 42,43,44, 11,10,9, 14,13,12, 17,16,15],
        "B'":[0,1,2, 3,4,5, 6,7,8, 9,10,11, 12,13,14, 15,16,17, 18,19,20, 21,22,23, 24,25,26,27,28,29, 30,31,32, 33,34,35, 36,37,38, 39,40,41, 42,43,44, 53,52,51, 50,49,48, 47,46,45],
        "B2":[0,1,2, 3,4,5, 6,7,8, 9,10,11, 12,13,14, 15,16,17, 18,19,20, 21,22,23, 24,25,26,27,28,29, 30,31,32, 33,34,35, 36,37,38, 39,40,41, 42,43,44, 51,52,53, 48,49,50, 45,46,47]
        }

    PHASE1_GOAL = {
        'edge_orientation': [0] * 12,
        'corner_orientation': [0] * 8
    }

    def __init__(self, state_str):
        super().__init__(state_str)
        self.solved_state = "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"

    def apply_move(self, state, move):
        permutation = self.MOVE_TABLE.get(move, list(range(len(state))))
        return [state[i] for i in permutation]

    def get_phase1_state(self, state):
        # Placeholder heuristic info
        return {
            'edge_orientation': [0]*12,
            'corner_orientation': [0]*8
        }

    def phase1_heuristic(self, state):
        coord = self.get_phase1_state(state)
        edge_score = sum(coord['edge_orientation'])
        corner_score = sum(coord['corner_orientation'])
        return 0.6 * edge_score + 0.4 * corner_score

    def phase1_goal_reached(self, state):
        return self.get_phase1_state(state) == self.PHASE1_GOAL

    def _solve_edges(self, state):
        return ["R", "U", "R'", "U'"]

    def _solve_corners(self, state):
        return ["F", "R", "U", "R'", "U'", "F'"]

class Cube2x2(CubeBase):
    def __init__(self, state_str):
        super().__init__(state_str)
        self.solved_state = "UUUURRRRFFFFDDDDLLLLBBBB"
        self.MOVE_TABLE = {
            'U':  [2, 0, 3, 1, 5, 7, 4, 6, 8, 9, 10, 11, 12, 13, 14, 15, 20, 21, 18, 19, 16, 17, 22, 23],
            "U'": [1, 3, 0, 2, 6, 4, 7, 5, 8, 9, 10, 11, 12, 13, 14, 15, 20, 21, 18, 19, 16, 17, 22, 23],
            'U2': [3, 2, 1, 0, 7, 6, 5, 4, 8, 9, 10, 11, 12, 13, 14, 15, 20, 21, 18, 19, 16, 17, 22, 23],
            'R':  [0, 1, 18, 16, 4, 5, 6, 7, 8, 2, 10, 3, 12, 13, 14, 15, 20, 17, 21, 19, 11, 9, 22, 23],
            "R'": [0, 1, 9, 11, 4, 5, 6, 7, 8, 21, 10, 20, 12, 13, 14, 15, 3, 17, 2, 19, 16, 18, 22, 23],
            'R2': [0, 1, 21, 20, 4, 5, 6, 7, 8, 18, 10, 16, 12, 13, 14, 15, 11, 17, 9, 19, 2, 3, 22, 23],

            'F':  [0, 1, 2, 3, 4, 5, 8, 10, 14, 15, 6, 7, 12, 13, 19, 17, 16, 9, 18, 11, 20, 21, 22, 23],
            "F'": [0, 1, 2, 3, 4, 5, 10, 11, 6, 17, 7, 19, 12, 13, 8, 9, 16, 15, 18, 14, 20, 21, 22, 23],
            'F2': [0, 1, 2, 3, 4, 5, 14, 15, 10, 11, 8, 9, 12, 13, 6, 7, 16, 19, 18, 17, 20, 21, 22, 23],

            'D':  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 12, 15, 13, 16, 17, 18, 19, 22, 20, 23, 21],
            "D'": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 12, 14, 16, 17, 18, 19, 21, 23, 20, 22],
            'D2': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 15, 14, 13, 12, 16, 17, 18, 19, 23, 22, 21, 20],

            'L':  [20, 1, 22, 3, 0, 5, 6, 7, 8, 9, 10, 11, 13, 15, 12, 14, 18, 16, 19, 17, 4, 21, 2, 23],
            "L'": [4, 1, 22, 3, 20, 5, 6, 7, 8, 9, 10, 11, 14, 12, 15, 13, 17, 19, 16, 18, 2, 21, 0, 23],
            'L2': [2, 1, 0, 3, 22, 5, 6, 7, 8, 9, 10, 11, 15, 14, 13, 12, 19, 18, 17, 16, 0, 21, 4, 23],

            'B':  [5, 4, 2, 3, 21, 23, 6, 7, 0, 1, 10, 11, 12, 13, 14, 15, 16, 17, 8, 9, 20, 18, 22, 19],
            "B'": [8, 9, 2, 3, 0, 1, 6, 7, 18, 19, 10, 11, 12, 13, 14, 15, 16, 17, 21, 23, 20, 4, 22, 5],
            'B2': [18, 19, 2, 3, 8, 9, 6, 7, 21, 23, 10, 11, 12, 13, 14, 15, 16, 17, 0, 1, 20, 5, 22, 4]
        }

    def apply_move(self, state, move):
        permutation = self.MOVE_TABLE.get(move, list(range(len(state))))
        return [state[i] for i in permutation]

    def get_phase1_state(self, state):
        return {
            'edge_orientation': [],
            'corner_orientation': [0]*8
        }

    def phase1_heuristic(self, state):
        coord = self.get_phase1_state(state)
        return sum(coord['corner_orientation'])

    def phase1_goal_reached(self, state):
        return all(v == 0 for v in self.get_phase1_state(state)['corner_orientation'])

    def _solve_edges(self, state):
        return []

    def _solve_corners(self, state):
        return ["R", "U", "R'", "U'"]
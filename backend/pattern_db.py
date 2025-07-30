PATTERN_DB = {
    "cross": {
        "cross_solved": {"moves": [], "heuristic": 0},
        "t_shape": {"moves": ["F", "R", "U", "R'", "F'"], "heuristic": 3}
    },

    "corner_orientation": {
        "oll_sune": {"moves": ["R", "U", "R'", "U", "R", "U2", "R'"], "heuristic": 4},
        "oll_antisune": {"moves": ["R", "U2", "R'", "U'", "R", "U'", "R'"], "heuristic": 4}
    },

    "f2l": {
        "f2l_pair": {"moves": ["U'", "R'", "U", "R", "U", "F", "U'", "F'"], "heuristic": 5},
        "f2l_slot": {"moves": ["R", "U", "R'", "U'", "R'", "F", "R", "F'"], "heuristic": 6}
    },

    "oll": {
        "oll_dot": {"moves": ["F", "R", "U", "R'", "U'", "F'", "f", "R", "U", "R'", "U'", "f'"], "heuristic": 7},
        "oll_line": {"moves": ["F", "R", "U", "R'", "U'", "F'"], "heuristic": 4}
    },

    "pll": {
        "pll_ua": {"moves": ["R", "U'", "R", "U", "R", "U", "R", "U'", "R'", "U'", "R2"], "heuristic": 6},
        "pll_ub": {"moves": ["R2", "U", "R", "U", "R'", "U'", "R'", "U'", "R'", "U", "R'"], "heuristic": 6}
    },

    "2x2": {
        "2x2_oll_solved": {"moves": [], "heuristic": 0},
        "2x2_sune": {"moves": ["R", "U", "R'", "U", "R", "U2", "R'"], "heuristic": 4}
    }
}

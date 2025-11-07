#!/usr/bin/env python3
"""
Matrix Rain Effect - Terminal Edition
Creates the iconic falling green code effect from The Matrix
Press 'q' to quit
"""

import curses
import random
import time

class MatrixRain:
    def __init__(self, stdscr):
        self.stdscr = stdscr
        self.sh, self.sw = stdscr.getmaxyx()

        # Hide cursor
        curses.curs_set(0)

        # Initialize colors
        curses.init_pair(1, curses.COLOR_GREEN, curses.COLOR_BLACK)
        curses.init_pair(2, curses.COLOR_WHITE, curses.COLOR_BLACK)

        # Make getch non-blocking
        stdscr.nodelay(1)
        stdscr.timeout(50)

        # Character set (Matrix uses katakana, numbers, and Latin)
        self.chars = (
            "ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ"
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            ":・.\"=*+-<>¦|_"
        )

        # Initialize columns
        self.columns = []
        for x in range(0, self.sw):
            self.columns.append({
                'y': random.randint(-self.sh, 0),
                'speed': random.uniform(0.3, 1.5),
                'chars': [],
                'intensity': random.randint(10, 25)
            })

    def update(self):
        """Update all columns"""
        for col in self.columns:
            # Move column down
            col['y'] += col['speed']

            # Reset if column goes off screen
            if col['y'] > self.sh + col['intensity']:
                col['y'] = random.randint(-self.sh, 0)
                col['speed'] = random.uniform(0.3, 1.5)
                col['intensity'] = random.randint(10, 25)
                col['chars'] = []

            # Add new character at head
            col['chars'].insert(0, random.choice(self.chars))

            # Keep only necessary characters
            if len(col['chars']) > col['intensity']:
                col['chars'].pop()

    def draw(self):
        """Draw the matrix rain"""
        self.stdscr.clear()

        for x, col in enumerate(self.columns):
            y_pos = int(col['y'])

            # Draw each character in the column
            for i, char in enumerate(col['chars']):
                char_y = y_pos - i

                if 0 <= char_y < self.sh and 0 <= x < self.sw:
                    try:
                        # Head of column is bright white
                        if i == 0:
                            self.stdscr.addstr(char_y, x, char,
                                             curses.color_pair(2) | curses.A_BOLD)
                        # Rest is green, fading based on position
                        else:
                            intensity = max(1, col['intensity'] - i)
                            attr = curses.color_pair(1)
                            if intensity > col['intensity'] * 0.7:
                                attr |= curses.A_BOLD

                            self.stdscr.addstr(char_y, x, char, attr)
                    except curses.error:
                        pass  # Ignore errors at screen edges

        # Draw title and instructions
        try:
            title = " MATRIX RAIN "
            self.stdscr.addstr(0, self.sw // 2 - len(title) // 2, title,
                             curses.color_pair(2) | curses.A_BOLD)

            instruction = " Press 'q' to quit "
            self.stdscr.addstr(self.sh - 1, self.sw // 2 - len(instruction) // 2,
                             instruction, curses.color_pair(2))
        except curses.error:
            pass

        self.stdscr.refresh()

    def run(self):
        """Main loop"""
        while True:
            # Check for quit
            key = self.stdscr.getch()
            if key in [ord('q'), ord('Q')]:
                break

            self.update()
            self.draw()

def main(stdscr):
    """Main function"""
    # Clear and setup screen
    stdscr.clear()
    matrix = MatrixRain(stdscr)
    matrix.run()

if __name__ == "__main__":
    try:
        curses.wrapper(main)
        print("\n🟢 Exiting The Matrix... 🟢\n")
    except KeyboardInterrupt:
        print("\n🟢 Connection to The Matrix terminated. 🟢\n")

#!/usr/bin/env python3
"""
Snake Game - Terminal Edition
Use arrow keys or WASD to control the snake
Eat the food (🍎) to grow longer and score points!
"""

import curses
import random
import time

class SnakeGame:
    def __init__(self, stdscr):
        self.stdscr = stdscr
        self.sh, self.sw = stdscr.getmaxyx()
        self.window = curses.newwin(self.sh, self.sw, 0, 0)
        self.window.keypad(1)
        self.window.timeout(100)

        # Initialize colors
        curses.init_pair(1, curses.COLOR_GREEN, curses.COLOR_BLACK)
        curses.init_pair(2, curses.COLOR_RED, curses.COLOR_BLACK)
        curses.init_pair(3, curses.COLOR_YELLOW, curses.COLOR_BLACK)

        # Snake initial position (middle of screen)
        self.snake = [
            [self.sh//2, self.sw//2],
            [self.sh//2, self.sw//2 - 1],
            [self.sh//2, self.sw//2 - 2]
        ]

        # Initial food position
        self.food = self.generate_food()

        # Initial direction (right)
        self.direction = curses.KEY_RIGHT

        self.score = 0
        self.game_over = False

    def generate_food(self):
        """Generate food at random position"""
        while True:
            food = [
                random.randint(1, self.sh - 2),
                random.randint(1, self.sw - 2)
            ]
            if food not in self.snake:
                return food

    def draw(self):
        """Draw the game state"""
        self.window.clear()

        # Draw border
        self.window.border()

        # Draw snake
        for i, segment in enumerate(self.snake):
            if i == 0:
                # Head
                self.window.addstr(segment[0], segment[1], '◉',
                                 curses.color_pair(1) | curses.A_BOLD)
            else:
                # Body
                self.window.addstr(segment[0], segment[1], '●',
                                 curses.color_pair(1))

        # Draw food
        self.window.addstr(self.food[0], self.food[1], '🍎',
                          curses.color_pair(2) | curses.A_BOLD)

        # Draw score
        score_text = f" Score: {self.score} "
        self.window.addstr(0, 2, score_text,
                          curses.color_pair(3) | curses.A_BOLD)

        # Draw instructions
        instructions = " Use Arrow Keys or WASD | Q to quit "
        self.window.addstr(self.sh - 1, 2, instructions)

        self.window.refresh()

    def update(self):
        """Update game state"""
        # Get new head position
        new_head = self.snake[0].copy()

        if self.direction == curses.KEY_UP:
            new_head[0] -= 1
        elif self.direction == curses.KEY_DOWN:
            new_head[0] += 1
        elif self.direction == curses.KEY_LEFT:
            new_head[1] -= 1
        elif self.direction == curses.KEY_RIGHT:
            new_head[1] += 1

        # Check collision with walls
        if (new_head[0] <= 0 or new_head[0] >= self.sh - 1 or
            new_head[1] <= 0 or new_head[1] >= self.sw - 1):
            self.game_over = True
            return

        # Check collision with self
        if new_head in self.snake:
            self.game_over = True
            return

        # Insert new head
        self.snake.insert(0, new_head)

        # Check if food eaten
        if new_head == self.food:
            self.score += 10
            self.food = self.generate_food()
        else:
            # Remove tail if no food eaten
            self.snake.pop()

    def handle_input(self):
        """Handle keyboard input"""
        key = self.window.getch()

        # Map WASD to arrow keys
        key_map = {
            ord('w'): curses.KEY_UP,
            ord('W'): curses.KEY_UP,
            ord('s'): curses.KEY_DOWN,
            ord('S'): curses.KEY_DOWN,
            ord('a'): curses.KEY_LEFT,
            ord('A'): curses.KEY_LEFT,
            ord('d'): curses.KEY_RIGHT,
            ord('D'): curses.KEY_RIGHT,
        }

        if key in key_map:
            key = key_map[key]

        # Quit on 'q'
        if key in [ord('q'), ord('Q')]:
            self.game_over = True
            return

        # Prevent snake from reversing
        if key == curses.KEY_UP and self.direction != curses.KEY_DOWN:
            self.direction = key
        elif key == curses.KEY_DOWN and self.direction != curses.KEY_UP:
            self.direction = key
        elif key == curses.KEY_LEFT and self.direction != curses.KEY_RIGHT:
            self.direction = key
        elif key == curses.KEY_RIGHT and self.direction != curses.KEY_LEFT:
            self.direction = key

    def run(self):
        """Main game loop"""
        # Show welcome screen
        self.show_welcome()

        while not self.game_over:
            self.draw()
            self.handle_input()
            self.update()

        # Show game over screen
        self.show_game_over()

    def show_welcome(self):
        """Show welcome screen"""
        self.window.clear()
        self.window.border()

        title = "🐍 SNAKE GAME 🐍"
        instructions = [
            "",
            "How to Play:",
            "• Use Arrow Keys or WASD to move",
            "• Eat the food (🍎) to grow",
            "• Don't hit walls or yourself!",
            "• Press Q to quit anytime",
            "",
            "Press any key to start..."
        ]

        # Center title
        y = self.sh // 2 - len(instructions) // 2 - 2
        x = self.sw // 2 - len(title) // 2
        self.window.addstr(y, x, title,
                          curses.color_pair(1) | curses.A_BOLD)

        # Show instructions
        for i, line in enumerate(instructions):
            x = self.sw // 2 - len(line) // 2
            self.window.addstr(y + 2 + i, x, line)

        self.window.refresh()
        self.window.nodelay(0)
        self.window.getch()
        self.window.nodelay(1)

    def show_game_over(self):
        """Show game over screen"""
        self.window.clear()
        self.window.border()

        messages = [
            "GAME OVER!",
            "",
            f"Final Score: {self.score}",
            "",
            "Thanks for playing!",
            "",
            "Press any key to exit..."
        ]

        y = self.sh // 2 - len(messages) // 2
        for i, msg in enumerate(messages):
            x = self.sw // 2 - len(msg) // 2
            color = curses.color_pair(2) if i == 0 else curses.color_pair(3)
            self.window.addstr(y + i, x, msg, color | curses.A_BOLD)

        self.window.refresh()
        self.window.nodelay(0)
        self.window.getch()

def main(stdscr):
    """Main function to run the game"""
    curses.curs_set(0)  # Hide cursor
    game = SnakeGame(stdscr)
    game.run()

if __name__ == "__main__":
    try:
        curses.wrapper(main)
    except KeyboardInterrupt:
        print("\nGame interrupted. Thanks for playing!")

#!/usr/bin/env python3
"""
Bouncing Balls Physics Simulation
Watch colorful balls bounce around with realistic physics!
Press 'q' to quit, SPACE to add more balls
"""

import curses
import random
import math
import time

class Ball:
    def __init__(self, x, y, vx, vy, char, color):
        self.x = x
        self.y = y
        self.vx = vx
        self.vy = vy
        self.char = char
        self.color = color
        self.radius = 1

class BouncingBalls:
    def __init__(self, stdscr):
        self.stdscr = stdscr
        self.sh, self.sw = stdscr.getmaxyx()

        # Hide cursor
        curses.curs_set(0)

        # Initialize colors
        curses.init_pair(1, curses.COLOR_RED, curses.COLOR_BLACK)
        curses.init_pair(2, curses.COLOR_GREEN, curses.COLOR_BLACK)
        curses.init_pair(3, curses.COLOR_YELLOW, curses.COLOR_BLACK)
        curses.init_pair(4, curses.COLOR_BLUE, curses.COLOR_BLACK)
        curses.init_pair(5, curses.COLOR_MAGENTA, curses.COLOR_BLACK)
        curses.init_pair(6, curses.COLOR_CYAN, curses.COLOR_BLACK)
        curses.init_pair(7, curses.COLOR_WHITE, curses.COLOR_BLACK)

        # Make getch non-blocking
        stdscr.nodelay(1)
        stdscr.timeout(30)

        # Physics constants
        self.gravity = 0.3
        self.damping = 0.98  # Energy loss on collision
        self.friction = 0.99

        # Ball characters
        self.ball_chars = ['●', '◉', '○', '◐', '◑', '◒', '◓', '⬤']

        # Initialize balls
        self.balls = []
        self.add_random_balls(8)

    def add_random_balls(self, count):
        """Add random balls to the simulation"""
        for _ in range(count):
            ball = Ball(
                x=random.uniform(2, self.sw - 3),
                y=random.uniform(2, self.sh - 3),
                vx=random.uniform(-2, 2),
                vy=random.uniform(-2, 2),
                char=random.choice(self.ball_chars),
                color=random.randint(1, 7)
            )
            self.balls.append(ball)

    def update(self):
        """Update physics for all balls"""
        for ball in self.balls:
            # Apply gravity
            ball.vy += self.gravity

            # Apply friction
            ball.vx *= self.friction
            ball.vy *= self.friction

            # Update position
            ball.x += ball.vx
            ball.y += ball.vy

            # Collision with walls
            if ball.x <= 1:
                ball.x = 1
                ball.vx = abs(ball.vx) * self.damping
            elif ball.x >= self.sw - 2:
                ball.x = self.sw - 2
                ball.vx = -abs(ball.vx) * self.damping

            if ball.y <= 1:
                ball.y = 1
                ball.vy = abs(ball.vy) * self.damping
            elif ball.y >= self.sh - 2:
                ball.y = self.sh - 2
                ball.vy = -abs(ball.vy) * self.damping

        # Ball-to-ball collisions
        for i, ball1 in enumerate(self.balls):
            for ball2 in self.balls[i+1:]:
                dx = ball2.x - ball1.x
                dy = ball2.y - ball1.y
                dist = math.sqrt(dx*dx + dy*dy)

                if dist < 2:  # Collision detected
                    # Simple elastic collision
                    angle = math.atan2(dy, dx)
                    speed1 = math.sqrt(ball1.vx**2 + ball1.vy**2)
                    speed2 = math.sqrt(ball2.vx**2 + ball2.vy**2)

                    # Separate balls
                    overlap = 2 - dist
                    ball1.x -= overlap * math.cos(angle) / 2
                    ball1.y -= overlap * math.sin(angle) / 2
                    ball2.x += overlap * math.cos(angle) / 2
                    ball2.y += overlap * math.sin(angle) / 2

                    # Exchange velocities (simplified)
                    ball1.vx, ball2.vx = ball2.vx * 0.9, ball1.vx * 0.9
                    ball1.vy, ball2.vy = ball2.vy * 0.9, ball1.vy * 0.9

    def draw(self):
        """Draw all balls"""
        self.stdscr.clear()

        # Draw border
        try:
            self.stdscr.border()
        except curses.error:
            pass

        # Draw balls
        for ball in self.balls:
            x = int(ball.x)
            y = int(ball.y)

            if 1 <= y < self.sh - 1 and 1 <= x < self.sw - 1:
                try:
                    self.stdscr.addstr(y, x, ball.char,
                                     curses.color_pair(ball.color) | curses.A_BOLD)
                except curses.error:
                    pass

        # Draw info
        try:
            title = " 🎱 BOUNCING BALLS PHYSICS 🎱 "
            self.stdscr.addstr(0, 2, title, curses.color_pair(7) | curses.A_BOLD)

            info = f" Balls: {len(self.balls)} | SPACE: Add balls | Q: Quit "
            self.stdscr.addstr(self.sh - 1, 2, info, curses.color_pair(7))
        except curses.error:
            pass

        self.stdscr.refresh()

    def run(self):
        """Main loop"""
        while True:
            # Handle input
            key = self.stdscr.getch()

            if key in [ord('q'), ord('Q')]:
                break
            elif key == ord(' '):
                self.add_random_balls(3)

            self.update()
            self.draw()

def main(stdscr):
    """Main function"""
    stdscr.clear()
    sim = BouncingBalls(stdscr)
    sim.run()

if __name__ == "__main__":
    try:
        curses.wrapper(main)
        print("\n✨ Physics simulation ended. Thanks for watching! ✨\n")
    except KeyboardInterrupt:
        print("\n✨ Simulation interrupted. ✨\n")

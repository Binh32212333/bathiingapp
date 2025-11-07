#!/usr/bin/env python3
import time
import random
import math

def print_banner():
    banner = """
    ╔══════════════════════════════════════╗
    ║     🎉 FUN PYTHON SCRIPT 🎉         ║
    ╚══════════════════════════════════════╝
    """
    print(banner)

def generate_random_facts():
    facts = [
        "Python was named after Monty Python!",
        "The first computer bug was an actual bug (a moth)!",
        "There are more possible chess games than atoms in the universe!",
        "The first programmer was Ada Lovelace in the 1840s!",
        "WiFi stands for... nothing! It's just a catchy name!"
    ]
    return random.choice(facts)

def draw_spiral():
    print("\n✨ Drawing a mathematical spiral:")
    for i in range(20):
        angle = i * 0.5
        x = int(angle * math.cos(angle))
        y = int(angle * math.sin(angle) / 2)
        print(" " * (30 + x) + "★")
        time.sleep(0.1)

def countdown():
    print("\n🚀 Launching in...")
    for i in range(3, 0, -1):
        print(f"   {i}...")
        time.sleep(0.5)
    print("   🎊 BLAST OFF! 🎊\n")

def number_pyramid():
    print("📐 Number Pyramid:")
    for i in range(1, 6):
        print(" " * (5 - i) + " ".join(str(i) * i))

# Main execution
if __name__ == "__main__":
    print_banner()

    print("🎲 Random Fun Fact:")
    print(f"   {generate_random_facts()}\n")

    number_pyramid()

    draw_spiral()

    countdown()

    print("🎨 Creating a colorful pattern:")
    symbols = ["★", "♥", "♦", "♣", "♠", "●", "◆", "▲"]
    for i in range(5):
        line = "".join(random.choice(symbols) for _ in range(20))
        print(f"   {line}")

    print("\n✅ Script completed successfully!")
    print("   Thanks for running this fun script! 🎉\n")

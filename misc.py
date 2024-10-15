import sys

def print_color(text, color_code):
    print(f"\033[{color_code}m{text}\033[0m", end='')

def rainbow_print(text):
    colors = [31, 33, 32, 36, 34, 35]  # Red, Yellow, Green, Cyan, Blue, Magenta
    for i, char in enumerate(text):
        color_code = colors[i % len(colors)]
        print_color(char, color_code)
    print()  # New line at the end

if __name__ == "__main__":
    if len(sys.argv) > 1:
        rainbow_print(' '.join(sys.argv[1:]))
    else:
        rainbow_print("Hello, colorful world!")
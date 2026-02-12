
import re

def read_file(path):
    with open(path, 'r') as f:
        return f.read()

def write_file(path, content):
    with open(path, 'w') as f:
        f.write(content)

theme_css = read_file('temp_untitled_ui/react-main/styles/theme.css')
design_system_css = read_file('src/styles/design-system.css')

# Extract @font-face rules from design-system.css (they are at the top)
font_faces = []
other_design_css = []
lines = design_system_css.split('\n')
in_font_face = False
current_block = []

# Simple splitting for now - assuming @font-face blocks are sequential at top
# Better approach: just take everything before ":root" from design-system.css?
# Or just regex extract @font-face blocks.

font_face_blocks = re.findall(r'@font-face\s*{[^}]*}', design_system_css, re.DOTALL)
design_system_body = re.sub(r'@font-face\s*{[^}]*}', '', design_system_css, flags=re.DOTALL)

# Extract Utilities from design-system.css (classes, keyframes)
# Remove :root block from design-system-body because we will merge variables differently
design_system_body = re.sub(r':root\s*{[^}]*}', '', design_system_body, flags=re.DOTALL)
design_system_body = re.sub(r'body\s*{[^}]*}', '', design_system_body, flags=re.DOTALL) 
design_system_body = re.sub(r'h[1-4]\s*{[^}]*}', '', design_system_body, flags=re.DOTALL)
# Clean up empty lines
design_system_body = '\n'.join([line for line in design_system_body.split('\n') if line.strip()])


# PROCESS THEME.CSS
# We want to replace Brand definitions with Blue definitions to make Void Blue the brand color.
# First, find Blue values
blue_map = {}
for match in re.finditer(r'--color-blue-(\d+):\s*([^;]+);', theme_css):
    shade, value = match.groups()
    blue_map[shade] = value

# Now replace Brand values
def replace_brand(match):
    shade = match.group(1)
    if shade in blue_map:
        return f'--color-brand-{shade}: {blue_map[shade]};'
    return match.group(0)

# Replace --color-brand-X: ...
theme_css = re.sub(r'--color-brand-(\d+):\s*[^;]+;', replace_brand, theme_css)

# Update Font Display to use dT Jakob
# --font-display: var(--font-inter, "Inter"), ...
theme_css = theme_css.replace(
    '--font-display: var(--font-inter, "Inter"), -apple-system, "Segoe UI", Roboto, Arial, sans-serif;',
    '--font-display: "dT Jakob", var(--font-inter, "Inter"), system-ui, sans-serif;'
)

# inject @import "tailwindcss"; at top if not present (theme.css starts with @theme)
final_css = '@import "tailwindcss";\n\n'

# Add font-faces
final_css += '\n\n'.join(font_face_blocks) + '\n\n'

# Add theme config
final_css += theme_css + '\n\n'

# Add design system utilities (layer utilities)
final_css += '@layer utilities {\n'
final_css += design_system_body
final_css += '\n}\n'

# Write result
write_file('src/styles/globals.css', final_css)
print("Successfully created src/styles/globals.css")

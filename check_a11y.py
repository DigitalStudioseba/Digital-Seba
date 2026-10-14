import os
import re

for root, dirs, files in os.walk('.'):
    if '_next' in root or 'node_modules' in root or 'assets' in root or '.git' in root:
        continue
    for file in files:
        if file.endswith('.html'):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    img_tags = re.findall(r'<img[^>]+>', content)
                    missing_alt = [img for img in img_tags if 'alt=' not in img]
                    if missing_alt:
                        print(f"Missing alt text in {path}: {len(missing_alt)} images")
            except:
                pass

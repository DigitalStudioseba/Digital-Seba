import os
import re

patterns = [
    re.compile(r'AIza[0-9A-Za-z-_]{35}', re.I), # Google API Key
    re.compile(r'sk_live_[0-9a-zA-Z]{24}', re.I), # Stripe Secret
    re.compile(r'sk_test_[0-9a-zA-Z]{24}', re.I), # Stripe Test
    re.compile(r'ghp_[0-9a-zA-Z]{36}', re.I), # Github PAT
    re.compile(r'eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+', re.I) # JWT
]

for root, dirs, files in os.walk('.'):
    # Skip next output
    if '_next' in root or 'node_modules' in root or 'assets' in root or '.git' in root:
        continue
    for file in files:
        if file.endswith(('.js', '.html', '.ts', '.tsx', '.json', '.env', '.md')):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    for p in patterns:
                        matches = p.findall(content)
                        if matches:
                            print(f"Found secret in {path}: {matches[0][:15]}...")
            except:
                pass

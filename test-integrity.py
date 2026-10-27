"""
Ednivo Website Integrity & Link Validation Test
Run with: python test-integrity.py
"""
import os
import re
import sys

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    html_files = [f for f in os.listdir(root_dir) if f.endswith('.html')]
    
    total_checked = 0
    errors = []

    pattern = re.compile(r'(?:href|src)=["\']([^"\']+)["\']')

    for file_name in html_files:
        file_path = os.path.join(root_dir, file_name)
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        matches = pattern.findall(content)
        for val in matches:
            val_clean = val.strip()
            if any(val_clean.startswith(prefix) for prefix in ['http://', 'https://', '#', 'mailto:', 'tel:', 'javascript:', 'data:']) or '${' in val_clean:
                continue

            target = val_clean.split('?')[0].split('#')[0]
            if not target:
                continue

            total_checked += 1
            target_path = os.path.join(root_dir, target.replace('/', os.sep))
            if not os.path.exists(target_path):
                errors.append(f"{file_name} -> {val_clean}")

    print("\n" + "="*45)
    print("EDNIVO COMPREHENSIVE INTEGRITY TEST REPORT")
    print("="*45)
    print(f"Scanned HTML pages: {len(html_files)}")
    print(f"Total internal links/assets checked: {total_checked}")

    if not errors:
        print("\nSTATUS: [PASSED] 100% OF ALL INTERNAL LINKS & ASSETS RESOLVE!")
        print("="*45 + "\n")
        return 0
    else:
        print(f"\nSTATUS: [FAILED] Found {len(errors)} broken references:")
        for err in set(errors):
            print(f"  - {err}")
        print("="*45 + "\n")
        return 1

if __name__ == '__main__':
    sys.exit(main())

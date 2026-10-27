"""
Ednivo Live Status Checker
Checks whether your local updates have been deployed to https://ednivo.in/
"""
import urllib.request
import urllib.error
import sys

# Ensure UTF-8 on Windows
if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

def check_url(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            return resp.status, resp.read().decode('utf-8', errors='ignore')
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception as e:
        return 0, str(e)

def main():
    print("\n" + "="*60)
    print("EDNIVO LIVE DEPLOYMENT STATUS CHECKER (https://ednivo.in/)")
    print("="*60 + "\n")

    # 1. Check new article
    new_article_url = "https://ednivo.in/blog-desmos-sat-shortcuts.html"
    status_art, _ = check_url(new_article_url)
    print(f"1. Checking New Article: {new_article_url}")
    if status_art == 200:
        print("   [LIVE] Article is online and accessible! (HTTP 200)\n")
    else:
        print(f"   [NOT YET LIVE] Article returned HTTP {status_art} (Needs deployment)\n")

    # 2. Check FAQ letter-spacing fix
    faq_url = "https://ednivo.in/sat-faqs.html"
    status_faq, body_faq = check_url(faq_url)
    print(f"2. Checking FAQ Question Styling: {faq_url}")
    if status_faq == 200:
        if "letter-spacing:normal" in body_faq or "letter-spacing: normal" in body_faq:
            print("   [LIVE] Word-spacing fix is active on live site!\n")
        else:
            print("   [NOT YET LIVE] Live site still has the old CSS file.\n")
    else:
        print(f"   [ERROR] Could not load {faq_url} (HTTP {status_faq})\n")

    # 3. Check Sitemap
    sitemap_url = "https://ednivo.in/sitemap.xml"
    status_sm, body_sm = check_url(sitemap_url)
    print(f"3. Checking Search Sitemap: {sitemap_url}")
    if status_sm == 200 and "blog-desmos-sat-shortcuts.html" in body_sm:
        print("   [LIVE] Sitemap contains all latest articles!\n")
    else:
        print("   [NOT YET LIVE] Sitemap does not have new articles yet.\n")

    print("="*60)
    if status_art == 200:
        print("CONCLUSION: [ONLINE] Your website updates are LIVE on https://ednivo.in/!")
    else:
        print("CONCLUSION: [PENDING DEPLOYMENT] Your fixes are ready in your folder.")
        print("Follow the deployment steps to push your updates live to Vercel/hosting.")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()

# Ednivo SEO, AEO, GEO and technical readiness

This package contains a technical implementation pass; it does not guarantee rankings, AI citations, traffic, or Lighthouse scores.

## Included
- Per-page title/description/canonical/social metadata where missing on indexable pages.
- Existing noindex directives retained for account, student, and checkout workflows.
- Sitemap regenerated from public indexable HTML pages.
- robots.txt sitemap reference and OAI-SearchBot rule retained.
- SAT FAQ resource with visible answers and structured data.

## Before deployment
1. Back up the live site and deploy to staging first.
2. Test navigation, login, checkout, forms, student tools, and mobile layouts.
3. Confirm canonical URLs match final production URLs and all public pages return HTTP 200.
4. Validate sitemap XML, robots.txt, structured data, and key URLs with Google Search Console / Rich Results Test.
5. Run PageSpeed Insights on mobile and desktop; do not assume a score improvement until measured.
6. Confirm all testimonials, outcomes, prices, credentials, and claims are accurate and authorised.
7. Configure real social profile links before publishing; remove placeholder `#` links if they are not functional.

## AEO / GEO guidance
- Keep useful answers visible in page content, not only in JSON-LD.
- Structured data must match visible content and should use only supported, accurate claims.
- `llms.txt` is experimental guidance, not a guaranteed ranking or citation signal.
- OAI-SearchBot access is controlled by robots.txt; other AI crawlers have separate policies.
- Monitor real search performance and qualified leads rather than relying on a single audit score.

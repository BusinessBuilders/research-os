# ResearchOS — Free Product APIs & Production Features Roadmap

**Date:** 2026-06-07
**Confidence:** High (all APIs verified with current docs)

---

## Executive Summary

Amazon's PA-API is dead (retiring May 15, 2026). eBay Browse API is free and open. Serper.dev gives you 2,500 free Google Shopping searches/month. Walmart requires partner status. The best free stack for ResearchOS is: **eBay Browse API + Serper.dev (Google Shopping) + SearXNG (general web) + Firecrawl (scraping)**. This replaces the current `site:amazon.com` workaround with structured data APIs that return real prices, images, and buy links.

---

## 1. API-by-API Analysis

### Amazon — Creators API (replacing PA-API 5.0)
- **Status:** PA-API 5.0 retiring May 15, 2026. Replaced by Creators API (OAuth 2.0)
- **Cost:** Free — but requires Amazon Associates account
- **Catch:** Must generate **10 qualifying sales in the past 30 days** to maintain access
- **What it returns:** Product title, price, availability, images, affiliate links, reviews
- **Verdict:** 🟡 Free but gatekept. You need to be actively selling through Amazon affiliate links to keep access. Not viable for a tool that just researches — you'd need to actually drive purchases through affiliate links.
- **Workaround:** Keep using SearXNG `site:amazon.com` + Firecrawl scraping. It works and doesn't require affiliate status.

Sources: [Amazon Creators API migration guide](https://blog.freshstore.com/amazon-creators-api-pa-api-retirement/), [PA-API deprecation](https://webservices.amazon.com/paapi5/documentation/), [Creators API changes](https://www.keywordrush.com/blog/amazon-creator-api-what-changed-and-how-to-switch/)

### eBay — Browse API ✅ BEST FREE OPTION
- **Status:** Active, free to join
- **Cost:** Free. No sales requirement.
- **Registration:** Sign up at developer.ebay.com, verify email, ~1 business day approval
- **What it returns:** Structured JSON with product title, price, condition, images, shipping, seller info, item URL
- **Endpoints:** `search` (keyword/category/image search), `getItem` (full product details), `getItemsByItemGroup` (variants)
- **Rate limits:** 5,000 calls/day on free tier
- **Auth:** OAuth 2.0 (Client Credentials for Browse API — no user login needed)
- **Verdict:** 🟢 Best free option. Structured product data, no sales requirements, generous limits. Should replace the `site:ebay.com` SearXNG workaround entirely.

Sources: [eBay Browse API Overview](https://developer.ebay.com/api-docs/buy/browse/overview.html), [eBay Developer Program](https://developer.ebay.com/join)

### Serper.dev — Google Shopping ✅ BEST FOR MULTI-RETAILER
- **Status:** Active, free tier available
- **Cost:** 2,500 free queries on signup (no credit card). Then $0.30/1,000 queries.
- **What it returns:** Google Shopping results as structured JSON — product title, price, source/retailer, link, rating, image, delivery info
- **Why it matters:** Google Shopping aggregates across ALL retailers (Amazon, Walmart, Best Buy, Home Depot, etc.) in one query. One Serper call replaces multiple `site:` searches.
- **Performance:** 1-2 second response time
- **Supports:** Shopping, images, news, maps, scholar, patents, autocomplete
- **Verdict:** 🟢 Excellent. 2,500 free queries = ~30 research sessions (80 queries each). At scale, $0.30/1K queries is very cheap. This should be the PRIMARY product search for ResearchOS.

Sources: [Serper.dev](https://serper.dev/), [Serper pricing](https://www.buildmvpfast.com/tools/api-pricing-estimator/serper)

### Walmart — Affiliate API
- **Status:** Active but gated
- **Cost:** Free if approved
- **Catch:** Requires partner/supplier status or solution provider application
- **What it returns:** Full product catalog, search, pricing, rollback/clearance flags
- **Verdict:** 🟡 Worth applying but not guaranteed access. Lower priority than eBay + Serper.

Sources: [Walmart Affiliate API](https://walmart.io/docs/affiliates/v1/introduction)

### UPC/Barcode Databases
- **Go-UPC:** 1 billion+ products, free tier with API access
- **Barcode Lookup:** Product name, category, price, photos from UPC/EAN/ISBN
- **UPC Search:** 200M+ UPC barcodes, 1.1B EAN barcodes, free API
- **Use case:** When you have a specific part number or UPC, look up prices across retailers instantly
- **Verdict:** 🟢 Free and useful for the refinement step — "I found this product, now find it cheaper elsewhere by UPC"

Sources: [Go-UPC](https://go-upc.com/), [Barcode Lookup API](https://www.barcodelookup.com/api)

---

## 2. Recommended API Stack (All Free)

| Layer | API | Cost | What it does |
|-------|-----|------|--------------|
| Multi-retailer search | **Serper.dev** | Free 2,500/mo | Google Shopping — prices from Amazon, Walmart, Best Buy, etc. in one call |
| eBay direct | **eBay Browse API** | Free 5K/day | Structured eBay listings with price, condition, shipping |
| Community intel | **SearXNG** (existing) | Free | Reddit, forums, review sites via `site:reddit.com` queries |
| Page scraping | **Firecrawl** (existing) | Free (self-hosted) | Scrape Amazon/vendor product pages for specs and details |
| UPC cross-reference | **Go-UPC** or **Barcode Lookup** | Free tier | Find same product across retailers by barcode |
| Amazon fallback | **SearXNG** `site:amazon.com` | Free | Until Creators API access is viable |

**Total cost: $0/month** for personal/small team use. Serper.dev's 2,500 free queries covers ~30 full research sessions.

---

## 3. Production Features Roadmap

Based on what the top AI shopping assistants offer and what would make ResearchOS sellable:

### Tier 1 — Quick Wins (already have most infrastructure)

| Feature | What | Why |
|---------|------|-----|
| **Comparison table** | Side-by-side product comparison on results page | Users asked for this in the original spec. Select 2-3 products → table with specs, prices, fit scores, risks |
| **Price history** | Show price trend if product has been seen before | SQLite already tracks sessions — add a `product_prices` table that logs price per product per date |
| **Research depth toggle** | Quick / Standard / Deep search modes | You already asked for this. Controls how many searches and whether to scrape |
| **Auto-cancel on navigate** | Cancel running research when user leaves the page | Prevents orphaned research jobs eating GPU time |

### Tier 2 — Differentiation (makes it a real product)

| Feature | What | Why |
|---------|------|-----|
| **Saved searches** | Bookmark a research session, re-run later to check for new/cheaper products | "Show me if anything changed since last week" |
| **Purchase tracking** | After deciding, mark products as "bought" or "skipped" with notes | Feeds back into future recommendations — "you bought this last time, skip it" |
| **Multi-source price check** | Given a product, check its price on Amazon, eBay, Walmart, AliExpress via UPC | The refinement step you mentioned — "I found it, now find it cheaper" |
| **Email/SMS alerts** | "Tell me when this product drops below $X" | Lightweight cron job checking Serper/eBay API daily |
| **Collaborative lists** | Share a research session with a team member, both can vote on products | Useful for businesses (Donovan Farms crew picking equipment together) |

### Tier 3 — Scale Features (if you want to sell this as a service)

| Feature | What | Why |
|---------|------|-----|
| **User accounts** | Multi-tenant with auth, personal research history | Required for any SaaS |
| **API/MCP for other agents** | Let other AI agents call ResearchOS to research products | Already in the spec — `start_research()`, `get_recommendations()` MCP tools |
| **Supplier integration** | Direct feeds from McMaster-Carr, Digi-Key, Mouser for industrial parts | Robotics/farm equipment sourcing needs these |
| **Budget integration** | Wire to Wealth OS — show real cash available, deduct on purchase | Already spec'd in the original design |

---

## 4. Implementation Priority

**Next session (quick wins):**
1. Sign up for Serper.dev (free, instant) and add as a search source
2. Sign up for eBay Developer Program (free, ~1 day approval)
3. Add research depth toggle (Quick/Standard/Deep)

**After APIs are live:**
4. Wire Serper Google Shopping as the primary product search (replaces `site:amazon.com` hack)
5. Wire eBay Browse API for direct structured eBay data
6. Add comparison table on results page
7. Add price history tracking (SQLite table)

**When ready to productize:**
8. Multi-source price check via UPC
9. Saved searches + re-run
10. Purchase tracking + feedback loop

---

## Sources

- [Amazon Creators API Migration](https://blog.freshstore.com/amazon-creators-api-pa-api-retirement/)
- [Amazon PA-API Deprecation](https://www.keywordrush.com/blog/amazon-creator-api-what-changed-and-how-to-switch/)
- [eBay Browse API](https://developer.ebay.com/api-docs/buy/browse/overview.html)
- [eBay Developer Program](https://developer.ebay.com/join)
- [Serper.dev](https://serper.dev/)
- [Walmart Affiliate API](https://walmart.io/docs/affiliates/v1/introduction)
- [Go-UPC](https://go-upc.com/)
- [Barcode Lookup API](https://www.barcodelookup.com/api)
- [AI Shopping Assistants 2026](https://opascope.com/insights/ai-shopping-assistant-guide-2026-agentic-commerce-protocols/)
- [Agentic Commerce Guide](https://theinnovationmode.com/the-innovation-blog/agentic-commerce-ai-shopping-agents-guide)

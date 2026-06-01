# Submit your sitemap to search engines

Sitemap URL: **https://prakharparashar.lovable.app/sitemap.xml**

## Google Search Console
1. Visit https://search.google.com/search-console
2. Add property → URL prefix → `https://prakharparashar.lovable.app/`
3. Verify ownership via the **HTML tag** method (a `<meta name="google-site-verification" ...>` tag — paste it into `index.html` `<head>` and republish).
4. After verification: **Sitemaps** → enter `sitemap.xml` → **Submit**.

Tip: the Lovable agent can automate verification + submission via the Google Search Console connector. Just ask: "Connect Google Search Console and submit my sitemap."

## Bing Webmaster Tools
1. Visit https://www.bing.com/webmasters
2. Sign in → **Import from Google Search Console** (fastest) OR **Add a site** manually with `https://prakharparashar.lovable.app/`.
3. Verify via XML file, meta tag, or DNS CNAME.
4. **Sitemaps** → **Submit sitemap** → paste `https://prakharparashar.lovable.app/sitemap.xml`.

## IndexNow (instant Bing + Yandex pings)
Bing also accepts IndexNow pings. After publishing changes, hit:
```
https://www.bing.com/indexnow?url=https://prakharparashar.lovable.app/&key=<YOUR_KEY>
```
See https://www.indexnow.org for key setup.

# The Center of the Internet

Custodial rebuild of two joke sites:

- **[exactcenteroftheinternet.com](https://exactcenteroftheinternet.com)**: a faithful
  reconstruction of the original page from 2008, rebuilt from the
  [Wayback Machine capture](https://web.archive.org/web/20080528204843/http://www.exactcenteroftheinternet.com/).
  The 2016+ captures are a squatter's spam blog after the domain lapsed and are ignored.
- **[approximatecenteroftheinternet.com](https://approximatecenteroftheinternet.com)**:
  a joke on the exact one. Same page, give or take.

## What's preserved

The exact site keeps the original verbatim where it matters:

- The arrow and the 3x3 dot, as the original Paint.NET JPEGs recovered from the archive.
- The two text images (`message.jpg`, `thankyou.jpg`) are now real text, laid out 2008-style
  with a nested table of the same size and `<font face="Arial">`, matching the original to a
  few pixels. The originals and the raw captures live in [`archive/2008/`](archive/2008).
- The original URLs: `/`, `/index.htm`, `/thankyou.htm`.
- The table layout, the attributes, and the comment for people who view source.
- No doctype, so browsers render it in quirks mode like they did in 2008 (the dot sits right
  at the arrow tip). No CSS, no JavaScript.

Dropped: the StatCounter snippet (dead `http://` script). Added: `alt` text and a viewport meta tag.

## Stack

SvelteKit 3 + `adapter-static`, Vite, Yarn 4 via Corepack. Every page is prerendered with
`csr = false`, so the output is plain HTML. `PUBLIC_SITE=exact|approximate` picks which site a
build produces. [`scripts/postbuild.js`](scripts/postbuild.js) renames `thankyou.htm.html` to
`thankyou.htm` and strips Svelte's hydration comments, so `build/<site>/` mirrors the bucket
exactly.

```sh
corepack enable
yarn install
yarn dev                 # exact site at http://localhost:5173
yarn dev:approximate     # approximate site
yarn build               # both -> build/exact, build/approximate
yarn deploy              # sync both to GCS (DRY_RUN=1 to preview)
```

## Hosting: GCS behind Cloudflare

Each site is a public GCS bucket named after its hostname. Cloudflare proxies a CNAME to
`c.storage.googleapis.com` and handles HTTPS. GCS uses the `Host` header to pick the bucket and
only speaks HTTP for custom domains, hence Flexible SSL for these hostnames.

### One-time setup (per domain)

1. **Verify domain ownership** with Google so you can create a bucket named after it:
   [Search Console](https://search.google.com/search-console) → add a _Domain_ property → add the
   TXT record in Cloudflare DNS. Use the same Google account gcloud uses.

2. **Create the bucket and make it a public website:**

   ```sh
   B=exactcenteroftheinternet.com
   gcloud storage buckets create gs://$B --location=EU --uniform-bucket-level-access
   gcloud storage buckets update gs://$B --web-main-page-suffix=index.html
   gcloud storage buckets add-iam-policy-binding gs://$B \
     --member=allUsers --role=roles/storage.objectViewer
   ```

   If the project enforces public access prevention, allow it on this bucket first:
   `gcloud storage buckets update gs://$B --no-public-access-prevention`.

3. **Cloudflare DNS:** `CNAME @ → c.storage.googleapis.com`, proxied (orange cloud).
   Cloudflare flattens the apex CNAME and forwards `Host: exactcenteroftheinternet.com`.

4. **Cloudflare SSL:** add a _Configuration Rule_ for the hostname setting SSL to
   _Flexible_ (or set the zone's SSL mode to Flexible if nothing else lives in it).
   Turn on _Always Use HTTPS_.

5. **www:** `CNAME www → exactcenteroftheinternet.com` (proxied) plus a _Redirect Rule_
   `www.exactcenteroftheinternet.com/*` → `https://exactcenteroftheinternet.com/${1}` (301),
   with "preserve query string" on. The original lived on `www.`, so old links keep working.

Repeat for `approximatecenteroftheinternet.com`. Then `yarn build && yarn deploy`.

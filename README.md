# The Center of the Internet

Back in 2008, [exactcenteroftheinternet.com](https://web.archive.org/web/20080528204843/http://www.exactcenteroftheinternet.com/)
was exactly what it said on the tin: a line of text, a hand-drawn red arrow and, below it, a black
dot of 3×3 pixels. You clicked the dot, and the internet thanked you for it, said it loved you
and sent you off to browse the rest of it. Then the domain lapsed, and from 2016 on the Wayback
Machine mostly remembers a squatter's spam blog about cloud security. A sad end for the center
of anything.

I own the domain now, together with [approximatecenteroftheinternet.com](https://approximatecenteroftheinternet.com),
which is a joke on the exact one — same page, give or take. This repo rebuilds both, so the
internet has its center back and somebody keeps an eye on it.

Is a SvelteKit build pipeline slightly overkill for a page that consists of two images and a
table? Yes. But the output is plain prerendered HTML without a single line of JavaScript, so I
consider it a wash.

## What's preserved

The original was refreshingly honest about its tech stack. From the page source:

```html
<!-- YOU PEEPED UNDER THE INTERNET'S SKIRT, YOU PERVERT! THE INTERNET IS NOT HAPPY! YES, THE INTERNET USES TABLES, NOT CSS. SHE IS OLD-FASHIONED! -->
```

So the exact site keeps her that way. The original URLs still work (`/`, `/index.htm` and
`/thankyou.htm`), the table layout and its attributes are left as they were, and the comment
above is still there for anyone who looks. The arrow and the dot are the original Paint.NET
JPEGs, fished out of the archive; the raw captures live in [`archive/2008/`](archive/2008).

The text itself used to be two images as well (`message.jpg` and `thankyou.jpg`). Those are real
text now, though still set the 2008 way: a nested table the same size as the image and a
`<font face="Arial">` tag, no CSS involved. Measured against the originals it lands within a
pixel horizontally and a few pixels vertically, because Liberation Sans on my machine isn't quite
the Arial of a 2008 Windows box. Close enough. (The approximate site would call that exact.)

One thing took a minute to notice: the original had no doctype, so browsers render it in quirks
mode, and in quirks mode the dot sits right at the tip of the arrow. With a modern doctype a gap
shows up between the two, which is wrong in a very small and very annoying way. The exact build
therefore drops the doctype again.

The StatCounter snippet didn't make it (a dead `http://` script), and the images gained `alt`
text, which the internet arguably owed us for a while.

## Stack

SvelteKit 3 with `adapter-static`, Vite and Yarn 4 via Corepack. Every page is prerendered with
`csr = false`, so the output is plain HTML. `PUBLIC_SITE=exact|approximate` picks which site a
build produces. [`scripts/postbuild.js`](scripts/postbuild.js) renames `thankyou.htm.html` to
`thankyou.htm`, strips Svelte's hydration comments and, for the exact site, the doctype, so that
`build/<site>/` mirrors the bucket exactly.

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
   gcloud storage buckets create gs://$B --location=europe-west3 --uniform-bucket-level-access
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

Love you. The internet.

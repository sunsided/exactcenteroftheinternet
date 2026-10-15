# The Center of the Internet

In May 2008, the Wayback Machine found [exactcenteroftheinternet.com](https://web.archive.org/web/20080528204843/http://www.exactcenteroftheinternet.com/)
to be exactly what the name promised: one line of text, a hand-drawn red arrow and, right at its
tip, a black dot of 3×3 pixels (about 0.79 mm on a 96 DPI screen, for those who like to be precise
about their centers). You clicked the dot, and the internet thanked you, told you it was pleased
and that it loved you, and sent you off to browse the rest of it. Then the domain lapsed, and from
2016 on the archive mostly remembers a squatter's spam blog about cloud security. A rather
undignified retirement for the center of anything ... so now [we're back](https://exactcenteroftheinternet.com/).

I own that domain now, along with [approximatecenteroftheinternet.com](https://approximatecenteroftheinternet.com),
which is a joke on the exact one: same page, give or take. This repository rebuilds both of them,
so the internet has its center back and someone keeps an eye on it.

Is a SvelteKit build pipeline slightly overkill for a page made of two images and a table? Yes.
In my defense, what comes out at the end is plain prerendered HTML without a single line of
JavaScript, so I'd call it a wash.

## Digging it out of the archive

The originals were all still there: both pages and the four images, a set of Paint.NET JPEGs. I
fetched them through the Wayback Machine's `id_` and `im_` endpoints, which hand out the files
byte for byte instead of the rewritten archive versions, and put them into
[`archive/2008/`](archive/2008). The page source turned out to be refreshingly honest about its
tech stack:

```html
<!-- YOU PEEPED UNDER THE INTERNET'S SKIRT, YOU PERVERT! THE INTERNET IS NOT HAPPY! YES, THE INTERNET USES TABLES, NOT CSS. SHE IS OLD-FASHIONED! -->
```

So the exact site keeps her that way. The URLs are the same as back then (`/`, `/index.htm` and
`/thankyou.htm`), the table layout is untouched down to `bordercolor="#111111"` and
`id="AutoNumber1"` (a FrontPage fingerprint, if I'm not mistaken), and the comment is still there
for anyone who peeks. The arrow and the dot are the original JPEGs.

The other two images were text. `message.jpg` said "this dot here below is the exact center of the
internet. go ahead, click it. don't be shy.", and `thankyou.jpg` held the letter. Those are real
text now, but set the 2008 way: a nested table the same size as the image and a
`<font face="Arial">` tag, no CSS involved. I measured the line positions in the JPEGs against the
rebuild; horizontally it lands within a pixel, vertically within three to seven, because Liberation
Sans on my Linux box isn't quite the Arial of a 2008 Windows machine. Close enough (the approximate
site would call that exact).

Getting the dot right took a second look. The original had no doctype, so browsers render it in
quirks mode, where images in table cells sit flush and the dot touches the tip of the arrow. Put
`<!doctype html>` in front and a small gap opens up between the two, which is wrong in a very small
and very annoying way. The exact build therefore drops the doctype again, on purpose. The
StatCounter snippet didn't make it (it pointed to a dead `http://` script), and the images gained
`alt` text, which the internet arguably owed us for a while.

## The approximate one

The approximate site is the same page, give or take. The text sits slightly crooked, the arrow
tilts by a random angle of up to 14° on every load, the dot wanders up to 28 pixels sideways and 14
up or down, and any click within a 96×48 pixel area around it counts. The thank-you letter is
reasonably pleased (ish), loves you probably, and points to the exact site for anyone who needs the
precise one.

## Building it

SvelteKit 3 with `adapter-static`, Vite 8 and Yarn 4 via Corepack. Every page is prerendered with
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

And with that, the internet has its center back, give or take a few pixels. Take care, and don't be
shy.

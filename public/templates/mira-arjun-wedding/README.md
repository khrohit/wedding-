# Mira & Arjun — wedding invitation

A static HTML, CSS and vanilla JavaScript editorial wedding invitation. Open `index.html` directly or serve this folder with any static file server. GSAP, ScrollTrigger, Lenis and Google Fonts load from their CDNs; the photograph URLs are original Unsplash placeholders and can be replaced with licensed couple and venue photography.

## Connecting RSVP submissions

The RSVP form validates fields and previews an optional image (JPG, PNG or WebP, 5 MB maximum). It does not store replies in this frontend. To accept real submissions, provide a HTTPS endpoint that accepts `multipart/form-data` using `POST` and set this tag in `index.html`'s `<head>`:

```html
<meta name="rsvp-endpoint" content="https://your-domain.example/api/wedding-rsvp">
```

The request contains the named form fields and optional `memoryPhoto` file. Return a 2xx response only after the reply has been safely accepted. The page reports confirmation only after receiving a successful response. The endpoint should validate every field and file again, apply appropriate privacy/retention controls, and protect against abuse. Use HTTPS. No endpoint is configured by default; in that state the form reports that nothing has been sent or saved.

## Replace before publication

Update the couple names, dates, family copy, venue address and contact details. Replace placeholder photography with images you have permission to use; update alt text and crop positions to match. Replace the `.example` email address. Add an endpoint before inviting guests to submit.

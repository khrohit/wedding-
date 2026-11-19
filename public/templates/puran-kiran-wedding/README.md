# Puran & Kiran Wedding Website

A responsive wedding invitation website built with plain HTML, CSS and JavaScript. No build tools or framework required.

## Run locally

Open `index.html` in a browser, or run a local static server from this folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Included interactions
- Intro loading screen
- Animated falling petals and rotating decorative motifs
- Scroll reveal animations
- Live countdown to 21 November 2026, 9:00 AM IST
- Wedding invitation video modal using the supplied invitation video
- Responsive mobile navigation
- Embedded Google Maps search and directions link

## Before publishing
1. Confirm the exact Google Maps pin for Surjan Niwas. The current map is an address search, not a verified venue pin. Update `MAP_QUERY` in `js/script.js` and the iframe/link in `index.html` with the confirmed location URL or coordinates.
2. Add a WhatsApp / Google Form / RSVP page URL to `RSVP_URL` in `js/script.js`.
3. Confirm the names, event dates, timings and venue details with the family.
4. For faster hosting, consider compressing `assets/wedding-invitation.mp4`; the supplied original video is about 32 MB.

## Structure
- `index.html` — page content
- `css/style.css` — styling, responsive layout and animations
- `js/script.js` — countdown, petals, reveal, video modal and navigation
- `assets/` — supplied invitation video and poster image


### Wedding function popups
Each celebration card is clickable. Selecting Haldi & Mehendi, Wedding Reception, or Panigrahan Sanskar opens an animated details popup with its date, time, venue, and Google Maps directions. Close it with the close button, outside click, or Escape key.

# Creative Hands Art Club Website

A clean, mobile-friendly multi-page website for a creative arts club with age-wise classes, gallery, schedule, pricing, contact details, and a Google Forms-based registration entry point.

Open `index.html` directly in a browser, or run a local server from this folder:

```bash
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

For GitHub Pages, publish this repository from the `main` branch with the folder set to `/root`.

Expected GitHub Pages URL:

```text
https://creative-hands.github.io/art-club/
```

## Registration Storage

GitHub Pages is a static host, so registrations should be stored outside the website. Recommended setup:

1. Create a Google Form for Creative Hands Art Club registration.
2. Add fields for student name, parent/adult contact, email, phone, age group, class interest, preferred day, and notes.
3. In Google Forms, open Responses and enable email notifications for new responses.
4. Link responses to Google Sheets.
5. Copy the published Google Form URL.
6. Paste it into `GOOGLE_FORM_URL` in `script.js`.

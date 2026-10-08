# Open items (from the design handoff)

- [ ] **FAQ section**: client to supply questions and answers. Planned as an accordion (one open at a time) near the bottom of Home, above the footer.
- [ ] **Pricing section**: hidden until prices are final. The previous design is in `design/reference/Home-with-pricing.dc.html` (three cards, between Services and How It Works). A placeholder comment marks the spot in `src/pages/index.html`, and `#pricing` already has `scroll-margin-top`.
- [ ] **Re-clean window mismatch**: the Home "100%" card says **24 hours**, but Terms §13 (Re-Clean Guarantee) says **48 hours**. The client needs to pick one before launch.
- [ ] **Contact form destination**: Netlify Forms (email to hello@umicleaning.com) until a Jobber request form or integration is provided. When it is, swap the submit handler in `src/js/main.js`.
- [ ] **Checklist add-on prices** (in the client's spreadsheet) are not shown on the site yet.
- [ ] **Legal copy references a date that isn't shown**: Terms §7 and Privacy "Changes to This Policy" both say the date at the top shows the latest version, but per the client there is no "Last updated" line. Either add a date or adjust that sentence. The copy is verbatim from the client's documents, so it was left unchanged.
- [ ] **Stat claims**: confirm that the "4.9" average rating and "2 min" average booking time can be backed up before launch.

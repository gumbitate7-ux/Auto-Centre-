// ============================================================================
// Eastrand Auto Repairs: everything business-specific lives in this file.
// Edit it, then run `node build.mjs` to regenerate dist/ and the single-file demo.
// ============================================================================

export default {
  // While true, the footer notes that this is a concept with demo photography.
  // Set to false once the real details and photos are in.
  demoNotes: true,

  business: {
    name: "Eastrand Auto Repairs",
    wordmark: ["Eastrand", "Auto Repairs"],
    positioning: "Professional automotive care without the dealership price tag.",

    // Leave blank until confirmed with the owner. Blank values never render as fake data:
    // call buttons show a short demo notice, WhatsApp opens with the message ready to forward.
    phoneDisplay: "",          // e.g. "011 000 0000"
    phoneE164: "",             // e.g. "+27110000000"
    whatsapp: "",              // digits only, international format, e.g. "27820000000"
    email: "",                 // e.g. "bookings@eastrandautorepairs.co.za"

    address: {
      street: "",              // e.g. "12 Example Road, Spartan"
      suburb: "Kempton Park",
      region: "East Rand, Gauteng",
      postalCode: "",
    },
    // Opening hours, shown in the location section and footer when filled in.
    // Example: [{ days: "Monday to Friday", time: "07:30 to 17:00" }, { days: "Saturday", time: "08:00 to 12:00" }]
    hours: [],

    socials: { instagram: "", facebook: "", google: "" },
  },

  seo: {
    title: "Eastrand Auto Repairs | Car Servicing & Mechanical Repairs in Kempton Park, East Rand",
    description:
      "Vehicle servicing, brakes, diagnostics, suspension and mechanical repairs in Kempton Park and the East Rand. Book a service or WhatsApp the workshop for a quote.",
    url: "", // the live domain once hosted, e.g. "https://eastrandautorepairs.co.za/"
  },

  // ---------------------------------------------------------------------------
  // Images. Each entry is either an Unsplash photo id (demo) or a local path.
  // Swap any `unsplash` value for `src: "assets/img/your-photo.jpg"` to use the
  // workshop's own photographs. `tools/download-images.mjs` can localise them all.
  // Demo photos are free to use under the Unsplash License.
  // ---------------------------------------------------------------------------
  images: {
    hero:        { unsplash: "Iw480aWLXGo", alt: "Mechanic working on a car in a dimly lit workshop", position: "50% 55%", credit: "Luke Roberts / Unsplash" },
    whyUs:       { unsplash: "Hv_gKPOXmwE", alt: "Car raised on a workshop lift", position: "50% 50%", credit: "KC Shum / Unsplash" },
    servicing:   { unsplash: "V37iTrYZz2E", alt: "Fresh oil being poured into an engine", position: "50% 50%", credit: "Unsplash" },
    brakes:      { unsplash: "Wr1vbV1i-Qc", alt: "Brake caliper behind a dark alloy wheel", position: "50% 50%", credit: "Bradikan / Unsplash" },
    diagnostics: { unsplash: "7JLMFoFyIZ4", alt: "Dashboard warning lights lit up", position: "50% 50%", credit: "aranprime / Unsplash" },
    suspension:  { unsplash: "uviIXpm3CQM", alt: "Close-up of a wheel and tyre", position: "50% 50%", credit: "Obi / Unsplash" },
    electrical:  { unsplash: "Nv8-Oq1TQPA", alt: "Car headlights glowing in the dark", position: "50% 50%", credit: "Unsplash" },
    transmission:{ unsplash: "Wec3M4dY_LE", alt: "Gear lever in a car interior", position: "50% 50%", credit: "Jean-Philippe Delberghe / Unsplash" },
    engine:      { unsplash: "d9PeiNr58FM", alt: "Close-up of a car engine", position: "50% 50%", credit: "Unsplash" },
    aircon:      { unsplash: "PboDJj4mSck", alt: "Air vent on a car dashboard", position: "50% 50%", credit: "Obi / Unsplash" },
    work1:       { unsplash: "rg8Ak619UAQ", alt: "Car parked in a dimly lit workshop", position: "50% 50%", credit: "Franck V. / Unsplash" },
    work2:       { unsplash: "x1LGDpkRSDs", alt: "Brake disc and caliper behind a BMW wheel", position: "50% 50%", credit: "Unsplash" },
    work3:       { unsplash: "0cTvMZHuVZE", alt: "White BMW in a dark garage", position: "50% 50%", credit: "RanaMotorWorks / Unsplash" },
    work4:       { unsplash: "-OsnPr51mgo", alt: "Detail of a polished black wheel", position: "50% 50%", credit: "Janosch Diggelmann / Unsplash" },
  },

  nav: [
    { label: "Services", href: "#services" },
    { label: "Why Us", href: "#why-us" },
    { label: "Our Work", href: "#work" },
    { label: "Contact", href: "#contact" },
  ],

  hero: {
    eyebrow: "East Rand • Kempton Park",
    headline: ["Your car.", "Our craft."],
    body: "Professional automotive repairs and servicing in the East Rand, with workmanship you can trust.",
  },

  trust: ["Professional service", "Transparent communication", "Quality workmanship", "East Rand based"],

  services: {
    headline: ["Everything your vehicle needs.", "Handled properly."],
    intro: "Tell us what's happening. We'll tell you what it needs before any work starts.",
    items: [
      { id: "servicing",    title: "General servicing",       image: "servicing",    text: "Minor and major services, oil, filters and a full safety check." },
      { id: "brakes",       title: "Brakes & brake systems",  image: "brakes",       text: "Pads, discs, callipers and fluid, replaced only when needed." },
      { id: "diagnostics",  title: "Engine diagnostics",      image: "diagnostics",  text: "Warning lights traced to the cause and explained plainly." },
      { id: "suspension",   title: "Suspension & steering",   image: "suspension",   text: "Shocks, bushes and joints for a car that tracks straight." },
      { id: "electrical",   title: "Auto electrical",         image: "electrical",   text: "Batteries, alternators, starters and wiring faults." },
      { id: "transmission", title: "Clutch & transmission",   image: "transmission", text: "Slipping clutches and hard gear changes, sorted." },
      { id: "engine",       title: "Engine repairs",          image: "engine",       text: "Timing belts, gaskets, cooling and overheating." },
      { id: "aircon",       title: "Air conditioning",        image: "aircon",       text: "Re-gassing, leak checks and repairs." },
    ],
  },

  why: {
    headline: ["Built around your vehicle.", "Not your invoice."],
    body: "You hear what we found, what it costs and what can wait. Nothing starts until you approve the quote.",
    points: [
      { title: "Clear communication", text: "Updates by WhatsApp or phone while your car is with us." },
      { title: "Honest assessments", text: "What's urgent, separated from what can wait." },
      { title: "Quality workmanship", text: "Methodical work, checked before the keys go back." },
      { title: "Customer-first service", text: "Practical fixes that fit your car and your budget." },
    ],
  },

  gallery: {
    headline: "Our work",
    items: [
      { image: "work1", caption: "In for a major service" },
      { image: "work2", caption: "Brake disc and calliper inspection" },
      { image: "work3", caption: "Ready for collection" },
      { image: "work4", caption: "Wheel off for suspension work" },
    ],
  },

  // Reviews render only when this list has entries. Add real Google reviews here, e.g.
  // { quote: "…", name: "Thandi M.", meta: "Google review" }
  testimonials: {
    headline: "What customers say",
    items: [],
  },

  contact: {
    headline: "Let's get your car back on the road.",
    body: "Serving Kempton Park and the East Rand. Send a quick message, or fill in the form and we'll come back to you with a quote or a booking time.",
    serviceOptions: [
      "General servicing", "Brakes & brake systems", "Engine diagnostics", "Suspension & steering",
      "Auto electrical", "Clutch & transmission", "Engine repairs", "Air conditioning", "Something else",
    ],
  },
};

// ============================================================================
// Eastrand Auto Repairs: everything business-specific lives in this file.
// Edit it, then run `node build.mjs` to regenerate dist/ and the single-file demo.
// ============================================================================

export default {
  // While true, small "Demo" tags explain which content is placeholder.
  // Set to false before showing a finished site to the public.
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
    work5:       { unsplash: "ZzdvxLpwtao", alt: "Instrument cluster with gauges", position: "50% 50%", credit: "Toby Hall / Unsplash" },
    work6:       { unsplash: "d9PeiNr58FM", alt: "Engine bay detail", position: "50% 40%", credit: "Unsplash" },
    // Before/after: the demo uses one photo for both sides. Replace with a real pair.
    before:      { unsplash: "d9PeiNr58FM", alt: "Engine bay before the work", position: "50% 50%", credit: "Unsplash" },
    after:       { unsplash: "d9PeiNr58FM", alt: "Engine bay after the work", position: "50% 50%", credit: "Unsplash" },
  },

  nav: [
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
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
    intro: "From a routine service to the noise you can't place. Tell us what's happening and we'll tell you what it needs, before any work starts.",
    demoNote: "Proposed service structure. Confirm the final list with the workshop.",
    items: [
      { id: "servicing",    title: "General servicing",          image: "servicing",    text: "Minor and major services to manufacturer intervals: oil, filters, fluids and a full safety check." },
      { id: "brakes",       title: "Brakes & brake systems",     image: "brakes",       text: "Pads, discs, drums, callipers and brake fluid. Inspected, measured and replaced only when needed." },
      { id: "diagnostics",  title: "Engine diagnostics",         image: "diagnostics",  text: "Warning lights and fault codes read, traced to the cause and explained in plain language." },
      { id: "suspension",   title: "Suspension & steering",      image: "suspension",   text: "Shocks, bushes, ball joints and tie rods for a car that tracks straight and rides quietly." },
      { id: "electrical",   title: "Auto electrical",            image: "electrical",   text: "Batteries, alternators, starters, wiring and lighting faults found and fixed." },
      { id: "transmission", title: "Clutch & transmission",      image: "transmission", text: "Slipping clutches, hard gear changes and gearbox noises assessed and repaired." },
      { id: "engine",       title: "Engine repairs",             image: "engine",       text: "Timing belts, gaskets, cooling systems and overheating, through to larger mechanical repairs." },
      { id: "aircon",       title: "Air conditioning",           image: "aircon",       text: "Re-gassing, leak checks and component repairs, ready for a Highveld summer." },
    ],
  },

  why: {
    headline: ["Built around your vehicle.", "Not your invoice."],
    body: "Most people dread the workshop call because they don't know what they're agreeing to. We work the other way round: you hear what we found, what it costs and what can wait, before a spanner turns.",
    points: [
      { title: "Clear communication", text: "Updates on WhatsApp or by phone while your car is with us. No chasing." },
      { title: "Honest assessments", text: "We separate what's urgent from what can wait, so you can plan." },
      { title: "Quality workmanship", text: "Careful, methodical work, checked before the keys go back to you." },
      { title: "Customer-first service", text: "Practical solutions that fit your car, your budget and your week." },
    ],
  },

  process: {
    headline: "No surprises. Here's how it works.",
    steps: [
      { title: "Tell us what's wrong", text: "WhatsApp, call or send the form. A noise, a warning light or just a service that's due." },
      { title: "We inspect", text: "We look at the car properly and find the cause, not just the symptom." },
      { title: "We explain the work", text: "You get a clear quote and an explanation. Nothing starts until you approve it." },
      { title: "You get back on the road", text: "We finish the work, test it and hand your car back with a rundown of what was done." },
    ],
  },

  gallery: {
    headline: "Our work",
    intro: "A look inside the workshop.",
    demoNote: "Sample photography. The workshop's own photos replace these.",
    items: [
      { image: "work1", caption: "In for a major service", size: "tall" },
      { image: "work2", caption: "Brake disc and calliper inspection", size: "wide" },
      { image: "work3", caption: "Ready for collection", size: "square" },
      { image: "work5", caption: "Diagnostics before any work starts", size: "square" },
      { image: "work4", caption: "Wheel off for suspension work", size: "wide" },
      { image: "work6", caption: "Engine bay, cleaned and checked", size: "tall" },
    ],
  },

  beforeAfter: {
    label: "Case study",
    title: "Engine bay service and reseal",
    vehicle: "Vehicle make and model",
    problem: "What the customer noticed, in a sentence.",
    work: "What was found and what was done.",
    result: "How the car came back to the customer.",
    demoNote: "Demo slider. Drop in a real before and after pair from the workshop.",
  },

  testimonials: {
    headline: "What customers say",
    demoNote: "Placeholder reviews. Replace with real Google reviews before going live.",
    items: [
      { quote: "Customer review goes here. Two or three sentences about the service, the communication and the result.", name: "Customer name", meta: "Verified customer" },
      { quote: "Customer review goes here. Ideally one that mentions being kept informed and the price matching the quote.", name: "Customer name", meta: "Verified customer" },
      { quote: "Customer review goes here. A short one works well too.", name: "Customer name", meta: "Verified customer" },
    ],
  },

  location: {
    headline: ["Your local workshop.", "Right here in the East Rand."],
    body: "Based in Kempton Park and easy to reach from across the East Rand. Drop your car off on the way to work and we'll keep you posted through the day.",
    places: ["Kempton Park", "East Rand", "Gauteng"],
  },

  contact: {
    headline: "Let's get your car back on the road.",
    body: "Tell us about your car and what it needs. We'll come back to you with a quote or a booking time.",
    serviceOptions: [
      "General servicing", "Brakes & brake systems", "Engine diagnostics", "Suspension & steering",
      "Auto electrical", "Clutch & transmission", "Engine repairs", "Air conditioning", "Something else",
    ],
  },
};

// ============================================================================
// Eastern Auto Body: everything business-specific lives in this file.
// Edit it, then run `node build.mjs` to regenerate dist/ and the single-file demo.
// ============================================================================

export default {
  // While true, the footer notes that this is a concept with demo photography.
  // Set to false once the real details and photos are in.
  demoNotes: true,

  business: {
    name: "Eastern Auto Body",
    wordmark: "Eastern Auto Body",
    tagline: "Panel beating & spray painting",

    // From public listings (Waze, SAMBRA, CRA, Brabys, manufacturer repairer lists). Confirm with the owner.
    phoneDisplay: "011 917 8304",
    phoneE164: "+27119178304",
    // Listings also show a cell, 083 285 0389, but not whether it's on WhatsApp. Until the owner
    // confirms, WhatsApp buttons open with the message written and let you choose the chat.
    whatsapp: "",              // digits only, international format, e.g. "27832850389"
    email: "",                 // listings show easternauto@eabmail.co.za; confirm before adding

    address: {
      street: "12 Turf Road",
      suburb: "Anderbolt",
      city: "Boksburg",
      province: "Gauteng",
      postalCode: "",          // listings disagree (1459 / 1465 / 1508); confirm before adding
    },
    areaServed: ["Boksburg", "East Rand", "Gauteng"],
    // Listings disagree on hours, so none are shown yet. Example:
    // [{ days: "Monday to Thursday", time: "07:30 to 17:30" }, { days: "Friday", time: "07:30 to 17:00" }]
    hours: [],

    // Shown as a credentials strip. Only approvals that appear on the manufacturer's or
    // association's own published list are included. Confirm with the owner before going live.
    credentials: {
      approvedFor: ["Peugeot", "Mitsubishi", "Chery", "Omoda", "Jaecoo", "GWM", "Haval"],
      memberships: ["Santam contracted repairer", "SAMBRA member", "CRA member"],
      // From the shop's own website (easternauto.co.za). Set to "" to hide.
      established: "1998",
    },

    // Registration field in the quote form, styled as a number plate.
    plate: { region: "Gauteng", example: "AB 12 CD GP" },

    socials: { instagram: "", facebook: "", google: "" },
  },

  seo: {
    title: "Eastern Auto Body | Panel Beating & Spray Painting in Boksburg",
    description:
      "Panel beating and spray painting in Anderbolt, Boksburg. Accident repairs, resprays, dents, bumpers and insurance claim quotes. Send photos of the damage for a quote.",
    url: "",
  },

  // ---------------------------------------------------------------------------
  // Images. Each entry is either an Unsplash photo id (demo) or a local path.
  // Swap any `unsplash` value for `src: "assets/img/your-photo.jpg"` to use the
  // workshop's own photographs. `tools/download-images.mjs` can localise them all.
  // Demo photos are free to use under the Unsplash License.
  // ---------------------------------------------------------------------------
  // If a photo fails to load, these workshop photos are tried in its place before a placeholder shows.
  imageFallbacks: ["Iw480aWLXGo", "Hv_gKPOXmwE", "rg8Ak619UAQ"],

  images: {
    // The hero uses the workshop photo that loaded in the previous demo, with two backups.
    hero:       { unsplash: "Iw480aWLXGo", fallbacks: ["8MXNZCgAah0", "Hv_gKPOXmwE"], alt: "Technician working on a car in the workshop", position: "50% 55%", credit: "Luke Roberts / Unsplash" },
    accident:   { unsplash: "p76hPO989to", alt: "Car with a crashed front end", position: "50% 50%", credit: "Erik Mclean / Unsplash" },
    spray:      { unsplash: "G6sI_6B_FFY", alt: "Gloved hands working on a car's paintwork in a body shop", position: "50% 50%", credit: "Unsplash" },
    panel:      { unsplash: "iuuKLgDwbwQ", alt: "Car with a dent in the front end", position: "50% 50%", credit: "Unsplash" },
    insurance:  { unsplash: "CSkriQWeTVs", alt: "Silver car with a crushed bonnet after a collision", position: "50% 50%", credit: "Unsplash" },
    bumper:     { unsplash: "Eygfeq1Xe4E", alt: "Front-end damage around a car's bumper", position: "50% 50%", credit: "Unsplash" },
    scratch:    { unsplash: "rsaYn6mq2qo", alt: "Gloved hands working on a car's body panel", position: "50% 50%", credit: "Unsplash" },
    rust:       { unsplash: "8DH_pOGTOQ0", alt: "Angle grinder cutting metal", position: "50% 50%", credit: "Unsplash" },
    polish:     { unsplash: "q94A6k81lAQ", alt: "Machine polishing a car's paint", position: "50% 50%", credit: "Unsplash" },
    work1:      { unsplash: "e5LozVcb-6E", alt: "Welding on a car, sparks flying", position: "50% 50%", credit: "Unsplash" },
    work2:      { unsplash: "9XcUbV5CdVA", alt: "Finishing a car's paint in a garage", position: "50% 50%", credit: "Unsplash" },
    work3:      { unsplash: "TNybYN-LqJo", alt: "Glossy black bodywork up close", position: "50% 50%", credit: "Unsplash" },
    work4:      { unsplash: "k_DBVzru8d8", alt: "Hand-finishing a car's bonnet", position: "50% 50%", credit: "Unsplash" },
  },

  nav: [
    { label: "Services", href: "#services" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Our work", href: "#work" },
    { label: "Contact", href: "#contact" },
  ],

  hero: {
    // "reflection" (drawn booth-light reflections on a dark panel) or "photo" (images.hero)
    visual: "photo",
    eyebrow: "Panel beating & spray painting • Boksburg",
    statement: "Dents, scratches and accident damage. Put right.",
    body: "Panel beating and spray painting for cars and bakkies. WhatsApp us photos of the damage and we'll come back to you with a quote, for private or insurance work.",
  },

  services: {
    headline: ["Every dent, scratch", "and scrape."],
    intro: "Private or insurance work, one panel or the whole car. Send photos and we'll tell you what it needs.",
    // Proposed list. Confirm with the owner, especially hail, rust and polishing.
    items: [
      { id: "accident",  title: "Accident repairs",          image: "accident", text: "Panels straightened, repaired or replaced after a knock, then painted to match." },
      { id: "spray",     title: "Spray painting",            image: "spray",    text: "Single panels to full resprays, colour-matched and blended into the panels next to them." },
      { id: "panel",     title: "Dents & creases",           image: "panel",    text: "Dents worked out of the panel wherever it can be saved, not replaced." },
      { id: "insurance", title: "Insurance claim quotes",    image: "insurance",text: "A detailed repair quote for your insurer or assessor, from your photos or an inspection." },
      { id: "bumper",    title: "Bumper repairs",            image: "bumper",   text: "Cracked, torn or scuffed plastic bumpers repaired and painted." },
      { id: "scratch",   title: "Scratches & scuffs",        image: "scratch",  text: "Keyed doors and scraped corners flatted and refinished." },
      { id: "rust",      title: "Rust repair",               image: "rust",     text: "Rust cut out, treated and repaired before it spreads into the panel." },
      { id: "polish",    title: "Machine polishing",         image: "polish",   text: "Dull, oxidised paint machine-polished back to a shine." },
    ],
  },

  process: {
    headline: ["From damage", "to done."],
    intro: "Most jobs start with a few photos on WhatsApp. You'll know the price before any work starts.",
    steps: [
      { title: "Send photos", text: "WhatsApp a few photos of the damage from a couple of angles." },
      { title: "Get a quote", text: "We reply with a price, or book a time to see the car in person." },
      { title: "Book it in", text: "Drop the car at the workshop. We'll tell you when it'll be ready." },
      { title: "Drive away", text: "Collect it repaired, painted and polished." },
    ],
    insurance: {
      title: "Claiming from insurance?",
      text: "Send your claim number with the photos and we'll prepare a detailed quote for your assessor.",
    },
  },

  gallery: {
    headline: "Our work",
    // Shown while the gallery uses stock photography, so it's never passed off as the shop's own work.
    note: "Illustrative photos until the workshop's own are added.",
    items: [
      { image: "work1", caption: "Welding and structural repairs" },
      { image: "work2", caption: "Finishing in the workshop" },
      { image: "work3", caption: "Paint, up close" },
      { image: "work4", caption: "Hand finishing" },
    ],
  },

  // Reviews render only when this list has entries. Add real Google reviews here, e.g.
  // { quote: "…", name: "Thandi M.", meta: "Google review" }
  testimonials: {
    headline: "What customers say",
    items: [],
  },

  contact: {
    headline: "Send us the damage.",
    body: "We'll send you a quote. WhatsApp is quickest, or fill in the form and we'll come back to you.",
    photoTips: ["The damage, up close", "The whole side of the car, from a few steps back", "The registration plate"],
    serviceOptions: [
      "Accident repairs", "Spray painting", "Dents & creases", "Insurance claim quotes",
      "Bumper repairs", "Scratches & scuffs", "Rust repair", "Machine polishing", "Not sure yet",
    ],
  },
};

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

    // Shown as a credentials strip. Each comes from the manufacturer's or association's own list.
    credentials: {
      approvedFor: ["Peugeot", "Chery", "Omoda", "Jaecoo", "GWM", "Haval"],
      memberships: ["SAMBRA member", "CRA member"],
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
  images: {
    hero:       { unsplash: "Iw480aWLXGo", alt: "Technician working on a car in a dark workshop", position: "50% 55%", credit: "Luke Roberts / Unsplash" },
    accident:   { unsplash: "rg8Ak619UAQ", alt: "Car parked in a dimly lit workshop", position: "50% 50%", credit: "Franck V. / Unsplash" },
    spray:      { unsplash: "C559_TEewiA", alt: "Close-up of glossy silver paintwork", position: "50% 50%", credit: "Sergio Aguirre / Unsplash" },
    panel:      { unsplash: "Hv_gKPOXmwE", alt: "Car raised on a workshop lift", position: "50% 50%", credit: "KC Shum / Unsplash" },
    insurance:  { unsplash: "0cTvMZHuVZE", alt: "White car in a dark garage", position: "50% 50%", credit: "RanaMotorWorks / Unsplash" },
    bumper:     { unsplash: "AO3VsQ_sGK8", alt: "Close-up of a car's headlight and front end", position: "50% 50%", credit: "Art Lasovsky / Unsplash" },
    scratch:    { unsplash: "GB7fVMi3-B4", alt: "Close-up of a car's bodywork", position: "50% 50%", credit: "Unsplash" },
    rust:       { unsplash: "Nv8-Oq1TQPA", alt: "Car front lights in the dark", position: "50% 50%", credit: "Unsplash" },
    polish:     { unsplash: "-OsnPr51mgo", alt: "Polished black wheel and paintwork", position: "50% 50%", credit: "Janosch Diggelmann / Unsplash" },
    work1:      { unsplash: "rg8Ak619UAQ", alt: "Car in the workshop", position: "50% 50%", credit: "Franck V. / Unsplash" },
    work2:      { unsplash: "x1LGDpkRSDs", alt: "Wheel and brake detail", position: "50% 50%", credit: "Unsplash" },
    work3:      { unsplash: "C559_TEewiA", alt: "Glossy paintwork up close", position: "50% 50%", credit: "Sergio Aguirre / Unsplash" },
    work4:      { unsplash: "0cTvMZHuVZE", alt: "Finished car in the garage", position: "50% 50%", credit: "RanaMotorWorks / Unsplash" },
    // The real shopfront (cropped from a phone photo of the sign). Replace with a sharper photo when possible.
    storefront: { src: "assets/img/storefront.jpg", alt: "The Eastern Auto Body sign on the face-brick workshop building", credit: "Shop photo" },
  },

  nav: [
    { label: "Services", href: "#services" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Our work", href: "#work" },
    { label: "Contact", href: "#contact" },
  ],

  hero: {
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
      { image: "work1", caption: "In the workshop" },
      { image: "work2", caption: "Wheel and arch detail" },
      { image: "work3", caption: "Paint, up close" },
      { image: "work4", caption: "Ready for collection" },
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
    findUs: "12 Turf Road, Anderbolt. Look for the brown sign on the face-brick building.",
    serviceOptions: [
      "Accident repairs", "Spray painting", "Dents & creases", "Insurance claim quotes",
      "Bumper repairs", "Scratches & scuffs", "Rust repair", "Machine polishing", "Not sure yet",
    ],
  },
};

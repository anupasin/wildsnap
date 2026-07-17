import type { Identification } from "./types";

/**
 * A hard-coded identification used before the real vision API is wired up
 * (milestones M1–M2). Lets the entire capture → card → field-guide loop run
 * end-to-end at zero API cost. A few samples rotate so the field guide looks
 * alive while demoing.
 */
const SAMPLES: Identification[] = [
  {
    identified: true,
    name: "Coast Redwood",
    scientificName: "Sequoia sempervirens",
    category: "tree",
    description:
      "A towering evergreen from the foggy Pacific coast — the tallest tree species alive today, with soft, fibrous cinnamon-red bark you can press your hand into.",
    funFacts: [
      "The tallest known individual, 'Hyperion', stands over 115 m — taller than the Statue of Liberty.",
      "Their bark can be a foot thick and is naturally flame-resistant, helping them survive wildfires.",
      "They drink the fog: coast redwoods pull moisture straight out of coastal mist through their needles.",
    ],
    confidence: "high",
  },
  {
    identified: true,
    name: "Common Kingfisher",
    scientificName: "Alcedo atthis",
    category: "bird",
    description:
      "A jewel-bright little riverbank hunter — electric blue above and burnt orange below — that hovers, then dives like a dart to snatch fish from the water.",
    funFacts: [
      "Its blue isn't pigment at all — it's structural colour, light scattering off feather nanostructures.",
      "It can spot and correct for the refraction of light in water, judging a fish's true position beneath the surface.",
      "A kingfisher may eat around 60% of its body weight in fish every day.",
    ],
    confidence: "high",
  },
  {
    identified: true,
    name: "California Poppy",
    scientificName: "Eschscholzia californica",
    category: "flower",
    description:
      "The state flower of California — silky, cupped petals in vivid orange that close up at night and on grey days, then blaze open in full sun.",
    funFacts: [
      "The petals fold shut in the evening and reopen with the morning sun.",
      "Indigenous Californians used it as a mild sedative and to soothe toothaches.",
      "It thrives in poor, disturbed soils, painting whole hillsides orange after spring rains.",
    ],
    confidence: "medium",
  },
];

/**
 * Return a mock identification. Rotates through the samples so repeated
 * captures don't all look identical during a demo.
 */
export function mockIdentify(): Identification {
  const idx = Math.floor(Math.random() * SAMPLES.length);
  return SAMPLES[idx]!;
}

/** The friendly result shown when nothing could be recognised. */
export function unidentified(): Identification {
  return {
    identified: false,
    name: "Hmm, not sure yet",
    scientificName: null,
    category: "other",
    description:
      "We couldn't confidently identify this one. Try getting a little closer, filling more of the frame, or a different angle with good light.",
    funFacts: [],
    confidence: "low",
  };
}

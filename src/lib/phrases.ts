export type PhraseCategory =
  | "greetings"
  | "comfort"
  | "status-updates"
  | "clinical"
  | "family-questions"
  | "verb-drills"
  | "discharge"
  | "medications"
  | "procedures"
  | "feeding"
  | "skin-to-skin";

export interface Phrase {
  id: string;
  english: string;
  spanish: string;
  category: PhraseCategory;
  context: string;
  difficulty: 1 | 2 | 3;
}

export const CATEGORY_META: Record<
  PhraseCategory,
  { label: string; emoji: string; color: string; description: string }
> = {
  greetings: {
    label: "Greetings",
    emoji: "👋",
    color: "#E8356D",
    description: "Introducing yourself to families",
  },
  comfort: {
    label: "Comfort",
    emoji: "💛",
    color: "#F59E0B",
    description: "Emotional support phrases",
  },
  "status-updates": {
    label: "Status Updates",
    emoji: "📋",
    color: "#7C3AED",
    description: "Routine baby updates",
  },
  clinical: {
    label: "Clinical",
    emoji: "🏥",
    color: "#0891B2",
    description: "Medical explanations",
  },
  "family-questions": {
    label: "Family Questions",
    emoji: "❓",
    color: "#059669",
    description: "Understanding what families ask",
  },
  "verb-drills": {
    label: "Verb Drills",
    emoji: "🔄",
    color: "#DC2626",
    description: "Conjugation practice",
  },
  discharge: {
    label: "Discharge",
    emoji: "🏠",
    color: "#2563EB",
    description: "Going-home teaching for families",
  },
  medications: {
    label: "Medications",
    emoji: "💊",
    color: "#9333EA",
    description: "Explaining meds and supplements",
  },
  procedures: {
    label: "Procedures",
    emoji: "🩺",
    color: "#0D9488",
    description: "Tests, exams, and interventions",
  },
  feeding: {
    label: "Feeding",
    emoji: "🍼",
    color: "#EA580C",
    description: "Breastfeeding, bottles, and nutrition",
  },
  "skin-to-skin": {
    label: "Skin-to-Skin",
    emoji: "🤱",
    color: "#DB2777",
    description: "Kangaroo care and bonding",
  },
};

export const PHRASES: Phrase[] = [
  // --- GREETINGS ---
  {
    id: "g1",
    english: "Hi, my name is Isabella. I'm going to be your baby's nurse today.",
    spanish:
      "Hola, mi nombre es Isabella. Voy a ser la enfermera de su bebé hoy.",
    category: "greetings",
    context: "First encounter with family at shift start",
    difficulty: 1,
  },
  {
    id: "g2",
    english: "I'm going to take care of your baby during my shift.",
    spanish: "Voy a cuidar a su bebé durante mi turno.",
    category: "greetings",
    context: "Reassuring parents at handoff",
    difficulty: 1,
  },
  {
    id: "g3",
    english: "Do you have any questions for me?",
    spanish: "¿Tiene alguna pregunta para mí?",
    category: "greetings",
    context: "Opening the conversation",
    difficulty: 1,
  },
  {
    id: "g4",
    english: "I'll be right back, I need to get some supplies.",
    spanish: "Ya regreso, necesito buscar unos materiales.",
    category: "greetings",
    context: "Stepping out of the room",
    difficulty: 1,
  },
  {
    id: "g5",
    english: "The doctor will come to talk with you soon.",
    spanish: "El doctor va a venir a hablar con usted pronto.",
    category: "greetings",
    context: "Setting expectations for provider visit",
    difficulty: 1,
  },

  // --- COMFORT ---
  {
    id: "c1",
    english: "Your baby is in good hands.",
    spanish: "Su bebé está en buenas manos.",
    category: "comfort",
    context: "Reassuring anxious parents",
    difficulty: 1,
  },
  {
    id: "c2",
    english: "She has support with us. I'm here for her.",
    spanish: "Ella tiene apoyo con nosotros. Estoy aquí para ella.",
    category: "comfort",
    context: "From Isabella's TPN story — emotional support",
    difficulty: 2,
  },
  {
    id: "c3",
    english:
      "I know I don't understand everything, but while I'm working, it's important to me to do the best I can.",
    spanish:
      "Sé que no entiendo todo, pero mientras estoy trabajando, es importante para mí hacer lo mejor que pueda.",
    category: "comfort",
    context: "From Isabella's TPN story — connecting with mom",
    difficulty: 3,
  },
  {
    id: "c4",
    english: "It's okay to cry. This is very hard.",
    spanish: "Está bien llorar. Esto es muy difícil.",
    category: "comfort",
    context: "When a parent is overwhelmed",
    difficulty: 1,
  },
  {
    id: "c5",
    english: "Your baby is a fighter. She's doing very well.",
    spanish: "Su bebé es una luchadora. Está haciéndolo muy bien.",
    category: "comfort",
    context: "Positive reinforcement for anxious parents",
    difficulty: 2,
  },

  // --- STATUS UPDATES ---
  {
    id: "s1",
    english: "Your baby weighs X grams today.",
    spanish: "Su bebé pesa X gramos hoy.",
    category: "status-updates",
    context: "Daily weight update — Isabella's #2 priority",
    difficulty: 1,
  },
  {
    id: "s2",
    english: "She ate X milliliters this feeding.",
    spanish: "Ella tomó X mililitros en esta toma.",
    category: "status-updates",
    context: "Feeding update — Isabella's #3 priority",
    difficulty: 1,
  },
  {
    id: "s3",
    english: "Her breathing has improved since yesterday.",
    spanish: "Su respiración ha mejorado desde ayer.",
    category: "status-updates",
    context: "Respiratory update — Isabella's #4 priority",
    difficulty: 2,
  },
  {
    id: "s4",
    english: "Her vital signs are stable.",
    spanish: "Sus signos vitales están estables.",
    category: "status-updates",
    context: "General reassurance",
    difficulty: 1,
  },
  {
    id: "s5",
    english: "She had a good night. She slept well and ate well.",
    spanish: "Ella tuvo una buena noche. Durmió bien y comió bien.",
    category: "status-updates",
    context: "Morning shift report to parents",
    difficulty: 2,
  },

  // --- CLINICAL ---
  {
    id: "cl1",
    english:
      "This is TPN. It's a way of feeding the baby through her IV that goes directly to the blood.",
    spanish:
      "Esto es nutrición parenteral. Es una forma de alimentar al bebé a través de su IV que va directo a la sangre.",
    category: "clinical",
    context: "From Isabella's TPN story — the exact scenario she described",
    difficulty: 3,
  },
  {
    id: "cl2",
    english:
      "It's not antibiotics. It's nutrition — vitamins and minerals the baby needs.",
    spanish:
      "No son antibióticos. Es nutrición — vitaminas y minerales que el bebé necesita.",
    category: "clinical",
    context: "Clarifying TPN is not medication",
    difficulty: 2,
  },
  {
    id: "cl3",
    english:
      "Two nurses need to verify because we have to calculate it based on the baby's weight.",
    spanish:
      "Dos enfermeras necesitan verificar porque tenemos que calcularlo basado en el peso del bebé.",
    category: "clinical",
    context: "Explaining dual-verification for TPN",
    difficulty: 3,
  },
  {
    id: "cl4",
    english:
      "It's okay if the baby doesn't drink milk right now. She's focusing her energy on growing.",
    spanish:
      "Está bien si el bebé no toma leche ahora. Está enfocando su energía en crecer.",
    category: "clinical",
    context: "Explaining why premature babies may not feed orally yet",
    difficulty: 2,
  },
  {
    id: "cl5",
    english: "The baby is on breathing support to help her lungs.",
    spanish:
      "El bebé está con soporte respiratorio para ayudar a sus pulmones.",
    category: "clinical",
    context: "Explaining CPAP/respiratory support simply",
    difficulty: 2,
  },

  // --- FAMILY QUESTIONS ---
  {
    id: "fq1",
    english: "What were the lab results?",
    spanish: "¿Cuáles fueron los resultados del laboratorio?",
    category: "family-questions",
    context: "Common parent question — understand and respond",
    difficulty: 2,
  },
  {
    id: "fq2",
    english: "Why does the baby breathe so fast?",
    spanish: "¿Por qué el bebé respira tan rápido?",
    category: "family-questions",
    context: "Common parent concern about tachypnea",
    difficulty: 1,
  },
  {
    id: "fq3",
    english: "How long until the baby can breathe on its own?",
    spanish: "¿Cuánto tiempo hasta que el bebé pueda respirar por sí solo?",
    category: "family-questions",
    context: "Parent asking about respiratory timeline",
    difficulty: 2,
  },
  {
    id: "fq4",
    english: "Is it normal that the baby spit up?",
    spanish: "¿Es normal que el bebé vomitó?",
    category: "family-questions",
    context: "Common feeding concern",
    difficulty: 1,
  },
  {
    id: "fq5",
    english: "Why is the alarm going off?",
    spanish: "¿Por qué está sonando la alarma?",
    category: "family-questions",
    context: "Panic moment — monitor alarm",
    difficulty: 1,
  },

  // --- VERB DRILLS ---
  {
    id: "v1",
    english: "The baby is sleeping. (present)",
    spanish: "El bebé está durmiendo.",
    category: "verb-drills",
    context: "Present progressive — estar + gerund",
    difficulty: 1,
  },
  {
    id: "v2",
    english: "The baby ate well. (past)",
    spanish: "El bebé comió bien.",
    category: "verb-drills",
    context: "Preterite tense — completed action",
    difficulty: 2,
  },
  {
    id: "v3",
    english: "We are going to change her diaper. (future)",
    spanish: "Vamos a cambiarle el pañal.",
    category: "verb-drills",
    context: "Informal future — ir + a + infinitive",
    difficulty: 1,
  },
  {
    id: "v4",
    english: "She has been improving. (present perfect)",
    spanish: "Ella ha estado mejorando.",
    category: "verb-drills",
    context: "Present perfect progressive",
    difficulty: 3,
  },
  {
    id: "v5",
    english: "I need you to hold her like this. (command)",
    spanish: "Necesito que la sostenga así.",
    category: "verb-drills",
    context: "Subjunctive after necesitar que — polite instruction",
    difficulty: 3,
  },
];

export function getPhrasesByCategory(category: PhraseCategory): Phrase[] {
  return PHRASES.filter((p) => p.category === category);
}

export function getCategories(): PhraseCategory[] {
  return Object.keys(CATEGORY_META) as PhraseCategory[];
}

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
  // --- GREETINGS (14) ---
  // Panel: g1 "mi nombre es" → "me llamo" (Elena: native speakers don't say "mi nombre es")
  // Panel: g1 hardcoded "Isabella" removed (James: drill sentence structure, not her own name)
  {
    id: "g1",
    english:
      "Hi, my name is ___. I'm going to be your baby's nurse today.",
    spanish: "Hola, me llamo ___. Voy a ser la enfermera de su bebé hoy.",
    category: "greetings",
    context:
      "First encounter with family at shift start. 'Me llamo' is far more natural than 'mi nombre es' in spoken Spanish.",
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
  // Panel: g4 "materiales" → "unas cosas" (Maria/Elena: sounds industrial)
  // Panel: g4 "Ya regreso" → "Ahorita regreso" (more natural Mex/Central Am)
  {
    id: "g4",
    english: "I'll be right back, I need to grab a few things.",
    spanish: "Ahorita regreso, necesito buscar unas cosas.",
    category: "greetings",
    context: "Stepping out of the room",
    difficulty: 1,
  },
  // Panel: g5 removed "soon/pronto" — nurse can't promise doctor timing (Dr. Reyes)
  {
    id: "g5",
    english:
      "The doctor is planning to come talk with you. I'll let them know you're here.",
    spanish:
      "El doctor tiene planeado venir a hablar con usted. Le voy a avisar que usted está aquí.",
    category: "greetings",
    context:
      "Setting expectations for provider visit. Avoid promising specific timing.",
    difficulty: 1,
  },
  {
    id: "g6",
    english: "Good morning. How are you feeling today?",
    spanish: "Buenos días. ¿Cómo se siente hoy?",
    category: "greetings",
    context: "Checking in on parent's emotional state",
    difficulty: 1,
  },
  // Panel: g7 added "I'll call you if anything changes" (Maria: this is what makes parents leave)
  {
    id: "g7",
    english:
      "I'm the night nurse. I'll take good care of her. I'll call you if anything changes.",
    spanish:
      "Soy la enfermera de noche. La voy a cuidar bien. Le llamo si algo cambia.",
    category: "greetings",
    context:
      "Night shift handoff — parents leaving for the night. The added reassurance about calling is what makes parents actually leave.",
    difficulty: 1,
  },
  // Panel: g8 "si está preocupada" → "si le preocupa algo" (Elena: gender-neutral, more natural)
  {
    id: "g8",
    english: "You can call us anytime during the night if you're worried.",
    spanish:
      "Puede llamarnos a cualquier hora de la noche si le preocupa algo.",
    category: "greetings",
    context: "Reassuring parents who are leaving overnight",
    difficulty: 2,
  },
  // Panel: g9 REMOVED (unanimous — semantically confused, doesn't reflect shift change)
  // Panel: g9 REPLACED with correct shift-change phrase
  {
    id: "g9",
    english: "The next nurse is coming to meet you. Her name is ___.",
    spanish:
      "La siguiente enfermera va a venir a conocerla. Se llama ___.",
    category: "greetings",
    context:
      "Shift change handoff — outgoing nurse tells the family who is coming next",
    difficulty: 1,
  },
  // Panel: g10 "dar información" → "explicar todo" (Maria: nobody says "give you information")
  // Panel: g10 removed "pronto/soon" to avoid timing promises
  {
    id: "g10",
    english:
      "We're going to do rounds. The doctor will explain everything to you after.",
    spanish:
      "Vamos a hacer rondas. El doctor le va a explicar todo después.",
    category: "greetings",
    context: "Explaining the rounding process",
    difficulty: 2,
  },
  // Panel: NEW — interpreter request (5/6 reviewers: "the single most important missing phrase")
  {
    id: "g11",
    english:
      "I'm going to call an interpreter so we can communicate better.",
    spanish:
      "Voy a llamar a un intérprete para que nos podamos comunicar mejor.",
    category: "greetings",
    context:
      "Even a nurse with 7/10 Spanish must call a professional interpreter for consent discussions, bad news, and complex explanations. Joint Commission requirement.",
    difficulty: 1,
  },
  // Panel: NEW — the meta-phrase for Isabella's core situation (Maria/Elena)
  {
    id: "g12",
    english:
      "I don't speak Spanish perfectly, but I'm going to try my best to explain.",
    spanish:
      "No hablo español perfectamente, pero voy a hacer lo mejor que pueda para explicarle.",
    category: "greetings",
    context:
      "Acknowledging imperfect Spanish builds MORE trust than pretending to be fluent. Families respect honesty.",
    difficulty: 1,
  },
  // Panel: NEW — communication check before re-explaining (Maria: fundamental night shift phrase)
  {
    id: "g13",
    english: "Has anyone explained this to you already?",
    spanish: "¿Alguien ya le explicó esto?",
    category: "greetings",
    context:
      "Night shift check — verify what the family already heard before re-explaining or contradicting the day team",
    difficulty: 1,
  },
  // Panel: NEW — visiting hours (Maria/James: night shift enforcement gap)
  {
    id: "g14",
    english: "Visiting hours are over, but you can call us anytime.",
    spanish:
      "Ya terminó el horario de visitas, pero puede llamarnos cuando quiera.",
    category: "greetings",
    context:
      "Night shift visiting hours enforcement. Polite but clear. Culturally sensitive — large family presence is normal in Latino families.",
    difficulty: 1,
  },

  // --- COMFORT (18) ---
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
  // Panel: c5 "doing very well" → "been doing well today" (Dr. Kim: false reassurance danger)
  // Panel: c5 "luchadora" → "fuerte" (bounded, always true of NICU babies)
  {
    id: "c5",
    english: "Your baby is strong. She's been doing well today.",
    spanish: "Su bebé es muy fuerte. Ha estado bien hoy.",
    category: "comfort",
    context:
      "Positive reinforcement. ONLY use when the baby IS genuinely trending well. Do not use reflexively when status is uncertain or declining.",
    difficulty: 2,
  },
  // Panel: c6 "como padre" → "mamá" (all 6: "padre" means father, mothers are most common at bedside)
  {
    id: "c6",
    english: "You are doing a great job, mom.",
    spanish: "Usted está haciendo un gran trabajo, mamá.",
    category: "comfort",
    context:
      "Affirming parents who feel helpless in the NICU. Switch to 'papá' for fathers.",
    difficulty: 1,
  },
  {
    id: "c7",
    english: "Your baby knows your voice. Talk to her.",
    spanish: "Su bebé conoce su voz. Háblele.",
    category: "comfort",
    context: "Encouraging bonding through voice",
    difficulty: 1,
  },
  // Panel: c8 added safety context note (Dr. Kim: not every baby improves daily)
  {
    id: "c8",
    english: "Every day she gets a little stronger.",
    spanish: "Cada día ella se pone un poquito más fuerte.",
    category: "comfort",
    context:
      "Only use when genuinely trending well. Not every NICU baby improves daily — some plateau or deteriorate.",
    difficulty: 1,
  },
  {
    id: "c9",
    english:
      "I understand this is scary. We are watching her very closely.",
    spanish:
      "Entiendo que esto da miedo. La estamos vigilando muy de cerca.",
    category: "comfort",
    context: "After a desaturation or bradycardia event",
    difficulty: 2,
  },
  {
    id: "c10",
    english:
      "You are not alone. The social worker can help you with anything you need.",
    spanish:
      "Usted no está sola. La trabajadora social puede ayudarle con cualquier cosa que necesite.",
    category: "comfort",
    context: "Connecting family to support resources",
    difficulty: 2,
  },
  {
    id: "c11",
    english: "Take care of yourself too. Your baby needs you healthy.",
    spanish: "Cuídese usted también. Su bebé la necesita saludable.",
    category: "comfort",
    context: "Reminding parent to eat, sleep, rest",
    difficulty: 2,
  },
  // Panel: c12 "abrumada" → "agobiada" (Rosa: "abrumada" is literary, nobody in my family uses it)
  {
    id: "c12",
    english:
      "It's normal to feel overwhelmed. Many families feel the same way.",
    spanish:
      "Es normal sentirse agobiada. Muchas familias se sienten igual.",
    category: "comfort",
    context: "Normalizing NICU anxiety",
    difficulty: 2,
  },
  // Panel: NEW — after acute event, parents can return (Maria: must pair with "step outside")
  {
    id: "c13",
    english: "She's okay now. Everything is stable. You can come back in.",
    spanish: "Ya está bien. Todo está estable. Puede pasar.",
    category: "comfort",
    context:
      "After an acute event when parents were asked to step out. 'Puede pasar' is the natural way to say 'you can come in.'",
    difficulty: 1,
  },
  // Panel: NEW — alarm de-escalation reflex phrase (Maria: shorter than cl11 for 2am use)
  {
    id: "c14",
    english:
      "Don't be scared. The alarm doesn't always mean something bad.",
    spanish:
      "No se asuste. La alarma no siempre significa algo malo.",
    category: "comfort",
    context:
      "Quick-response alarm de-escalation. Shorter and faster than cl11 for 2am reflex use.",
    difficulty: 1,
  },
  // Panel: NEW — Rosa's cafeteria moment (every clinical reviewer admitted this was a blind spot)
  {
    id: "c15",
    english: "Have you eaten today? The cafeteria is on the first floor.",
    spanish: "¿Ha comido hoy? La cafetería está en el primer piso.",
    category: "comfort",
    context:
      "Basic human care for parents. Many skip meals because they don't know where to eat and are afraid to leave the baby.",
    difficulty: 1,
  },
  // Panel: NEW — night shift trust-building (Dr. Kim: most comforting thing a night nurse can say)
  {
    id: "c16",
    english:
      "I'm going to stay right here with your baby. I'm not leaving her alone.",
    spanish:
      "Me voy a quedar aquí con su bebé. No la voy a dejar sola.",
    category: "comfort",
    context:
      "Night shift trust-building. When parents leave their baby with a stranger at night.",
    difficulty: 1,
  },
  // Panel: NEW — baby can hear you (Rosa: "that was the first time I felt like her mother")
  {
    id: "c17",
    english:
      "Your baby can hear you even when she is sleeping. Your voice helps her.",
    spanish:
      "Su bebé la puede oír aunque esté dormida. Su voz la ayuda.",
    category: "comfort",
    context:
      "Empowering parents who feel useless sitting by the incubator.",
    difficulty: 1,
  },
  // Panel: NEW — bridge phrase between doctor jargon and family understanding (Dr. Reyes)
  {
    id: "c18",
    english:
      "I know the doctor used a lot of medical words. Would you like me to explain it in a simpler way?",
    spanish:
      "Sé que el doctor usó muchas palabras médicas. ¿Le gustaría que se lo explique de una manera más sencilla?",
    category: "comfort",
    context:
      "The bridge between physician communication and family understanding. Even with an interpreter, medical jargon translated literally is still incomprehensible.",
    difficulty: 2,
  },

  // --- STATUS UPDATES (15) ---
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
  {
    id: "s6",
    english: "Her temperature is normal.",
    spanish: "Su temperatura está normal.",
    category: "status-updates",
    context: "Routine vital sign report",
    difficulty: 1,
  },
  {
    id: "s7",
    english: "She gained weight since yesterday.",
    spanish: "Ella subió de peso desde ayer.",
    category: "status-updates",
    context: "Positive weight trend — parents love hearing this",
    difficulty: 1,
  },
  // Panel: s8 clinical Spanish → natural bedside Spanish (Maria/Elena)
  {
    id: "s8",
    english:
      "Her heart rate dropped a few times, but she recovered on her own.",
    spanish:
      "Se le bajó el corazón unas veces, pero se recuperó solita.",
    category: "status-updates",
    context:
      "Reporting bradycardia events — common in preemies. 'Solita' (diminutive) is warmer bedside language.",
    difficulty: 3,
  },
  {
    id: "s9",
    english: "Her oxygen levels have been steady all day.",
    spanish: "Sus niveles de oxígeno han estado estables todo el día.",
    category: "status-updates",
    context: "Pulse ox trending report",
    difficulty: 2,
  },
  {
    id: "s10",
    english: "We lowered her oxygen support today. That's good progress.",
    spanish:
      "Le bajamos el soporte de oxígeno hoy. Eso es buen progreso.",
    category: "status-updates",
    context: "Weaning respiratory support — milestone moment",
    difficulty: 2,
  },
  // Panel: s11 "hizo del baño" → "ensució el pañal" (all 6: "went to the bathroom" is odd for a neonate)
  {
    id: "s11",
    english: "She had a dirty diaper. That's a good sign.",
    spanish: "Ella ensució el pañal. Eso es una buena señal.",
    category: "status-updates",
    context:
      "GI function update — stooling is tracked closely. Use for normal stool output only.",
    difficulty: 1,
  },
  {
    id: "s12",
    english: "The doctor changed the plan today. I'll explain the new plan.",
    spanish:
      "El doctor cambió el plan hoy. Le voy a explicar el nuevo plan.",
    category: "status-updates",
    context: "When care plan changes after rounds",
    difficulty: 2,
  },
  // Panel: NEW — night shift phone call: something changed (Dr. Kim/Maria: lead with "stable")
  {
    id: "s13",
    english:
      "I'm calling because something changed with your baby. She is stable right now, but I need to tell you what happened.",
    spanish:
      "Le llamo porque algo cambió con su bebé. Ella está estable ahorita, pero necesito decirle lo que pasó.",
    category: "status-updates",
    context:
      "NIGHT SHIFT PHONE CALL — structured opening for calling parents at home. Lead with 'stable' to prevent panic.",
    difficulty: 2,
  },
  // Panel: NEW — night shift phone call: everything is fine (Maria: the "go back to sleep" call)
  {
    id: "s14",
    english:
      "Everything is fine. The baby had a good night. You can rest.",
    spanish:
      "Todo está bien. El bebé tuvo una buena noche. Puede descansar.",
    category: "status-updates",
    context:
      "NIGHT SHIFT PHONE CALL — reassuring call when parents phone at 2am to check on their baby.",
    difficulty: 1,
  },
  // Panel: NEW — quiet night report (Elena: the most common morning handoff phrase, completely absent)
  {
    id: "s15",
    english: "She had a quiet night. No events.",
    spanish: "Tuvo una noche tranquila. No tuvo ningún evento.",
    category: "status-updates",
    context:
      "Night-to-day reporting — the most common thing a night nurse says to parents arriving in the morning.",
    difficulty: 1,
  },
  // Panel: NEW — communicating clinical stability (Dr. Reyes: "same" is not bad news)
  {
    id: "s16",
    english: "She is not getting worse. She is the same as yesterday.",
    spanish: "No está empeorando. Está igual que ayer.",
    category: "status-updates",
    context:
      "Communicating clinical stability. Families often interpret 'no news' as bad news. This fills the middle ground.",
    difficulty: 1,
  },
  // Panel: NEW — re-explaining rounds (Dr. Reyes: "the single most important thing a NICU nurse does")
  {
    id: "s17",
    english:
      "The doctor discussed the plan during rounds. Let me go over it with you again.",
    spanish:
      "El doctor habló del plan durante las rondas. Déjeme repasarlo con usted.",
    category: "status-updates",
    context:
      "Re-explaining the care plan in language families understand.",
    difficulty: 2,
  },

  // --- CLINICAL (16) ---
  // Panel: cl1 "goes directly to the blood" alarming (Dr. Reyes); families say "el suero" not "IV" (Elena)
  {
    id: "cl1",
    english:
      "This is TPN. It's nutrition that goes through the IV into her vein — like food for babies who aren't ready to eat yet.",
    spanish:
      "Esto es nutrición por la vena. Es una forma de alimentar al bebé por el suero que va directo a la sangre.",
    category: "clinical",
    context:
      "From Isabella's TPN story. Families call the IV 'el suero' or 'la venita' rather than 'IV.'",
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
  // Panel: cl3 "basado en" → "según" (Elena: "basado en" is an Anglicism)
  {
    id: "cl3",
    english:
      "Two nurses need to verify because we have to calculate it based on the baby's weight.",
    spanish:
      "Dos enfermeras necesitan verificar porque tenemos que calcularlo según el peso del bebé.",
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
  {
    id: "cl6",
    english:
      "Your baby has jaundice. We're going to use a special light to treat it.",
    spanish:
      "Su bebé tiene ictericia. Vamos a usar una luz especial para tratarla.",
    category: "clinical",
    context: "Explaining phototherapy for hyperbilirubinemia",
    difficulty: 2,
  },
  {
    id: "cl7",
    english:
      "The yellow color in her skin is from bilirubin. The light helps break it down.",
    spanish:
      "El color amarillo en su piel es por la bilirrubina. La luz ayuda a descomponerla.",
    category: "clinical",
    context: "Follow-up explanation for jaundice treatment",
    difficulty: 3,
  },
  // Panel: cl8 reframed — nurse reinforces doctor's explanation, not initiates (Dr. Reyes: scope of practice)
  {
    id: "cl8",
    english:
      "The doctor explained that the baby needs a blood transfusion. Do you have any questions about what the doctor told you?",
    spanish:
      "El doctor explicó que el bebé necesita una transfusión de sangre. ¿Tiene alguna pregunta sobre lo que le dijo el doctor?",
    category: "clinical",
    context:
      "Reinforcing the physician's explanation about PRBC transfusion. Transfusion requires informed consent obtained by the physician.",
    difficulty: 3,
  },
  // Panel: cl9 "Es como le damos la leche" → "Por ahí le damos la leche" (Elena: unambiguous)
  {
    id: "cl9",
    english:
      "This tube in her nose goes to her stomach. That's how we give her milk.",
    spanish:
      "Este tubo en su nariz va al estómago. Por ahí le damos la leche.",
    category: "clinical",
    context: "Explaining NG/OG tube for gavage feeding",
    difficulty: 2,
  },
  {
    id: "cl10",
    english:
      "The incubator keeps the baby warm because she can't regulate her own temperature yet.",
    spanish:
      "La incubadora mantiene al bebé caliente porque todavía no puede regular su propia temperatura.",
    category: "clinical",
    context: "Explaining isolette/incubator purpose",
    difficulty: 2,
  },
  {
    id: "cl11",
    english:
      "When the alarm sounds, it doesn't always mean something is wrong. Sometimes the baby just moves.",
    spanish:
      "Cuando suena la alarma, no siempre significa que algo está mal. A veces el bebé solo se mueve.",
    category: "clinical",
    context: "De-escalating alarm anxiety — very common parent fear",
    difficulty: 2,
  },
  {
    id: "cl12",
    english:
      "Her lungs are still developing. That's why she needs help breathing.",
    spanish:
      "Sus pulmones todavía están desarrollándose. Por eso necesita ayuda para respirar.",
    category: "clinical",
    context: "Explaining respiratory distress in premature infants",
    difficulty: 2,
  },
  // Panel: NEW — emergency phrase, highest priority (Maria/Dr. Kim: "the most critical gap")
  {
    id: "cl13",
    english:
      "Your baby is having trouble breathing. We're helping her right now.",
    spanish:
      "Su bebé está teniendo problemas para respirar. La estamos ayudando ahorita.",
    category: "clinical",
    context:
      "EMERGENCY — drill until automatic. Use during acute desaturation or respiratory distress. Must be retrievable on pure muscle memory at 3am.",
    difficulty: 1,
  },
  // Panel: NEW — allergy verification (James: patient safety gap, near-miss witnessed)
  {
    id: "cl14",
    english: "Does your baby have any allergies?",
    spanish: "¿Su bebé tiene alguna alergia?",
    category: "clinical",
    context:
      "PATIENT SAFETY — allergy verification is a fundamental safety check. Must be difficulty 1.",
    difficulty: 1,
  },
  // Panel: NEW — night shift escalation (Maria: most common urgent night phrase)
  {
    id: "cl15",
    english: "I need to call the doctor. Please wait here.",
    spanish: "Necesito llamar al doctor. Por favor espere aquí.",
    category: "clinical",
    context:
      "Night shift escalation — communicate calmly that you are escalating without causing panic.",
    difficulty: 1,
  },
  // Panel: NEW — night shift de-escalation after escalation (Maria: lead with reassurance)
  {
    id: "cl16",
    english:
      "The baby is okay, but I need to call the doctor to let them know what happened.",
    spanish:
      "El bebé está bien, pero necesito llamar al doctor para avisarle lo que pasó.",
    category: "clinical",
    context:
      "Night shift de-escalation — say 'the baby is okay' FIRST, then explain you are calling the doctor. Order matters.",
    difficulty: 2,
  },

  // --- FAMILY QUESTIONS (12) ---
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
    spanish:
      "¿Cuánto tiempo hasta que el bebé pueda respirar por sí solo?",
    category: "family-questions",
    context: "Parent asking about respiratory timeline",
    difficulty: 2,
  },
  // Panel: fq4 REMOVED (all 6: subjunctive grammar error + "vomitar" ≠ spit-up)
  // Panel: fq4 REPLACED with corrected version
  {
    id: "fq4",
    english: "Is it normal that the baby spit up?",
    spanish: "¿Es normal que el bebé devuelva la leche?",
    category: "family-questions",
    context:
      "Common feeding concern. 'Devolver la leche' (return the milk) is softer than 'vomitar' and more accurate for spit-up. True vomiting (especially green/bilious) is a medical emergency.",
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
  {
    id: "fq6",
    english: "When can I hold my baby?",
    spanish: "¿Cuándo puedo cargar a mi bebé?",
    category: "family-questions",
    context: "Parents eager for skin-to-skin or holding",
    difficulty: 1,
  },
  {
    id: "fq7",
    english: "Why does she have so many wires?",
    spanish: "¿Por qué tiene tantos cables?",
    category: "family-questions",
    context: "Parents alarmed by monitoring leads and IV lines",
    difficulty: 1,
  },
  {
    id: "fq8",
    english: "Can I bring clothes from home for the baby?",
    spanish: "¿Puedo traer ropa de casa para el bebé?",
    category: "family-questions",
    context: "Parents wanting to personalize the space",
    difficulty: 1,
  },
  {
    id: "fq9",
    english: "Is my baby in pain?",
    spanish: "¿Mi bebé tiene dolor?",
    category: "family-questions",
    context: "Parent concern during procedures or fussiness",
    difficulty: 1,
  },
  {
    id: "fq10",
    english: "When will the baby be able to go home?",
    spanish: "¿Cuándo va a poder irse a casa el bebé?",
    category: "family-questions",
    context: "The most common NICU question",
    difficulty: 2,
  },
  {
    id: "fq11",
    english: "Can my other children visit?",
    spanish: "¿Pueden venir mis otros hijos a visitar?",
    category: "family-questions",
    context: "Sibling visitation policy questions",
    difficulty: 1,
  },
  {
    id: "fq12",
    english: "Why is the baby's skin so red?",
    spanish: "¿Por qué la piel del bebé está tan roja?",
    category: "family-questions",
    context: "Common concern about premature skin appearance",
    difficulty: 1,
  },

  // --- VERB DRILLS (12) ---
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
  {
    id: "v6",
    english: "The baby was crying but she calmed down. (past)",
    spanish: "El bebé estaba llorando pero se calmó.",
    category: "verb-drills",
    context: "Imperfect vs preterite contrast",
    difficulty: 2,
  },
  // Panel: v7 "alimentarla" → "darle de comer" (Maria/Elena: gender mismatch + more natural)
  {
    id: "v7",
    english: "We have to weigh the baby before feeding. (obligation)",
    spanish: "Tenemos que pesar al bebé antes de darle de comer.",
    category: "verb-drills",
    context: "Tener que + infinitive — expressing obligation",
    difficulty: 2,
  },
  {
    id: "v8",
    english: "Can you wash your hands before touching her? (request)",
    spanish: "¿Puede lavarse las manos antes de tocarla?",
    category: "verb-drills",
    context: "Polite request with poder — infection control",
    difficulty: 2,
  },
  {
    id: "v9",
    english: "She was sleeping when we checked on her. (past)",
    spanish: "Ella estaba durmiendo cuando la revisamos.",
    category: "verb-drills",
    context: "Imperfect for background + preterite for interruption",
    difficulty: 3,
  },
  {
    id: "v10",
    english:
      "I hope the baby tolerates the feeding well. (subjunctive)",
    spanish: "Espero que el bebé tolere bien la alimentación.",
    category: "verb-drills",
    context: "Subjunctive after esperar que — expressing hope",
    difficulty: 3,
  },
  {
    id: "v11",
    english: "The nurse already gave her the medicine. (past)",
    spanish: "La enfermera ya le dio la medicina.",
    category: "verb-drills",
    context: "Preterite of dar with indirect object pronoun",
    difficulty: 2,
  },
  // Panel: v12 scope-of-practice fix — nurse can't promise discharge (Dr. Reyes)
  // Panel: v12 grammar label corrected — this is present indicative, not conditional (James)
  {
    id: "v12",
    english:
      "If she keeps improving, the doctor will talk about going home. (conditional)",
    spanish:
      "Si sigue mejorando, el doctor va a hablar sobre irse a casa.",
    category: "verb-drills",
    context:
      "Si + present indicative for real/likely condition. Only the attending should make discharge timeline promises.",
    difficulty: 3,
  },

  // --- DISCHARGE (11) ---
  {
    id: "d1",
    english:
      "Before the baby goes home, we need to teach you some important things.",
    spanish:
      "Antes de que el bebé se vaya a casa, necesitamos enseñarle algunas cosas importantes.",
    category: "discharge",
    context: "Starting discharge teaching — sets expectations",
    difficulty: 2,
  },
  {
    id: "d2",
    english: "Do you have a car seat? We need to do a car seat test.",
    spanish:
      "¿Tiene un asiento de carro? Necesitamos hacer una prueba de asiento de carro.",
    category: "discharge",
    context: "Car seat test requirement before discharge",
    difficulty: 2,
  },
  {
    id: "d3",
    english:
      "You need to keep the baby away from sick people for the first few months.",
    spanish:
      "Necesita mantener al bebé lejos de personas enfermas durante los primeros meses.",
    category: "discharge",
    context: "Infection prevention teaching — RSV season especially",
    difficulty: 2,
  },
  {
    id: "d4",
    english: "The baby has a follow-up appointment on this date.",
    spanish: "El bebé tiene una cita de seguimiento en esta fecha.",
    category: "discharge",
    context: "Scheduling follow-up visits",
    difficulty: 1,
  },
  // Panel: d5 added "morado" (purple) first — many Latino families use this for cyanosis
  // Panel: d5 added fever as warning sign (Dr. Kim: most common reason NICU graduates are readmitted)
  // Panel: d5 difficulty 2→1 (Maria/James: critical safety, must be drilled maximum)
  {
    id: "d5",
    english:
      "If the baby turns blue or purple, stops breathing, has a fever, or won't eat, call 911 right away.",
    spanish:
      "Si el bebé se pone morado o azul, deja de respirar, tiene fiebre, o no quiere comer, llame al 911 inmediatamente.",
    category: "discharge",
    context:
      "Teaching warning signs — critical safety info. 'Morado' (purple) first — many Latino families use this for cyanosis.",
    difficulty: 1,
  },
  {
    id: "d6",
    english: "Always put the baby on her back to sleep.",
    spanish: "Siempre ponga al bebé boca arriba para dormir.",
    category: "discharge",
    context: "Safe sleep teaching — back to sleep",
    difficulty: 1,
  },
  // Panel: d7 "peluches" → "muñecos de peluche" (Maria: more natural Mex/Central Am)
  {
    id: "d7",
    english: "No blankets, pillows, or stuffed animals in the crib.",
    spanish:
      "No ponga cobijas, almohadas, ni muñecos de peluche en la cuna.",
    category: "discharge",
    context: "Safe sleep environment — SIDS prevention",
    difficulty: 1,
  },
  {
    id: "d8",
    english:
      "You'll need to give the baby this medicine at home. Let me show you how.",
    spanish:
      "Va a necesitar darle esta medicina al bebé en casa. Déjeme enseñarle cómo.",
    category: "discharge",
    context: "Medication administration teaching",
    difficulty: 2,
  },
  // Panel: d9 "necesita ser visto" → "necesita que lo vean" (Dr. Reyes/Elena: Spanish prefers active voice)
  {
    id: "d9",
    english:
      "Do you have a pediatrician? The baby will need to be seen within a few days.",
    spanish:
      "¿Tiene un pediatra? El bebé necesita que lo vean dentro de unos días.",
    category: "discharge",
    context: "Ensuring follow-up care is arranged",
    difficulty: 2,
  },
  {
    id: "d10",
    english: "Before you leave, I need you to sign some papers.",
    spanish: "Antes de irse, necesito que firme unos papeles.",
    category: "discharge",
    context: "Discharge paperwork with subjunctive — necesitar que",
    difficulty: 2,
  },
  // Panel: NEW — home remedy safety (James: readmissions from traditional remedies)
  {
    id: "d11",
    english:
      "Do not give the baby any other medicine, tea, or home remedies without asking the doctor first.",
    spanish:
      "No le dé al bebé ninguna otra medicina, té, ni remedios caseros sin consultar con el doctor primero.",
    category: "discharge",
    context:
      "Critical discharge safety teaching. Some families use traditional remedies that can be dangerous for preemies. Frame as safety, not judgment.",
    difficulty: 2,
  },

  // --- MEDICATIONS (10) ---
  // Panel: med1 "remember to breathe" is medically inaccurate and frightens parents (Dr. Reyes)
  // Panel: Rosa: "I thought they were giving her coffee. I was terrified."
  {
    id: "med1",
    english:
      "The baby is receiving caffeine to help stimulate her breathing. It's very common for premature babies.",
    spanish:
      "El bebé está recibiendo cafeína para ayudar a estimular su respiración. Es muy común en bebés prematuros.",
    category: "medications",
    context:
      "Caffeine citrate for apnea of prematurity. The normalizing sentence reduces parental anxiety.",
    difficulty: 2,
  },
  {
    id: "med2",
    english: "This medicine is to protect her stomach.",
    spanish: "Esta medicina es para proteger su estómago.",
    category: "medications",
    context: "Explaining famotidine or other GI meds",
    difficulty: 1,
  },
  {
    id: "med3",
    english:
      "She needs iron drops because premature babies use up their iron faster.",
    spanish:
      "Ella necesita gotas de hierro porque los bebés prematuros usan su hierro más rápido.",
    category: "medications",
    context: "Iron supplementation for preemies",
    difficulty: 2,
  },
  {
    id: "med4",
    english:
      "We're giving her antibiotics because she might have an infection.",
    spanish:
      "Le estamos dando antibióticos porque puede tener una infección.",
    category: "medications",
    context: "Empiric antibiotics for suspected sepsis workup",
    difficulty: 2,
  },
  {
    id: "med5",
    english:
      "This vitamin helps the baby absorb calcium and grow strong bones.",
    spanish:
      "Esta vitamina ayuda al bebé a absorber calcio y tener huesos fuertes.",
    category: "medications",
    context: "Vitamin D supplementation",
    difficulty: 2,
  },
  // Panel: med6 reframed — nurse reinforces doctor, doesn't initiate (Dr. Reyes: PDA requires consent)
  {
    id: "med6",
    english:
      "The doctor talked to you about the medicine to help close the small opening in her heart. I'm going to start it now. Let me know if you have any questions.",
    spanish:
      "El doctor le habló sobre la medicina para ayudar a cerrar la pequeña abertura en su corazón. Se la voy a empezar ahora. Avíseme si tiene alguna pregunta.",
    category: "medications",
    context:
      "PDA treatment with indomethacin/ibuprofen/acetaminophen. Requires physician discussion and parental consent. Nurse reinforces and administers.",
    difficulty: 3,
  },
  // Panel: med7 REMOVED (erythromycin is L&D, not NICU — neonatologists' call)
  // Panel: med7 REPLACED with pain management response (Rosa: "I needed an ANSWER")
  {
    id: "med7",
    english:
      "We gave her medicine for pain. She is comfortable now.",
    spanish: "Le dimos medicina para el dolor. Ahora está cómoda.",
    category: "medications",
    context:
      "Response to family question fq9 ('Is my baby in pain?'). The family-questions category has the question — the nurse needs the ANSWER too.",
    difficulty: 1,
  },
  {
    id: "med8",
    english:
      "She's getting a vaccine today. She might be fussy afterwards.",
    spanish:
      "Hoy le van a poner una vacuna. Puede estar irritable después.",
    category: "medications",
    context: "Immunizations in NICU — setting expectations",
    difficulty: 2,
  },
  {
    id: "med9",
    english:
      "Give her the medicine with a syringe in the side of her mouth.",
    spanish:
      "Dele la medicina con una jeringa en el lado de la boca.",
    category: "medications",
    context: "Teaching oral medication administration at home",
    difficulty: 2,
  },
  // Panel: med10 "Dejamos" → "Le suspendimos" (Dr. Reyes: "dejamos" could mean "we left" not "we stopped")
  {
    id: "med10",
    english:
      "We stopped the antibiotics because the cultures came back negative. That's good news.",
    spanish:
      "Le suspendimos los antibióticos porque los cultivos salieron negativos. Eso es una buena noticia.",
    category: "medications",
    context: "Explaining antibiotic discontinuation after sepsis workup",
    difficulty: 3,
  },

  // --- PROCEDURES (12) ---
  // Panel: pr1 difficulty 2→1 (James: one of the most frequent things said, sometimes multiple times/shift)
  {
    id: "pr1",
    english: "We need to take a small amount of blood for a test.",
    spanish:
      "Necesitamos sacar una pequeña cantidad de sangre para un examen.",
    category: "procedures",
    context: "Heel stick or lab draw — very frequent in NICU",
    difficulty: 1,
  },
  {
    id: "pr2",
    english:
      "The baby is going to have a hearing test. It doesn't hurt.",
    spanish:
      "Le van a hacer una prueba de audición al bebé. No duele.",
    category: "procedures",
    context: "Newborn hearing screen — required before discharge",
    difficulty: 1,
  },
  // Panel: pr3 "Un doctor" → "El doctor" (Elena: definite article is natural Spanish)
  {
    id: "pr3",
    english: "The eye doctor is going to check the baby's eyes today.",
    spanish:
      "El doctor de los ojos va a revisar los ojos del bebé hoy.",
    category: "procedures",
    context: "ROP eye exam — routine for preemies",
    difficulty: 1,
  },
  {
    id: "pr4",
    english:
      "We need to put in a new IV because this one stopped working.",
    spanish:
      "Necesitamos poner una nueva IV porque esta dejó de funcionar.",
    category: "procedures",
    context: "IV restart — parents worry about repeated pokes",
    difficulty: 2,
  },
  {
    id: "pr5",
    english:
      "We're going to do an ultrasound of her head to check her brain.",
    spanish:
      "Vamos a hacerle un ultrasonido de la cabeza para revisar su cerebro.",
    category: "procedures",
    context: "Head ultrasound for IVH screening",
    difficulty: 2,
  },
  {
    id: "pr6",
    english:
      "The baby needs an X-ray to check the position of the tube.",
    spanish:
      "El bebé necesita una radiografía para verificar la posición del tubo.",
    category: "procedures",
    context: "Chest/abdominal X-ray for line or tube placement",
    difficulty: 2,
  },
  {
    id: "pr7",
    english:
      "I'm going to suction her nose and mouth to help her breathe better.",
    spanish:
      "Voy a succionarle la nariz y la boca para ayudarla a respirar mejor.",
    category: "procedures",
    context: "Routine suctioning for secretions",
    difficulty: 2,
  },
  {
    id: "pr8",
    english:
      "We're going to give her a bath today. Would you like to help?",
    spanish:
      "Hoy le vamos a dar un baño. ¿Le gustaría ayudar?",
    category: "procedures",
    context: "Including parents in care — bonding opportunity",
    difficulty: 1,
  },
  // Panel: pr9 reframed — circumcision is elective, requires consent from both parents (Dr. Reyes)
  {
    id: "pr9",
    english:
      "The doctor will talk to you about circumcision if you're interested. It's your decision.",
    spanish:
      "El doctor le va a hablar sobre la circuncisión si le interesa. Es su decisión.",
    category: "procedures",
    context:
      "Circumcision is elective and requires signed informed consent. Never present it as already decided.",
    difficulty: 2,
  },
  {
    id: "pr10",
    english:
      "We use sugar water on a pacifier to help with pain during the procedure.",
    spanish:
      "Usamos agua con azúcar en un chupón para ayudar con el dolor durante el procedimiento.",
    category: "procedures",
    context: "Sucrose for non-pharmacological pain management",
    difficulty: 2,
  },
  // Panel: NEW — ask parents to step outside during acute event (Maria/Dr. Kim)
  {
    id: "pr11",
    english:
      "I need you to step outside for a moment. I'll come get you when we're done.",
    spanish:
      "Necesito que salga un momento. Vengo a buscarla cuando terminemos.",
    category: "procedures",
    context:
      "EMERGENCY — for acute events when parents need to leave the room. The subjunctive 'necesito que salga' is important to drill.",
    difficulty: 2,
  },
  // Panel: NEW — consent facilitation (James/Dr. Reyes: complete absence of consent language)
  {
    id: "pr12",
    english:
      "I need your permission before we do this procedure. Do you have any questions?",
    spanish:
      "Necesito su permiso antes de hacer este procedimiento. ¿Tiene alguna pregunta?",
    category: "procedures",
    context:
      "Consent facilitation. Nurses don't obtain informed consent (physician's role), but they ensure the family knows they have the right to ask questions.",
    difficulty: 2,
  },

  // --- FEEDING (13) ---
  // Panel: f1 missing comma changes meaning (Dr. Kim: "poquita ayuda" vs "poquita, ayuda")
  {
    id: "f1",
    english:
      "Breast milk is the best nutrition for your baby. Even a small amount helps.",
    spanish:
      "La leche materna es la mejor nutrición para su bebé. Aunque sea poquita, ayuda.",
    category: "feeding",
    context: "Encouraging breastmilk — even colostrum matters",
    difficulty: 2,
  },
  {
    id: "f2",
    english:
      "You can pump every three hours to keep your milk supply.",
    spanish:
      "Puede sacarse leche cada tres horas para mantener su producción.",
    category: "feeding",
    context: "Pumping schedule guidance",
    difficulty: 2,
  },
  {
    id: "f3",
    english:
      "We add a supplement to your breast milk to help the baby grow faster.",
    spanish:
      "Le agregamos un suplemento a su leche materna para ayudar al bebé a crecer más rápido.",
    category: "feeding",
    context: "Human milk fortifier explanation",
    difficulty: 2,
  },
  {
    id: "f4",
    english:
      "The baby is learning how to suck, swallow, and breathe at the same time.",
    spanish:
      "El bebé está aprendiendo a chupar, tragar y respirar al mismo tiempo.",
    category: "feeding",
    context: "Explaining oral feeding readiness",
    difficulty: 2,
  },
  // Panel: f5 "botella" → "biberón" (Elena: "botella" means any bottle, baby bottle is "biberón")
  {
    id: "f5",
    english: "She finished the whole bottle! That's great.",
    spanish: "¡Se tomó todo el biberón! Qué bien.",
    category: "feeding",
    context: "Celebrating feeding milestones",
    difficulty: 1,
  },
  // Panel: f6 "botella" → "biberón"
  {
    id: "f6",
    english:
      "Right now we're feeding her through the tube, but soon she'll start practicing with a bottle.",
    spanish:
      "Ahora la estamos alimentando por el tubo, pero pronto va a empezar a practicar con el biberón.",
    category: "feeding",
    context: "Transitioning from gavage to oral feeds",
    difficulty: 2,
  },
  {
    id: "f7",
    english:
      "Would you like to try breastfeeding today? I can help you with positioning.",
    spanish:
      "¿Le gustaría intentar amamantar hoy? Le puedo ayudar con la posición.",
    category: "feeding",
    context: "Offering first breastfeeding attempt",
    difficulty: 2,
  },
  // Panel: f8 "ponga el nombre... en la leche" → "etiquete la leche con..." (Maria: literally says "put the name on the milk")
  {
    id: "f8",
    english:
      "Please label the milk with the baby's name, date, and time.",
    spanish:
      "Por favor etiquete la leche con el nombre del bebé, la fecha y la hora.",
    category: "feeding",
    context: "Breastmilk labeling requirements",
    difficulty: 2,
  },
  {
    id: "f9",
    english:
      "She's showing hunger cues — she's sucking on her hand.",
    spanish:
      "Ella está mostrando señales de hambre — se está chupando la mano.",
    category: "feeding",
    context: "Teaching parents to recognize feeding cues",
    difficulty: 2,
  },
  // Panel: f10 "comida" → "leche" (5 reviewers: babies drink milk, not food); "lo" → "la" (agrees with "la leche")
  {
    id: "f10",
    english:
      "We increased her feeding amount today because she's tolerating it well.",
    spanish:
      "Le aumentamos la cantidad de leche hoy porque la está tolerando bien.",
    category: "feeding",
    context: "Feed advancement — parents track this closely",
    difficulty: 2,
  },
  // Panel: NEW — formula supplementation (Elena: feeding section is breastmilk-biased, many families use formula)
  {
    id: "f11",
    english:
      "We're going to use formula to supplement while your milk comes in.",
    spanish:
      "Vamos a usar fórmula para complementar mientras le baja la leche.",
    category: "feeding",
    context:
      "Many NICU families use formula. 'Mientras le baja la leche' is the natural way families talk about milk coming in.",
    difficulty: 2,
  },
  // Panel: NEW — lactation support referral (James: breastfeeding rate disparities for Spanish-speaking families)
  {
    id: "f12",
    english:
      "The lactation consultant can come help you. Would you like me to call her?",
    spanish:
      "La consultora de lactancia puede venir a ayudarle. ¿Quiere que la llame?",
    category: "feeding",
    context:
      "Spanish-speaking mothers are significantly less likely to receive lactation support due to language barriers.",
    difficulty: 2,
  },
  // Panel: NEW — pumping room directions (Rosa: pumped in a bathroom stall for a week)
  {
    id: "f13",
    english:
      "The pumping room is down the hall. I can show you where it is.",
    spanish:
      "El cuarto para sacarse leche está al final del pasillo. Le puedo mostrar dónde queda.",
    category: "feeding",
    context:
      "Practical logistics for breastfeeding mothers. Many moms are too embarrassed to ask.",
    difficulty: 1,
  },

  // --- SKIN-TO-SKIN (10) ---
  {
    id: "sk1",
    english:
      "Would you like to do skin-to-skin? It's very good for the baby.",
    spanish:
      "¿Le gustaría hacer piel a piel? Es muy bueno para el bebé.",
    category: "skin-to-skin",
    context: "Offering kangaroo care — major bonding moment",
    difficulty: 1,
  },
  // Panel: sk2 softened "Abra su camisa" (blunt) → added "por favor" and "get comfortable" (Maria/James)
  // Panel: sk2 difficulty 1→2 (James: involves sequence of instructions + physical handoff)
  {
    id: "sk2",
    english:
      "Please open the front of your shirt and get comfortable. I'll place the baby on your chest.",
    spanish:
      "Por favor abra su camisa y póngase cómoda. Le voy a poner al bebé en su pecho.",
    category: "skin-to-skin",
    context:
      "Positioning instructions for kangaroo care. Ensure the parent is settled before transferring the baby.",
    difficulty: 2,
  },
  // Panel: sk3 "sentirse segura" → "sentirse seguro" (bebé is grammatically masculine in Spanish)
  {
    id: "sk3",
    english:
      "Skin-to-skin helps the baby stay warm, breathe better, and feel safe.",
    spanish:
      "El contacto piel a piel ayuda al bebé a mantenerse caliente, respirar mejor y sentirse seguro.",
    category: "skin-to-skin",
    context: "Explaining benefits of kangaroo care",
    difficulty: 2,
  },
  {
    id: "sk4",
    english:
      "Hold her upright on your chest. Support her head with your hand.",
    spanish:
      "Sosténgala en posición vertical en su pecho. Sostenga su cabeza con la mano.",
    category: "skin-to-skin",
    context: "Safe positioning guidance during kangaroo care",
    difficulty: 2,
  },
  {
    id: "sk5",
    english:
      "Look, the baby's heart rate is more stable when you hold her.",
    spanish:
      "Mire, la frecuencia cardíaca del bebé está más estable cuando usted la carga.",
    category: "skin-to-skin",
    context: "Showing parents the physiologic benefit in real time",
    difficulty: 2,
  },
  {
    id: "sk6",
    english: "Dad can do skin-to-skin too. It's not just for mom.",
    spanish:
      "Papá también puede hacer piel a piel. No es solo para mamá.",
    category: "skin-to-skin",
    context: "Including fathers in kangaroo care",
    difficulty: 1,
  },
  {
    id: "sk7",
    english:
      "If you need to use the bathroom, let me know and I'll take her.",
    spanish:
      "Si necesita ir al baño, avíseme y yo la tomo.",
    category: "skin-to-skin",
    context: "Practical logistics during extended kangaroo care",
    difficulty: 1,
  },
  {
    id: "sk8",
    english:
      "She fell asleep on your chest. That means she feels safe with you.",
    spanish:
      "Se durmió en su pecho. Eso quiere decir que se siente segura con usted.",
    category: "skin-to-skin",
    context: "Reinforcing the parent-baby bond",
    difficulty: 2,
  },
  // Panel: NEW — permission to touch (Rosa: "I was afraid to touch Sofia for three days")
  {
    id: "sk9",
    english: "You can touch her. Gently, like this.",
    spanish: "Puede tocarla. Suavecito, así.",
    category: "skin-to-skin",
    context:
      "Permission to touch. Many parents are afraid to touch their baby because of all the wires. 'Suavecito' (gentle diminutive) is exactly how nurses say this.",
    difficulty: 1,
  },
  // Panel: NEW — baptism (James: culturally urgent for Catholic Latino families with critically ill babies)
  {
    id: "sk10",
    english:
      "Would you like your baby to be baptized? We can arrange that.",
    spanish:
      "¿Le gustaría que bautizaran a su bebé? Podemos arreglar eso.",
    category: "skin-to-skin",
    context:
      "Spiritual care for Latino families. Baptism is culturally urgent for Catholic families when a baby is critically ill.",
    difficulty: 2,
  },

  // --- CLINICAL (continued) — post-surgical & graceful exit ---
  // Panel: NEW — surgery went well (Rosa: "those two words were the most important in 98 days")
  {
    id: "cl17",
    english:
      "The surgery went well. The doctor will come explain everything to you.",
    spanish:
      "La cirugía salió bien. El doctor va a venir a explicarle todo.",
    category: "clinical",
    context:
      "Post-surgical communication. Parents need to hear 'it went well' as soon as possible. Defer details to the surgeon.",
    difficulty: 2,
  },
  // Panel: NEW — graceful exit when hitting a word she can't produce (Dr. Reyes: "the most important phrase in the entire app")
  {
    id: "cl18",
    english:
      "I'm sorry, I don't know that word in Spanish. Let me find someone who can help.",
    spanish:
      "Lo siento, no sé esa palabra en español. Déjeme buscar a alguien que pueda ayudar.",
    category: "clinical",
    context:
      "Graceful exit when Isabella hits a word she cannot produce. Admitting limitation IS good nursing practice.",
    difficulty: 1,
  },
];

export function getPhrasesByCategory(category: PhraseCategory): Phrase[] {
  return PHRASES.filter((p) => p.category === category);
}

export function getCategories(): PhraseCategory[] {
  return Object.keys(CATEGORY_META) as PhraseCategory[];
}

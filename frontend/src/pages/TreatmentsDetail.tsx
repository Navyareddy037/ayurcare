import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  Activity, CheckCircle2, Calendar, ChevronRight, Heart, 
  Info, List, ShieldCheck, HelpCircle, ArrowRight, ShieldAlert
} from 'lucide-react';

interface TreatmentData {
  title: string;
  category: string;
  overview: string;
  symptoms: string[];
  causes: string[];
  diagnosis: string;
  process: string;
  benefits: string[];
  lifestyle: string[];
  diet: string[];
  faqs: { q: string; a: string }[];
  doctors: { name: string; spec: string }[];
}

const TREATMENTS_REGISTRY: Record<string, TreatmentData> = {
  'arthritis': {
    title: 'Arthritis & Joint Care (Sandhigata Vata)',
    category: 'Musculoskeletal',
    overview: 'In Ayurveda, arthritis is primarily linked to high accumulation of toxic metabolic waste (Ama) and aggravation of Vata dosha, which dries up joint lubricating fluids causing friction and pain.',
    symptoms: ['Persistent joint pain and stiffness', 'Swelling and warmth around joint cavities', 'Reduced range of motion', 'Cracking sounds (crepitus) on movement'],
    causes: ['Impaired digestion leading to Ama buildup', 'Incompatible dietary habits (Viruddha Ahara)', 'Overexertion or physical injury to joints', 'Excessive cold exposure'],
    diagnosis: 'Assessment of digestive capacity (Agni), examination of Ama coated tongue, joint mobility evaluation, and checking Vata aggravation markers.',
    process: 'Deep cleansing to digest Ama, followed by Abhyanga (medicated oil massage), Patra Pinda Sweda (herbal poultice steam), and Janu Basti (retaining warm oil pooling over joints).',
    benefits: ['Substantial reduction in pain and inflammation', 'Restored joint lubrication and flexibility', 'Detoxification of deep synovial tissues', 'Improved localized circulation'],
    lifestyle: ['Perform gentle joint rotation exercises daily', 'Avoid cold drafts and keep joints warmly covered', 'Maintain a structured sleep cycle'],
    diet: ['Favor warm, freshly cooked stews with ghee', 'Incorporate ginger, turmeric, and garlic', 'Avoid gas-producing foods (cabbage, raw sprouts) and carbonated drinks'],
    faqs: [
      { q: 'How soon can I see results in knee pain?', a: 'Mild cases show improvement within 7-10 days of starting Kati/Janu Basti. Chronic osteoarthritis may require continuous 21-day cycles.' }
    ],
    doctors: [
      { name: 'Dr. Madhavan Namboothiri', spec: 'Orthopedic Ayurveda' }
    ]
  },
  'diabetes': {
    title: 'Diabetes Management (Madhumeha)',
    category: 'Metabolic',
    overview: 'Madhumeha is classified as a Vata-type metabolic imbalance caused by excessive Kapha accumulation, leading to depletion of bodily tissues (Ojas) and urinary disorders.',
    symptoms: ['Frequent urination (polyuria)', 'Excessive thirst and dry mouth', 'Unexplained fatigue and weight loss', 'Slow healing of skin cuts'],
    causes: ['Sedentary lifestyle and lack of physical exercise', 'Excessive consumption of sweet, heavy, and oily foods', 'Sleeping during daytime hours'],
    diagnosis: 'Evaluation of urine density, checking Kapha-aggravating daily habits, and checking patient metabolic indexes.',
    process: 'Agni stimulation to process toxins, metabolic correction using bitter herbs (Neem, Karela, Vijaysar), followed by Udvartana (herbal powder massage) to reduce fat tissue.',
    benefits: ['Supports stabilization of blood sugar levels', 'Prevents secondary complications (neuropathy, kidney fatigue)', 'Rejuvenates pancreatic cells and tissue metabolism'],
    lifestyle: ['Engage in active physical exercise or brisk walking daily', 'Avoid daytime sleep', 'Practice Kapalbhati and Surya Namaskar'],
    diet: ['Incorporate barley, millets, and fiber-rich vegetables', 'Avoid refined sugar, dairy sweets, and potatoes', 'Favor bitter gourd, fenugreek seeds, and cinnamon powder'],
    faqs: [
      { q: 'Can Ayurveda reverse insulin dependency?', a: 'Type-2 diabetes in early stages can be highly managed or reversed. For Type-1 or chronic cases, Ayurveda acts as a supportive therapy to stabilize sugars and prevent organ damage.' }
    ],
    doctors: [
      { name: 'Dr. Ramesh Joshi', spec: 'Endocrine Ayurveda' }
    ]
  },
  'thyroid': {
    title: 'Thyroid Care (Galaganda)',
    category: 'Endocrine',
    overview: 'Thyroid dysfunctions represent a metabolic block (Agni-mandya) where Kapha/Vata imbalance slows down cellular metabolism and disrupts glandular functions.',
    symptoms: ['Weight gain or sudden weight loss', 'Chronic fatigue and muscle weakness', 'Hair thinning and dry skin', 'Sensitivity to cold or heat shifts'],
    causes: ['Chronic emotional stress levels', 'Deficient nutritional diet routines', 'Imbalance in the throat chakra energy fields'],
    diagnosis: 'Assessing digestive power (Agni), observing signs of systemic Kapha blockage, and evaluating pulse quality.',
    process: 'Nasya (nasal administration of specialized oils) to stimulate pituitary control, herbs like Kanchanar Guggulu, and local neck oil pooling.',
    benefits: ['Supports balancing of thyroid hormones (TSH, T3, T4)', 'Boosts cellular metabolic rates and energy levels', 'Reduces neck swelling and glandular congestion'],
    lifestyle: ['Practice Ujjayi Pranayama and throat lock (Jalandhara Bandha)', 'Ensure 7-8 hours of sound sleep', 'Manage stress using meditation'],
    diet: ['Consume iodine-rich natural foods and drumsticks', 'Limit intake of raw cruciferous vegetables (cabbage, broccoli)', 'Use small amounts of coconut oil in cooking'],
    faqs: [
      { q: 'How does Nasya help the thyroid?', a: 'Nasya delivers medicated vapor particles straight to the nasal membrane, stimulating hypothalamic-pituitary-thyroid axes directly.' }
    ],
    doctors: [
      { name: 'Dr. Ramesh Joshi', spec: 'Endocrine Ayurveda' }
    ]
  },
  'hair-fall': {
    title: 'Hair Fall & Scalp Care (Khalitya)',
    category: 'Lifestyle & Skin',
    overview: 'Khalitya is characterized by excess Pitta dosha in the scalp hair roots, combined with poor nutrition or stress, causing early hair root decay and thinning.',
    symptoms: ['Excessive daily hair shedding', 'Dry, itchy, or dandruff-prone scalp', 'Premature graying of hair strands'],
    causes: ['High intake of spicy, salty, and sour foods', 'Excessive chemical treatments and heat styling', 'Lack of scalp massage and sleep cycles'],
    diagnosis: 'Identifying Pitta aggravation signs, assessing scalp health, and reviewing digestion strength.',
    process: 'Scalp cleansing, application of herbal hair packs (Shirolepa using Bhringraj, Amla), and head massage (Champi) using cooling oils.',
    benefits: ['Strengthens hair roots and prevents follicle shrinkage', 'Promotes new hair growth and scalp cooling', 'Resolves dandruff and itchy scalp conditions'],
    lifestyle: ['Massage the scalp with coconut or sesame oils weekly', 'Protect hair from harsh sun rays', 'Avoid chemical shampoos'],
    diet: ['Consume iron-rich foods, spinach, and curry leaves', 'Eat soaked almonds and black raisins daily', 'Avoid sour pickles and fermented foods'],
    faqs: [
      { q: 'Will Bhringraj restore bald spots?', a: 'It stimulates dormant follicles in thinning zones. Reversing complete baldness where follicles have scarred is not clinically possible.' }
    ],
    doctors: [
      { name: 'Dr. Shalini Iyer', spec: 'Dermatology Ayurveda' }
    ]
  },
  'skin-disorders': {
    title: 'Skin Disorders (Kustha Rogas)',
    category: 'Dermatology',
    overview: 'Skin conditions represent an imbalance in Rakta Dhatu (blood tissue) caused by irritated Pitta and Kapha doshas, leading to tissue toxicity and skin irritation.',
    symptoms: ['Red patches, rashes, and scaling', 'Persistent itching or weeping skin sores', 'Pigmentation and skin thickening'],
    causes: ['Eating incompatible foods (e.g. fish with milk)', 'Suppressing natural urges (vegas)', 'High stress and blood toxicity'],
    diagnosis: 'Observing tongue coat, checking skin lesions pattern, and identifying digestive impurities.',
    process: 'Rakta Shodhana (blood detoxification) via bitter herbs, Shirodhara to calm stress-induced flares, and neem-infused oil treatments.',
    benefits: ['Clears deep-seated blood toxins', 'Reduces intense skin itching and scaling', 'Restores natural skin barrier and texture'],
    lifestyle: ['Use mild organic soaps or gram flour for washing', 'Wear loose cotton clothes', 'Keep the skin hydrated with pure coconut oil'],
    diet: ['Favor cooling vegetables (bitter gourd, cucumber)', 'Strictly avoid spicy, salty, and sour foods', 'Drink warm coriander seed water'],
    faqs: [
      { q: 'Is diet correction mandatory for skin recovery?', a: 'Yes. In Ayurveda, skin diseases originate in the digestive tract. Without removing toxins (Ama) from the blood, topical oils only offer temporary relief.' }
    ],
    doctors: [
      { name: 'Dr. Shalini Iyer', spec: 'Dermatology Ayurveda' }
    ]
  },
  'psoriasis': {
    title: 'Psoriasis Treatment (Ekakustha)',
    category: 'Dermatology',
    overview: 'Ekakustha is a chronic skin condition triggered by Vata-Kapha vitiation, leading to dry, scaly plaques resembling fish scales (Matsyashakali).',
    symptoms: ['Silver-white scaly plaques on joints or scalp', 'Severe skin cracking and bleeding', 'Intense itching and burning sensations'],
    causes: ['Incompatible food combinations (Viruddha Ahara)', 'Accumulated mental anxiety and emotional trauma', 'Digestive sluggishness'],
    diagnosis: 'Pulse assessment, detailed evaluation of dietary history, and plaque texture check.',
    process: 'Comprehensive Panchakarma starting with Snehapana (medicated ghee ingestion), followed by Virechana (purgation) and Takradhara (pouring medicated buttermilk on forehead).',
    benefits: ['Significantly thins down scaly plaques', 'Addresses underlying autoimmune triggers', 'Calms the nervous system to prevent stress flares'],
    lifestyle: ['Avoid harsh sunlight during peak hours', 'Practice deep breathing and yoga daily', 'Apply coconut oil immediately after bathing'],
    diet: ['Consume light, easily digestible food', 'Avoid red meat, seafood, alcohol, and eggplant', 'Drink plenty of warm water throughout the day'],
    faqs: [
      { q: 'Can Psoriasis be completely cured?', a: 'While modern medicine considers it incurable, Ayurvedic Panchakarma frequently leads to long-term remission and symptom-free years by resetting the immune system.' }
    ],
    doctors: [
      { name: 'Dr. Shalini Iyer', spec: 'Dermatology Ayurveda' }
    ]
  },
  'weight-loss': {
    title: 'Weight Management (Sthoulya)',
    category: 'Metabolic & Lifestyle',
    overview: 'Sthoulya is a state of excess Medas (fat tissue) blockages where impaired digestive fire directs all nutrition to fat storage, leaving other tissues weak.',
    symptoms: ['Accumulation of excess fat around abdomen', 'Breathlessness on mild exertion', 'Excessive sweating and fatigue'],
    causes: ['Lack of physical activity and oversleeping', 'Consuming heavy, sweet, and oily diet patterns', 'Hormonal and genetic factors'],
    diagnosis: 'BMI calculation, fat distribution mapping, and assessing metabolic fire status.',
    process: 'Udvartana (dry powder scrubbing massage using Triphala), internal administration of Guggulu, and therapeutic warm enemas (Lekhana Basti).',
    benefits: ['Stimulates burning of stubborn fat tissues', 'Cleanses clogged circulatory channels (Srotas)', 'Corrects metabolism to prevent rebound weight gain'],
    lifestyle: ['Wake up before sunrise and exercise active workout', 'Avoid sleeping after lunch', 'Keep active throughout the day'],
    diet: ['Eat light grains like barley, millets, and oats', 'Limit dairy, sweets, white rice, and fats', 'Drink warm honey-lemon water on an empty stomach'],
    faqs: [
      { q: 'How much weight can I lose in a month?', a: 'Healthy loss is 3-5 kg per month. Ayurvedic weight loss focuses on fat reduction while preserving muscle mass and stamina.' }
    ],
    doctors: [
      { name: 'Dr. Naveen Jadhav', spec: 'Panchakarma Specialist' }
    ]
  },
  'digestive-disorders': {
    title: 'Digestive Care (Agnimandya & Grahani)',
    category: 'Gastrointestinal',
    overview: 'All diseases in Ayurveda begin with weak digestion (Agnimandya), which fails to process food fully, producing sticky toxins (Ama) that clog body channels.',
    symptoms: ['Acid reflux, bloating, and flatulence', 'Chronic constipation or irregular bowel movements', 'Feeling heavy and sluggish after meals'],
    causes: ['Overeating or eating before previous meal digests', 'Excessive cold or raw food consumption', 'Stress and eating on the run'],
    diagnosis: 'Abdominal palpation, checking tongue coatings, and analyzing stool patterns.',
    process: 'Deepana-Pachana (herbal appetizers to rekindle digestion), mild purgation (Virechana), and enema therapies (Basti).',
    benefits: ['Rekindles digestive fire (Agni) for optimal absorption', 'Relieves chronic bloating, gas, and abdominal pain', 'Detoxifies the entire gastrointestinal tract'],
    lifestyle: ['Sit down and eat in a quiet environment', 'Avoid drinking cold water with meals', 'Take a short walk after eating'],
    diet: ['Favor warm ginger tea and buttermilk with cumin', 'Eat light, cooked soups and steamed vegetables', 'Avoid processed, packaged, and frozen foods'],
    faqs: [
      { q: 'How does buttermilk help digestion?', a: 'Ayurvedic buttermilk (Takra) is rich in probiotics and spiced with cumin and ginger, which stimulates digestive enzymes and absorbs excess liquid.' }
    ],
    doctors: [
      { name: 'Dr. Naveen Jadhav', spec: 'Panchakarma Specialist' }
    ]
  },
  'womens-health': {
    title: "Women's Wellness & Hormonal Balance",
    category: 'Gynecology',
    overview: 'Addresses hormonal fluctuations, painful menstruation (Kashtartava), and menopause by stabilizing Apana Vata (the descending vital energy that controls pelvic organs).',
    symptoms: ['Irregular or painful periods', 'Mood swings and hot flashes', 'Hormonal acne and fatigue'],
    causes: ['High stress levels disrupting endocrine systems', 'Nutritional deficiencies and dry food intake', 'Lack of pelvic area exercise'],
    diagnosis: 'Reviewing menstrual cycle logs, checking hormone-related symptoms, and assessing pelvic Vata flow.',
    process: 'Shatavari formulations, mild oil massage, and pelvic oil pooling (Yoni Prakshalana) to soothe dry tissues.',
    benefits: ['Regulates menstrual cycle dates naturally', 'Mitigates menopausal hot flashes and anxiety', 'Strengthens reproductive system tissues'],
    lifestyle: ['Practice pelvic stretches and Butterfly pose', 'Rest adequately during menstrual days', 'Use warm heating pads for cramps'],
    diet: ['Favor fresh milk, ghee, almonds, and warm stews', 'Limit dry, spicy, and junk foods', 'Drink chamomile or ginger-cinnamon tea'],
    faqs: [
      { q: 'Is Shatavari safe for long term use?', a: 'Shatavari is an adaptogenic herb that nourishes the reproductive tract. It is safe for long term use when prescribed in the correct dose by a Vaidya.' }
    ],
    doctors: [
      { name: 'Dr. Anjali Deshmukh', spec: 'Gynecology Ayurveda' }
    ]
  },
  'mens-health': {
    title: "Men's Health & Vitality (Vajikarana)",
    category: 'Reproductive & Vitality',
    overview: 'Focuses on improving male vitality, stamina, and fertility (Shukra Dhatu) by balancing reproductive hormones and relieving mental stress.',
    symptoms: ['Low stamina and chronic fatigue', 'Hormonal imbalances and poor muscle tone', 'High work-related stress affecting libido'],
    causes: ['High alcohol and smoking habits', 'Lack of sleep and continuous work stress', 'Nutritionally deficient food items'],
    diagnosis: 'Evaluating physical strength markers, stress indicators, and pulse dynamics.',
    process: 'Vajikarana therapy using adaptogenic herbs (Ashwagandha, Safed Musli), coupled with nourishing oil massages.',
    benefits: ['Enhances physical stamina and overall vigor', 'Reduces chronic fatigue and rebuilds vitality', 'Improves sperm quality and count naturally'],
    lifestyle: ['Ensure 8 hours of sleep before midnight', 'Practice moderate weight training and yoga', 'Reduce caffeine intake'],
    diet: ['Consume walnuts, dates, saffron, and warm milk', 'Avoid overly sour, spicy, and processed foods', 'Favor protein-dense lentils'],
    faqs: [
      { q: 'How does Ashwagandha improve vitality?', a: 'It acts on the adrenal glands to lower cortisol, thereby allowing natural testosterone production to normalize and enhancing tissue building.' }
    ],
    doctors: [
      { name: 'Dr. Madhavan Namboothiri', spec: 'Orthopedic Ayurveda' }
    ]
  },
  'migraine': {
    title: 'Migraine Relief (Ardhavavabhidaka)',
    category: 'Neurological',
    overview: 'Migraine represents a Pitta-Vata imbalance where toxins clog neck blood vessels, triggering severe headache flares in response to heat, sound, or skipped meals.',
    symptoms: ['Throbbing pain on one side of the head', 'Nausea, vomiting, and sensitivity to light', 'Visual aura before attacks'],
    causes: ['Skipping meals or eating late at night', 'Excessive screen time and sleeplessness', 'Exposure to bright sun or loud noises'],
    diagnosis: 'Identifying trigger factors, checking bowel movement consistency, and localizing head pain zones.',
    process: 'Nasya (nasal oil drops to clear sinus paths), Shirodhara (warm oil flow on the forehead), and cooling herbal preparations.',
    benefits: ['Reduces the frequency and intensity of migraine attacks', 'Relieves associated nausea and sensory sensitivity', 'Calms the hyperactive nervous system'],
    lifestyle: ['Maintain a strict eating and sleeping routine', 'Use protective sunglasses in bright outdoor sun', 'Limit daily screen time before bed'],
    diet: ['Consume sweet cooling fruits (pears, grapes)', 'Limit spicy foods, aged cheese, and fermented dough', 'Drink coconut water or warm milk with cardamom'],
    faqs: [
      { q: 'How does Shirodhara relieve migraines?', a: 'The continuous gentle stream of warm medicated oil on the forehead relaxes the nervous system, dilates local vessels, and lowers stress hormones.' }
    ],
    doctors: [
      { name: 'Dr. Vivek Anand', spec: 'Ayurvedic Psychiatry' }
    ]
  },
  'joint-pain': {
    title: 'Chronic Joint Pain (Amavata)',
    category: 'Musculoskeletal',
    overview: 'Different from simple arthritis, Amavata is an autoimmune-like joint inflammation where toxic Ama binds with Vata dosha, settling in joints to cause swelling and severe morning stiffness.',
    symptoms: ['Symmetrical pain in multiple joints', 'Severe morning stiffness lasting over an hour', 'Swollen, painful, and tender joints'],
    causes: ['Impaired metabolism creating high toxic waste (Ama)', 'Sedentary habits combined with heavy diet patterns', 'Cold and damp living environments'],
    diagnosis: 'Checking tongue coat thickness, testing joint range of motion, and checking digestive capacity.',
    process: 'Dry sand fomentation (Valuka Sweda) to dry up joint toxins, followed by medicated enemas (Basti) to purge Vata.',
    benefits: ['Clears swelling and morning joint stiffness', 'Halts chronic cartilage damage', 'Improves overall bone and joint durability'],
    lifestyle: ['Apply dry heat (heating pads) instead of wet steam', 'Perform light non-impact exercises', 'Keep joints protected from cold drafts'],
    diet: ['Favor warm barley soup, dry ginger, and garlic', 'Limit curd, cold yogurt, red meat, and cold beverages', 'Drink warm water mixed with castor oil at night'],
    faqs: [
      { q: 'Why is dry heat preferred for Amavata joint pain?', a: 'Since Amavata involves sticky fluid toxins (Kapha-like Ama), dry sand heat drys up the excess dampness, whereas wet steam can sometimes increase joint swelling.' }
    ],
    doctors: [
      { name: 'Dr. Madhavan Namboothiri', spec: 'Orthopedic Ayurveda' }
    ]
  },
  'liver-disorders': {
    title: 'Liver Care & Detox (Yakrit Vikara)',
    category: 'Gastrointestinal',
    overview: 'The liver is the seat of Ranjaka Pitta (blood-coloring fire). Sluggish liver function is caused by excessive heat, alcohol, or toxins, disrupting digestion and skin health.',
    symptoms: ['Sluggish digestion and loss of appetite', 'Yellowish tint in eyes or urine (jaundice signs)', 'Nausea and bitter taste in the mouth'],
    causes: ['Excessive consumption of alcohol or fried foods', 'Self-medication with heavy synthetic drugs', 'Frequent anger and emotional stress'],
    diagnosis: 'Abdominal examination of the liver margin, assessing tongue quality, and urine color review.',
    process: 'Administration of liver-protective bitter herbs (Bhumyamalaki, Kutki), followed by Virechana (purgation detox).',
    benefits: ['Restores normal liver enzymes and detox flow', 'Purifies blood tissue (Rakta Dhatu)', 'Rekindles appetite and nutrient assimilation'],
    lifestyle: ['Ensure regular bowel movements', 'Avoid sleeping immediately after meals', 'Engage in moderate yoga'],
    diet: ['Favor freshly cooked green vegetables and pomegranate', 'Strictly avoid alcohol, fried foods, and refined sugars', 'Drink fresh coconut water'],
    faqs: [
      { q: 'Can Bhumyamalaki reverse fatty liver?', a: 'Yes. In early stages (Grade 1 & 2 fatty liver), bitter herbs help clear accumulated lipid deposits from hepatocytes and normalize liver size.' }
    ],
    doctors: [
      { name: 'Dr. Naveen Jadhav', spec: 'Panchakarma Specialist' }
    ]
  },
  'kidney-disorders': {
    title: 'Kidney & Urinary Care (Mutravaha Srotas)',
    category: 'Renal',
    overview: 'Addresses kidney sluggishness, urinary tract infections (Mutrakrichra), and kidney stones (Asmari) by clearing toxins from the excretory channels.',
    symptoms: ['Painful or burning sensation during urination', 'Lower back pain radiating to the groin', 'Irregular fluid retention in legs'],
    causes: ['Inadequate daily water intake', 'Excessive consumption of high-protein or salty foods', 'Suppressing the urge to urinate'],
    diagnosis: 'Physical check of lower back pain, assessing urine flow rates, and evaluating Vata flow.',
    process: 'Administration of diuretic herbs (Gokshura, Punarnava) and therapeutic enemas to regulate Apana Vata.',
    benefits: ['Flushes out small kidney stones and crystals', 'Reduces burning urination and recurring UTIs', 'Supports healthy filtration and reduces fluid retention'],
    lifestyle: ['Drink adequate water throughout the day', 'Urinate immediately when the body signals', 'Practice warm water hip baths'],
    diet: ['Favor barley water, coconut water, and pumpkin', 'Avoid spinach, tomato seeds, and salty chips', 'Limit excessive caffeine and soda intake'],
    faqs: [
      { q: 'How does Punarnava support kidney function?', a: 'Punarnava literally means "renewer". It acts as a natural diuretic and rejuvenator, reducing leg swelling (edema) and supporting healthy nephron filtration.' }
    ],
    doctors: [
      { name: 'Dr. Ramesh Joshi', spec: 'Endocrine Ayurveda' }
    ]
  },
  'pcos': {
    title: 'PCOS & Hormonal Care (Artava Kshaya)',
    category: 'Gynecology',
    overview: 'PCOS is caused by Kapha-Vata blockages in the ovaries, which prevents egg maturation and creates fluid cysts, accompanied by metabolic sluggishness.',
    symptoms: ['Irregular or delayed menstrual periods', 'Excessive facial hair and hormonal acne', 'Difficulty in losing weight'],
    causes: ['High intake of sweet, cold, and dairy foods', 'Lack of exercise and sedentary lifestyle', 'Chronic stress and hormonal disruption'],
    diagnosis: 'Analyzing menstrual cycle logs, checking insulin resistance signs, and checking Kapha imbalances.',
    process: 'Udvartana (fat-reducing scrub) to correct insulin resistance, herbs like Kanchanar Guggulu, and therapeutic enemas (Basti).',
    benefits: ['Supports regular ovulation cycles', 'Reduces ovarian cysts naturally', 'Balances acne-causing male hormones (androgens)'],
    lifestyle: ['Perform Surya Namaskar and pelvic twists daily', 'Avoid sleeping in the afternoon', 'Maintain a consistent sleep routine'],
    diet: ['Favor spicy, warm, and light foods with turmeric', 'Avoid refined sugar, commercial dairy, and wheat', 'Drink warm spearmint tea daily'],
    faqs: [
      { q: 'How long does PCOS treatment take?', a: 'Cycle regularisation generally takes 3-6 months. Weight loss and hormonal balancing continue to improve with consistent diet and herbal care.' }
    ],
    doctors: [
      { name: 'Dr. Anjali Deshmukh', spec: 'Gynecology Ayurveda' }
    ]
  },
  'infertility': {
    title: 'Ayurvedic Infertility Care (Vandhyatva)',
    category: 'Gynecology & Reproductive',
    overview: 'Vandhyatva focuses on optimizing reproductive tissue (Artava/Shukra), balancing pelvic Vata, and cleansing pelvic blockages to support natural conception.',
    symptoms: ['Inability to conceive after 12 months of trying', 'History of irregular ovulation or low sperm count', 'Weak uterine lining'],
    causes: ['Poor nutrition leading to weak tissue structure', 'Chronic anxiety and fear surrounding conception', 'Clogged fallopian or reproductive channels'],
    diagnosis: 'Detailed pulse evaluation, analyzing digestive fire, and checking reproductive tissue health (Dhatu analysis).',
    process: 'Uttar Basti (specialized oil administration into the womb), couple detoxification, and adaptogenic herbs.',
    benefits: ['Improves quality of egg and sperm cells', 'Strengthens the uterine lining for implantation', 'Clears blocks in fallopian tubes naturally'],
    lifestyle: ['Practice yoga and breathing exercises (Pranayama) together', 'Ensure stress levels are managed', 'Avoid smoking and alcohol'],
    diet: ['Consume ghee, milk, dates, almonds, and honey', 'Eat freshly cooked organic meals', 'Avoid processed food and carbonated sodas'],
    faqs: [
      { q: 'What is Uttar Basti?', a: 'It is a specialized procedure where sterile medicated ghee is introduced directly into the uterine cavity. It cleanses tubes, strengthens endometrial thickness, and aids ovulation.' }
    ],
    doctors: [
      { name: 'Dr. Anjali Deshmukh', spec: 'Gynecology Ayurveda' }
    ]
  }
};

const TREATMENT_IMAGES: Record<string, string> = {
  'arthritis': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400&h=300',
  'diabetes': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400&h=300',
  'thyroid': 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400&h=300',
  'hair-fall': 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=400&h=300',
  'skin-disorders': 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=400&h=300',
  'psoriasis': 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=400&h=300',
  'weight-loss': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400&h=300',
  'digestive-disorders': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400&h=300',
  'womens-health': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400&h=300',
  'mens-health': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400&h=300',
  'migraine': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400&h=300',
  'joint-pain': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400&h=300',
  'liver-disorders': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400&h=300',
  'kidney-disorders': 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400&h=300',
  'pcos': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400&h=300',
  'infertility': 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=400&h=300'
};

const TREATMENT_INFOS: Record<string, { duration: string; suitableFor: string }> = {
  'arthritis': { duration: '7 - 21 Days', suitableFor: 'Knee & Joint stiffness patients' },
  'diabetes': { duration: '14 - 28 Days', suitableFor: 'Type-2 diabetic patients' },
  'thyroid': { duration: '14 - 21 Days', suitableFor: 'Hypothyroid metabolic sluggishness' },
  'hair-fall': { duration: '7 - 14 Days', suitableFor: 'Scalp heat & thinning hair' },
  'skin-disorders': { duration: '14 - 28 Days', suitableFor: 'Blood toxicity & eczema signs' },
  'psoriasis': { duration: '21 - 35 Days', suitableFor: 'Chronic scaling plaque symptoms' },
  'weight-loss': { duration: '14 - 21 Days', suitableFor: 'Oversleeping & metabolic blocks' },
  'digestive-disorders': { duration: '7 - 14 Days', suitableFor: 'Acid reflux, gas & bloating' },
  'womens-health': { duration: '7 - 14 Days', suitableFor: 'Menstrual cramps & hormone shifts' },
  'mens-health': { duration: '7 - 14 Days', suitableFor: 'Fatigue, low stamina & stamina loss' },
  'migraine': { duration: '7 - 14 Days', suitableFor: 'Ardhavavabhidaka head throbs' },
  'joint-pain': { duration: '14 - 21 Days', suitableFor: 'Autoimmune-like multi joint stiffness' },
  'liver-disorders': { duration: '7 - 14 Days', suitableFor: 'Jaundice signs & sluggish appetite' },
  'kidney-disorders': { duration: '7 - 14 Days', suitableFor: 'Burning urination & renal stones' },
  'pcos': { duration: '14 - 28 Days', suitableFor: 'Delayed periods & ovarian cyst blocks' },
  'infertility': { duration: '21 - 45 Days', suitableFor: 'Weak uterine lining & egg cell health' }
};

export default function TreatmentsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'process' | 'lifestyle' | 'faqs'>('overview');

  // If no specific treatment key is requested, show catalog listing
  if (!id) {
    return (
      <div className="min-h-screen bg-[#FBFBF9] pb-24 font-sans selection:bg-emerald-100 selection:text-emerald-950">
        
        {/* Banner Header */}
        <div className="bg-emerald-950 text-white py-16 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-900 text-emerald-350 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-ayur-accent animate-pulse" />
            <span>Ayurvedic Clinical Services</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Kaya Kalp Treatments Catalog</h1>
          <p className="text-xs sm:text-sm text-emerald-250 max-w-xl mx-auto font-medium leading-relaxed">
            Discover our comprehensive range of specialized clinical programs. We restore metabolic balance, eliminate metabolic toxins, and stimulate biological rejuvenation.
          </p>
        </div>

        {/* Catalog Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(TREATMENTS_REGISTRY).map(([key, item]) => {
              const image = TREATMENT_IMAGES[key] || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400&h=300';
              const info = TREATMENT_INFOS[key] || { duration: '7 - 14 Days', suitableFor: 'Chronic patient support' };

              return (
                <div 
                  key={key} 
                  className="bg-white border border-stone-200/80 rounded-[20px] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row items-stretch"
                >
                  {/* Image & Badges */}
                  <div className="w-full sm:w-48 shrink-0 relative bg-stone-50 h-52 sm:h-auto animate-fade-in">
                    <img src={image} alt={item.title} className="w-full h-full object-cover" />
                    
                    {/* Category overlay */}
                    <span className="absolute bottom-3 left-3 bg-emerald-950 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>

                  {/* Descriptions details */}
                  <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                    
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="bg-emerald-50 text-ayur-primary border border-emerald-150 text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Duration: {info.duration}
                        </span>
                        <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[8px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                          100% Classical
                        </span>
                      </div>

                      <h3 className="font-extrabold text-base text-stone-900 leading-tight">
                        {item.title.split(' (')[0]}
                      </h3>
                      <p className="text-xs text-stone-505 font-medium leading-relaxed line-clamp-2">
                        {item.overview}
                      </p>
                    </div>

                    {/* Suitable For */}
                    <div className="text-[11px] text-stone-605 font-semibold space-y-0.5">
                      <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block">Suitable For:</span>
                      <p className="italic text-emerald-800 font-medium">"{info.suitableFor}"</p>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-stone-100 text-[11px] font-black">
                      <Link 
                        to={`/treatments/${key}`}
                        className="py-2 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl text-center flex items-center justify-center"
                      >
                        Explore Details
                      </Link>
                      <Link 
                        to="/doctors"
                        className="py-2 bg-ayur-primary hover:bg-ayur-secondary text-white rounded-xl text-center flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book Consult</span>
                      </Link>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    );
  }

  // Active treatment mapping
  const activeKey = id && TREATMENTS_REGISTRY[id] ? id : 'arthritis';
  const treatment = TREATMENTS_REGISTRY[activeKey];

  return (
    <div className="min-h-screen bg-[#FBFBF9] pb-20 font-sans">
      
      {/* Hero Banner Header */}
      <div className="bg-emerald-950 text-white py-16 text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900 text-emerald-350 text-xs font-bold uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5" />
          <span>Ayurvedic Clinical Therapies</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black">{treatment.title}</h1>
        <p className="text-xs text-emerald-250 max-w-xl mx-auto font-medium">
          Deep healing via classical Ayurvedic medicine, targeting the root causes of {treatment.title.toLowerCase()}.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Treatment Sidebar List (All 16) */}
          <div className="lg:col-span-4 p-5 rounded-3xl bg-white border border-stone-200/80 shadow-sm space-y-3">
            <h3 className="font-extrabold text-xs text-stone-900 uppercase tracking-wider flex items-center gap-2 mb-2">
              <List className="w-4 h-4 text-ayur-primary" />
              <span>Select Condition</span>
            </h3>
            
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1 text-xs font-bold text-stone-700">
              {Object.keys(TREATMENTS_REGISTRY).map((key) => {
                const item = TREATMENTS_REGISTRY[key];
                const isActive = activeKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveTab('overview');
                      navigate(`/treatments/${key}`);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex justify-between items-center ${
                      isActive 
                        ? 'bg-emerald-50 text-ayur-primary border border-emerald-250 shadow-inner' 
                        : 'hover:bg-stone-50 border border-transparent'
                    }`}
                  >
                    <span>{item.title.split(' (')[0]}</span>
                    <ChevronRight className={`w-4 h-4 text-stone-400 transition-transform ${isActive ? 'rotate-90 text-ayur-primary' : ''}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Detailed tabs panel */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-sm space-y-8">
            
            {/* Tabs Headers */}
            <div className="flex border-b border-stone-200 text-xs font-black">
              {[
                { id: 'overview', label: 'Overview & Diagnosis' },
                { id: 'process', label: 'Treatment Process' },
                { id: 'lifestyle', label: 'Diet & Lifestyle' },
                { id: 'faqs', label: 'FAQs' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 border-b-2 transition-all ${
                    activeTab === tab.id 
                      ? 'border-ayur-primary text-ayur-primary' 
                      : 'border-transparent text-stone-400 hover:text-stone-605'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6 text-xs sm:text-sm">
                <div className="space-y-2">
                  <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-widest block">Condition Description</span>
                  <p className="text-stone-600 leading-relaxed font-medium">{treatment.overview}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-stone-100">
                  <div className="space-y-2">
                    <span className="text-[10px] text-stone-405 font-extrabold uppercase tracking-widest block flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                      Common Symptoms
                    </span>
                    <ul className="space-y-2 text-xs text-stone-600 font-medium">
                      {treatment.symptoms.map((s, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] text-stone-405 font-extrabold uppercase tracking-widest block">Root Causes</span>
                    <ul className="space-y-2 text-xs text-stone-600 font-medium">
                      {treatment.causes.map((c, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/50 space-y-1.5 mt-4">
                  <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider block">Ayur Diagnosis Guidelines</span>
                  <p className="text-xs text-stone-605 font-medium leading-relaxed">{treatment.diagnosis}</p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Process */}
            {activeTab === 'process' && (
              <div className="space-y-6 text-xs sm:text-sm">
                <div className="space-y-2">
                  <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-widest block">Therapeutic Approach</span>
                  <p className="text-stone-600 leading-relaxed font-medium">{treatment.process}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-stone-100">
                  <span className="text-[10px] text-stone-405 font-extrabold uppercase tracking-widest block">Key Benefits of Treatment</span>
                  <ul className="space-y-2.5 text-xs text-stone-600 font-medium">
                    {treatment.benefits.map((b, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Diet & Lifestyle */}
            {activeTab === 'lifestyle' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
                <div className="space-y-3">
                  <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-widest block">Dietary Recommendations</span>
                  <ul className="space-y-2.5 text-xs text-stone-600 font-medium">
                    {treatment.diet.map((d, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-widest block">Lifestyle Advice</span>
                  <ul className="space-y-2.5 text-xs text-stone-600 font-medium">
                    {treatment.lifestyle.map((l, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{l}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB CONTENT: FAQs */}
            {activeTab === 'faqs' && (
              <div className="space-y-4">
                <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-widest block mb-2">Frequently Asked Questions</span>
                {treatment.faqs.map((f, idx) => (
                  <div key={idx} className="p-4.5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2 text-xs">
                    <div className="font-extrabold text-stone-900 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-ayur-primary shrink-0" />
                      <span>{f.q}</span>
                    </div>
                    <p className="text-stone-605 font-medium leading-relaxed pl-5">{f.a}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Consultation Action Box */}
            <div className="p-6 rounded-3xl bg-emerald-950 text-white space-y-4 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8">
              <div className="space-y-1">
                <span className="text-[9px] bg-emerald-900 text-emerald-350 font-bold px-2 py-0.5 rounded uppercase tracking-wider">Consultation Booking</span>
                <h4 className="font-extrabold text-sm">Need Personalized Advice?</h4>
                <p className="text-[10px] text-emerald-250 font-medium">Our BAMS specialists will examine your body constitution and diagnose your symptoms.</p>
              </div>

              <Link
                to="/doctors"
                className="px-5 py-2.5 bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-black rounded-xl transition-all flex items-center gap-1 shrink-0 shadow-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Doctor Appointment</span>
              </Link>
            </div>

          </div>

        </div>
      </div>
      
    </div>
  );
}

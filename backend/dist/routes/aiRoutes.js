"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// POST /api/ai-assessment: Run rule-based Ayurvedic symptom assessment
router.post('/', async (req, res) => {
    try {
        const { symptoms, age, gender, painLevel, duration, lifestyle, diseases } = req.body;
        if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
            return res.status(400).json({ error: 'Symptoms array is required' });
        }
        const symptomStr = symptoms.map((s) => s.toLowerCase()).join(' ');
        let recommendedSpecialist = 'General Ayurveda';
        let specialistReason = '';
        let primaryDosha = 'Tridoshic (Balanced)';
        let doshaExplanation = '';
        let dietRecs = [];
        let yogaRecs = [];
        let homeRemedies = [];
        let herbs = [];
        let lifestyleTips = [];
        // Specialist classification logic
        if (symptomStr.includes('skin') || symptomStr.includes('hair') || symptomStr.includes('rash') || symptomStr.includes('eczema') || symptomStr.includes('acne')) {
            recommendedSpecialist = 'Dermatology Ayurveda';
            specialistReason = 'Your symptoms indicate skin/hair involvement (Shweta Kushta / Kshudra Roga). Dermatology Ayurveda targets toxic accumulation (Ama) in the blood (Rakta Dhatu) using cooling herbs and blood purifiers.';
        }
        else if (symptomStr.includes('digestion') || symptomStr.includes('stomach') || symptomStr.includes('acidity') || symptomStr.includes('bloating') || symptomStr.includes('constipation')) {
            recommendedSpecialist = 'Panchakarma Specialist';
            specialistReason = 'Gastrointestinal issues point to a weakened digestive fire (Agni) and toxin (Ama) buildup in the gut. Panchakarma utilizes therapeutic cleansing to reset your metabolic channels and digestive health.';
        }
        else if (symptomStr.includes('joint') || symptomStr.includes('back') || symptomStr.includes('arthritis') || symptomStr.includes('pain') || symptomStr.includes('stiffness')) {
            recommendedSpecialist = 'Orthopedic Ayurveda';
            specialistReason = 'Musculoskeletal aches, joint degeneration, and stiffness correspond to Sandhigata Vata. Specialized treatments like oil-baths (Janu Basti/Kati Basti) and herbal anti-inflammatories are ideal.';
        }
        else if (symptomStr.includes('stress') || symptomStr.includes('anxiety') || symptomStr.includes('sleep') || symptomStr.includes('insomnia') || symptomStr.includes('mind')) {
            recommendedSpecialist = 'Ayurvedic Psychiatry';
            specialistReason = 'Stress, insomnia, and cognitive exhaustion reflect an agitated Prana Vata and Sadhaka Pitta. Mind-calming treatments such as Shirodhara, head oiling, and adaptogenic herbs are recommended.';
        }
        else if (symptomStr.includes('diabetes') || symptomStr.includes('obesity') || symptomStr.includes('thyroid')) {
            recommendedSpecialist = 'Endocrine Ayurveda';
            specialistReason = 'Metabolic disorders relate to imbalance in Meda Dhatu (fat tissue) and Agni. Herbal therapies to reduce sluggishness and enhance pancreatic/thyroid stimulation are recommended.';
        }
        else {
            recommendedSpecialist = 'Panchakarma Specialist';
            specialistReason = 'Your systemic symptoms indicate a metabolic imbalance. A holistic evaluation by a Panchakarma specialist is recommended to balance all three doshas.';
        }
        // Dosha assessment logic
        let vataScore = 0;
        let pittaScore = 0;
        let kaphaScore = 0;
        if (symptomStr.includes('pain') || symptomStr.includes('joint') || symptomStr.includes('back') || symptomStr.includes('stiffness') || symptomStr.includes('anxiety') || symptomStr.includes('sleep') || symptomStr.includes('insomnia') || symptomStr.includes('constipation') || symptomStr.includes('bloating')) {
            vataScore += 3;
        }
        if (symptomStr.includes('skin') || symptomStr.includes('rash') || symptomStr.includes('acne') || symptomStr.includes('acidity') || symptomStr.includes('burning') || symptomStr.includes('inflammation')) {
            pittaScore += 3;
        }
        if (symptomStr.includes('weight') || symptomStr.includes('obesity') || symptomStr.includes('lethargy') || symptomStr.includes('congestion') || symptomStr.includes('slow')) {
            kaphaScore += 3;
        }
        // Max score wins
        if (vataScore >= pittaScore && vataScore >= kaphaScore && vataScore > 0) {
            primaryDosha = 'Vata Imbalance (Vata Dushti)';
            doshaExplanation = 'Vata represents Air and Ether. Your symptoms of coldness, dryness, pain, or restlessness indicate excessive Vata, which has dried out joint tissues or disrupted the nervous system.';
            herbs = ['Ashwagandha (reduces stress, nourishes nervous system)', 'Shallaki (lubricates joints, curbs pain)', 'Triphala (promotes elimination)'];
            dietRecs = ['Favor warm, freshly cooked, oil-rich foods.', 'Incorporate spices like ginger, cumin, cardamom, and cinnamon.', 'Avoid cold drinks, raw salads, and dry crackers.'];
            yogaRecs = ['Tadasana (Mountain Pose) for grounding', 'Balasana (Child\'s Pose) to calm Vata', 'Paschimottanasana (Seated Forward Bend)'];
            homeRemedies = ['Drink warm milk with a pinch of ginger and nutmeg before bedtime.', 'Gently massage stiff joints or the soles of your feet with warm sesame oil (Abhyanga) at night.', 'Sip warm water throughout the day.'];
            lifestyleTips = ['Maintain a highly structured, repetitive daily routine.', 'Practice 10 minutes of Nadi Shodhana (Alternate Nostril Breathing) daily.', 'Avoid excessive multitasking or sensory overstimulation.'];
        }
        else if (pittaScore > vataScore && pittaScore >= kaphaScore) {
            primaryDosha = 'Pitta Imbalance (Pitta Dushti)';
            doshaExplanation = 'Pitta represents Fire and Water. Your skin conditions, inflammation, burning sensations, or acid reflux point to excess heat accumulated in the stomach and blood.';
            herbs = ['Amalaki / Amla (cooling, rich in antioxidants)', 'Shatavari (nourishing and cooling)', 'Neem (detoxifies blood and skin)'];
            dietRecs = ['Favor sweet, bitter, and astringent tastes; prefer cooling foods.', 'Incorporate ghee, coconut oil, cucumber, fennel, and cilantro.', 'Strictly avoid hot chillies, fermented items, tomatoes, and caffeine.'];
            yogaRecs = ['Sitali Pranayama (Cooling Breath)', 'Chandra Namaskar (Moon Salutation) for cooling energy', 'Bhujangasana (Cobra Pose)'];
            homeRemedies = ['Apply organic coconut oil or Aloe Vera gel topically to soothe skin heat or rashes.', 'Sip tea brewed with coriander seeds, fennel seeds, and cumin.', 'Take 1 teaspoon of cow\'s ghee with warm water in the morning.'];
            lifestyleTips = ['Avoid working or exercising during the high-heat hours of midday.', 'Spend quiet time in nature, especially near water or under moonlight.', 'Practice patience and avoid self-criticism.'];
        }
        else if (kaphaScore > vataScore && kaphaScore > pittaScore) {
            primaryDosha = 'Kapha Imbalance (Kapha Dushti)';
            doshaExplanation = 'Kapha represents Earth and Water. Your symptoms of heaviness, weight accumulation, congestion, or lethargy indicate a slow, cold digestive fire and sluggish circulation.';
            herbs = ['Trikatu (Ginger, Black Pepper, Pippali mix to kindle digestion)', 'Guggulu (supports healthy weight & cholesterol)', 'Tulsi (clears respiratory channels)'];
            dietRecs = ['Favor hot, light, dry, and spicy foods.', 'Incorporate bitter greens, ginger, garlic, mustard seeds, and black pepper.', 'Limit sweet, salty, oily foods, dairy, and cold desserts.'];
            yogaRecs = ['Surya Namaskar (Sun Salutation) completed dynamically', 'Dhanurasana (Bow Pose) to stimulate metabolism', 'Virabhadrasana (Warrior Pose)'];
            homeRemedies = ['Drink warm water infused with a teaspoon of raw honey and a squeeze of lemon first thing in the morning.', 'Add ginger powder and black pepper liberally to your meals.', 'Inhale steam infused with a drop of Eucalyptus oil for congestion.'];
            lifestyleTips = ['Wake up early (before 6:00 AM) to prevent morning lethargy.', 'Engage in at least 30 minutes of vigorous aerobic exercise daily.', 'Keep your living space dry, warm, and highly ventilated.'];
        }
        else {
            primaryDosha = 'Tridoshic Imbalance (Ama Accumulation)';
            doshaExplanation = 'A combination of factors indicates that toxins (Ama) are blocking your physical and mental channels, affecting multiple systems.';
            herbs = ['Triphala (universal colon cleanser)', 'Guduchi / Giloy (boosts overall immunity)', 'Turmeric (general anti-inflammatory)'];
            dietRecs = ['Eat lightly for a few days to rest your digestive tract.', 'Incorporate ginger, turmeric, and cumin into all meals.', 'Avoid heavy dinners, cheese, processed snacks, and iced beverages.'];
            yogaRecs = ['Gentle Surya Namaskar', 'Balasana (Child\'s Pose)', 'Savasana (Corpse Pose) with deep breathing'];
            homeRemedies = ['Sip warm ginger water throughout the day.', 'Drink a cup of warm mint/fennel tea after lunch and dinner.', 'Incorporate a weekly light fasting day (soups, kitchari).'];
            lifestyleTips = ['Ensure you finish eating dinner at least 3 hours before sleep.', 'Prioritize getting 7-8 hours of sound sleep starting before 10:00 PM.', 'Engage in moderate daily stretching.'];
        }
        if (lifestyle === 'sedentary') {
            lifestyleTips.push('Break up long sitting intervals; stand and stretch for 5 minutes every hour.');
        }
        else if (lifestyle === 'stressed') {
            lifestyleTips.push('Take a 15-minute digital detox walk during the day and practice meditation.');
        }
        return res.json({
            success: true,
            assessment: {
                recommendedSpecialist,
                specialistReason,
                primaryDosha,
                doshaExplanation,
                herbs,
                dietRecs,
                yogaRecs,
                homeRemedies,
                lifestyleTips,
                painLevel,
                duration,
                disclaimer: 'DISCLAIMER: This analysis is powered by Ayurvedic algorithms for educational purposes only. It does not constitute medical advice or a formal diagnosis. Always consult a qualified Ayurvedic physician (Vaidya) or medical practitioner before starting any herbal remedies or lifestyle alterations.'
            }
        });
    }
    catch (error) {
        console.error('AI Assessment Error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
exports.default = router;

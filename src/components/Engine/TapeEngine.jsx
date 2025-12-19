import { useState } from "react";

export default function TapeForm({ gender, heightCm, weightInKg, method, setBodyFatPercentOverride }) {

    const sites = {
        "Navy Tape Method": gender === "M" ? ["Neck", "Waist"] : ["Neck", "Waist", "Hips"],
        "YMCA Tape Method": ["Waist", "Hip", "Neck"],
        "Covert Bailey Tape Method": ["Waist", "Hip", "Thigh", "Neck"],
        "ACE Tape Method": ["Waist", "Hip", "Neck"],
        "Military Tape Method": ["Neck", "Waist", "Hip"]
    }[method];

    const [vals, setVals] = useState(sites.map(() => ""));

    const toInches = (cm) => cm / 2.54;
    const toLbs = (kg) => kg * 2.20462;

    const calcBF = (v) => {
        const m = v.map(n => parseFloat(n) || 0);
        let bf = null;

        const weightLb = toLbs(weightInKg);
        const heightIn = toInches(heightCm);

        /* --- NAVY / MILITARY --- */
        if (method === "Navy Tape Method" || method === "Military Tape Method") {
            const neck = m[0];
            const waist = m[1];
            const hips = m[2] || 0; // default to 0 if undefined

            // Basic sanity check
            if ((gender === "M" && waist <= neck) || (gender === "F" && (waist + hips) <= neck)) return;

            if (gender === "M") {
                // Metric Navy formula for men
                bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck)
                    + 0.15456 * Math.log10(heightCm)) - 450;
            } else {
                // Metric Navy formula for women
                bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hips - neck)
                    + 0.22100 * Math.log10(heightCm)) - 450;
            }
        }

        /* --- YMCA --- */
        if (method === "YMCA Tape Method") {
            const waistIn = toInches(m[0]);

            bf = gender === "M"
                ? (((4.15 * waistIn) - (0.082 * weightLb) - 98.42) * 100) / weightLb
                : (((4.15 * waistIn) - (0.082 * weightLb) - 76.76) * 100) / weightLb;
        }

        /* --- COVERT BAILEY + ACE --- */
        if (method === "Covert Bailey Tape Method" || method === "ACE Tape Method") {
            const waist = toInches(m[0]);
            const hip = toInches(m[1]);
            const neck = toInches(m[2]);

            let lean = 0;

            if (gender === "M") {
                lean = (waist * 1.082) + 94.42 - (hip * 4.15);
            } else {
                lean = (hip * 0.732) + 8.987 + (neck / 3.140) - (waist * 0.157);
            }

            bf = ((weightLb - lean) * 100) / weightLb;
        }

        if (bf !== null && isFinite(bf)) {
            setBodyFatPercentOverride(bf);
        }
    };

    const change = (i, val) => {
        const updated = [...vals];
        updated[i] = val;
        setVals(updated);
        calcBF(updated);
    };

    return (
        <div className="caliper-method">
            {sites.map((label, i) => (
                <div key={i} className="measurement-container">
                    <label className="part-title body">{label} (cm)</label>
                    <input type="number" step="0.1" className="inputbox body"
                        value={vals[i]} onChange={(e) => change(i, e.target.value)} />
                </div>
            ))}
        </div>
    );
}
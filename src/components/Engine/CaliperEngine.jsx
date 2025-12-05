import { useState } from "react";

export default function CaliperForm({
    gender,
    age,
    method,
    setBodyDensity,
    setBodyFatPercentOverride,
}) {
    // Define inputs per method
    const inputs = {
        "Durnin / Womersley Caliper Method": ["Biceps", "Triceps", "Subscapular", "Suprailiac"],
        "Jackson / Pollock 3 Caliper Method": gender === "M" ? ["Chest", "Abdomen", "Thigh"] : ["Triceps", "Suprailiac", "Thigh"],
        "Jackson / Pollock 4 Caliper Method": ["Abdomen", "Triceps", "Suprailiac", "Thigh"],
        "Jackson / Pollock 7 Caliper Method": ["Chest", "Abdomen", "Triceps", "Subscapular", "Suprailiac", "Midaxillary", "Thigh"],
        "Parrillo Caliper Method": ["Chest", "Abdomen", "Biceps", "Triceps", "Subscapular", "Suprailiac", "Lower Back", "Thigh", "Calf"],
        "Sloan Method": gender === "M" ? ["Thigh", "Subscapular"] : ["Iliac Crest", "Triceps"],
        "Slaughter-Lohman Method": ["Triceps", "Calf"],
        "Yuhasz Method": ["Triceps", "Subscapular", "Supraspinale", "Abdominal", "Thigh", "Calf"]
    }[method];

    const [values, setValues] = useState(inputs.map(() => ""));

    const handleChange = (i, val) => {
        const updated = [...values];
        updated[i] = val;
        setValues(updated);
        compute(updated);
    };

    const compute = (vals) => {
        const m = vals.map(v => parseFloat(v) || 0);
        const sum = m.reduce((a, b) => a + b, 0);
        const sumSq = sum * sum;

        if (sum === 0) return;

        let bd = 1;

        // ----------------- DURIN -----------------
        if (method === "Durnin / Womersley Caliper Method") {
            const L = Math.log10(sum);

            if (gender === "M") {
                if (age <= 17) bd = 1.1533 - 0.0643 * L;
                else if (age <= 19) bd = 1.1620 - 0.0630 * L;
                else if (age <= 29) bd = 1.1631 - 0.0632 * L;
                else if (age <= 39) bd = 1.1422 - 0.0544 * L;
                else if (age <= 49) bd = 1.1620 - 0.0700 * L;
                else bd = 1.1715 - 0.0779 * L;
            } else {
                if (age <= 17) bd = 1.1369 - 0.0598 * L;
                else if (age <= 19) bd = 1.1549 - 0.0678 * L;
                else if (age <= 29) bd = 1.1599 - 0.0717 * L;
                else if (age <= 39) bd = 1.1423 - 0.0632 * L;
                else if (age <= 49) bd = 1.1333 - 0.0612 * L;
                else bd = 1.1339 - 0.0645 * L;
            }
        }

        // ----------------- JP3 -----------------
        else if (method === "Jackson / Pollock 3 Caliper Method") {
            bd = gender === "M"
                ? 1.10938 - 0.0008267 * sum + 0.0000016 * sumSq - 0.0002574 * age
                : 1.0994921 - 0.0009929 * sum + 0.0000023 * sumSq - 0.0001392 * age;
        }

        // ----------------- JP4 -----------------
        else if (method === "Jackson / Pollock 4 Caliper Method") {
            bd = gender === "M"
                ? 1.1620 - 0.0630 * Math.log10(sum)
                : 1.1549 - 0.0678 * Math.log10(sum);
        }

        // ----------------- JP7 -----------------
        else if (method === "Jackson / Pollock 7 Caliper Method") {
            bd = gender === "M"
                ? 1.112 - 0.00043499 * sum + 0.00000055 * sumSq - 0.00028826 * age
                : 1.097 - 0.00046971 * sum + 0.00000056 * sumSq - 0.00012828 * age;
        }

        // ----------------- PARRILLO -----------------
        else if (method === "Parrillo Caliper Method") {
            const bf = (sum * 0.105) + 2.58;
            setBodyDensity(null);
            if (setBodyFatPercentOverride) setBodyFatPercentOverride(bf);
            return;
        }

        // ---------- Sloan ----------
        else if (method === "Sloan Method") {
            if (gender === "M") {
                bd = 1.1043 - (0.001327 * m[0]) - (0.00131 * m[1]);
            } else {
                bd = 1.0764 - (0.0008 * m[0]) - (0.00088 * m[1]);
            }
        }

        // ---------- Slaughter-Lohman ----------
        else if (method === "Slaughter-Lohman Method") {
            const bf = gender === "M"
                ? 0.735 * sum + 1.0
                : 0.610 * sum + 5.1;
            setBodyDensity(null);
            if (setBodyFatPercentOverride) setBodyFatPercentOverride(bf);
            return;
        }

        // ---------- Yuhasz ----------
        else if (method === "Yuhasz Method") {
            const bf = gender === "M"
                ? (0.1051 * sum) + 2.585
                : (0.1548 * sum) + 3.580;
            setBodyDensity(null);
            if (setBodyFatPercentOverride) setBodyFatPercentOverride(bf);
            return;
        }

        setBodyDensity(bd);
    };

    return (
        <div className="caliper-method">
            {inputs.map((label, i) => (
                <div key={i} className="measurement-container">
                    <label className="part-title body">{label} <small>(mm)</small></label>
                    <input
                        type="number"
                        step="0.1"
                        className="inputbox body"
                        value={values[i]}
                        onChange={(e) => handleChange(i, e.target.value)}
                    />
                </div>
            ))}
        </div>
    );
}
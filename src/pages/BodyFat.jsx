import { useState, useMemo, useEffect } from "react";

import CaliperForm from "../components/Engine/CaliperEngine.jsx"
import TapeForm from "../components/Engine/TapeEngine.jsx"

export default function BodyFat() {

    // ---------------- STATE ----------------
    const [gender, setGender] = useState("");
    const [unit, setUnit] = useState("Metrics");
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [type, setType] = useState("FC");
    const [lifestyleCondition, setLifestyleCondition] = useState([]);
    const [selectedMethod, setSelectedMethod] = useState("");
    const [bodyDensity, setBodyDensity] = useState(null);
    const [bodyFatPercentOverride, setBodyFatPercentOverride] = useState(null);
    const [submit, setSubmit] = useState(false);
    const [tooltip, setTooltip] = useState("Please select a method to measure body fat.")

    // ---------------- METHOD LISTS ----------------
    const FC_MeasurementMethod = [
        "Durnin / Womersley Caliper Method",
        "Jackson / Pollock 3 Caliper Method",
        "Jackson / Pollock 4 Caliper Method",
        "Jackson / Pollock 7 Caliper Method",
        "Parrillo Caliper Method",
        "Sloan Method",
        "Slaughter-Lohman Method",
        "Yuhasz Method"
    ];

    const TM_MeasurementMethod = [
        "Navy Tape Method",
        "YMCA Tape Method",
        "Covert Bailey Tape Method",
        "ACE Tape Method",
        "Military Tape Method",
    ];

    const Lifestyle_ConditionsList = [
        "None",
        "Cholesterol (Dyslipidemia / Hyperlipidemia)",
        "Blood Pressure (Hypotension / Hypertension)",
        "Diabetes",
        "Thyroid (Hypothyroidism / Hyperthyroidism)",
        "Obesity (Adiposity / BMI ≥30)",
        "Liver (NAFLD / Hepatitis / Cirrhosis)",
        "Kidney (Renal / Nephropathy)",
        "Heart (Cardiovascular)",
        "Lungs (Respiratory)",
        "Bone (Osteoporosis)",
        "PCOD / PCOS (Polycystic Ovarian Disease / Syndrome)",
        "Pregnancy (Gestational Period)",
        "Surgical (Post-operative / Pre-operative Condition)",
        "Cancer (Malignancy / Neoplasm)",
        "Other",
    ]

    // ---------------- UNIT CONVERSIONS ----------------
    const weightInKg = useMemo(() => {
        if (!weight) return 0;
        return unit === "Imperial" ? parseFloat(weight) / 2.20462 : parseFloat(weight);
    }, [weight, unit]);

    const heightInCm = useMemo(() => {
        if (!height) return 0;
        return unit === "Imperial" ? parseFloat(height) * 2.54 : parseFloat(height);
    }, [height, unit]);


    // ---------------- AGE ----------------
    const age = useMemo(() => {
        if (!dob) return 20;
        const today = new Date();
        const birth = new Date(dob);

        let a = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--;

        return a;
    }, [dob]);


    // ---------------- BMI ----------------
    const bmi = useMemo(() => {
        if (!weightInKg || !heightInCm) return null;
        return weightInKg / ((heightInCm / 100) ** 2);
    }, [weightInKg, heightInCm]);

    const bmiCategory = useMemo(() => {
        if (!bmi) return "-";
        if (bmi < 18.5) return "Underweight";
        if (bmi < 25) return "Normal";
        if (bmi < 30) return "Overweight";
        if (bmi < 35) return "Obesity Class I";
        if (bmi < 40) return "Obesity Class II";
        return "Obesity Class III";
    }, [bmi]);


    // ---------------- BODY FAT % ----------------
    const bodyFatPercent = useMemo(() => {
        if (bodyFatPercentOverride !== null) return bodyFatPercentOverride;
        if (!bodyDensity) return null;
        return 495 / bodyDensity - 450; // Siri Equation
    }, [bodyDensity, bodyFatPercentOverride]);


    // ---------------- FAT MASS ----------------
    const bodyFatMassKg = useMemo(() => {
        if (!weightInKg || !bodyFatPercent) return null;
        return (weightInKg * bodyFatPercent) / 100;
    }, [weightInKg, bodyFatPercent]);


    // ---------------- IDEAL BODY WEIGHT ----------------
    const idealBodyWeight = useMemo(() => {
        if (!heightInCm) return null;
        const hIn = heightInCm / 2.54;

        return gender === "M"
            ? 50 + 2.3 * (hIn - 60)
            : 45.5 + 2.3 * (hIn - 60);
    }, [gender, heightInCm]);


    // ---------------- SUBMIT ----------------
    const handleSubmit = () => {
        if (!weight || !height || !dob) {
            alert("Please enter your Weight, Height, and Date of Birth.");
            return;
        }
        setSubmit(true);
    };


    // ---------------- PRINT ----------------
    const handlePrint = () => {
        window.print();
    };

    // ---------------- TOOLTIPS ----------------
    useEffect(() => {
        switch (selectedMethod) {
            // ---------- FAT CALIPER ----------
            case "Durnin / Womersley Caliper Method":
                setTooltip("Measures 4 skinfolds to estimate body fat; quick and practical for general population assessments.");
                break;
            case "Jackson / Pollock 3 Caliper Method":
                setTooltip("Uses 3 skinfold sites for a simple and fairly accurate body fat estimation.");
                break;
            case "Jackson / Pollock 4 Caliper Method":
                setTooltip("Adds a fourth site for improved accuracy over the 3-site method; suitable for more precise body fat estimation.");
                break;
            case "Jackson / Pollock 7 Caliper Method":
                setTooltip("Measures 7 skinfold sites for a comprehensive and highly accurate body fat assessment, ideal for detailed tracking or research.");
                break;
            case "Parrillo Caliper Method":
                setTooltip("Measures 9 skinfolds across the body; useful for bodybuilding or athletic body composition monitoring.");
                break;
            case "Sloan Method":
                setTooltip("Uses 2 skinfolds with gender-specific equations; simple and effective for clinical or fitness body fat estimation.");
                break;
            case "Slaughter-Lohman Method":
                setTooltip("Measures triceps and calf skinfolds in children and adolescents; safe for tracking growth and body fat changes in youth.");
                break;
            case "Yuhasz Method":
                setTooltip("Uses 6 skinfolds with population-specific equations; accurate for athletic populations or sport-specific assessments.");
                break;

            // ---------- TAPE MEASUREMENT ----------
            case "Navy Tape Method":
                setTooltip("Measures neck and waist (plus hips for women); quick estimation of body fat using circumference-based equations.");
                break;
            case "YMCA Tape Method":
                setTooltip("Uses waist, hip, and neck measurements; simple tape-based method for general fitness body fat estimation.");
                break;
            case "Covert Bailey Tape Method":
                setTooltip("Uses waist, hip, thigh, and neck measurements; provides a more detailed circumference-based estimate of body fat.");
                break;
            case "ACE Tape Method":
                setTooltip("Measures waist, hip, and neck; designed by ACE for practical fitness body fat tracking.");
                break;
            case "Military Tape Method":
                setTooltip("Uses neck, waist, and hip measurements; used by military standards for body fat assessment.");
                break;

            default:
                setTooltip("Please select a method to measure body fat.");
        }
    }, [selectedMethod]);

    return (
        <div className="tool">
            <div className="tool-container container">

                {/* ---------------- GENDER + UNITS ---------------- */}
                <div className="units-section">

                    {/* Gender */}
                    {/* <div className={`toggle ${gender === "M" ? "toggle--right" : "toggle--left"}`}>
                        <button className={`body ${gender === "M" ? "toggle-active" : "toggle-disable"}`} onClick={() => setGender("M")}>Male</button>
                        <button className={`body ${gender === "F" ? "toggle-active" : "toggle-disable"}`} onClick={() => setGender("F")}>Female</button>
                    </div> */}

                    {/* Units */}
                    <div className={`toggle ${unit === "Metrics" ? "toggle--right" : "toggle--left"}`}>
                        <button className={`body ${unit === "Metrics" ? "toggle-active" : "toggle-disable"}`} onClick={() => setUnit("Metrics")}>Metrics <small>(kg/cm)</small></button>
                        <button className={`body ${unit === "Imperial" ? "toggle-active" : "toggle-disable"}`} onClick={() => setUnit("Imperial")}>Imperial <small>(lb/in)</small></button>
                    </div>
                </div>

                {/* ---------------- USER INPUT ---------------- */}
                <div className="user-section">

                    <div className="details-container users_name">
                        <label className="body">Full Name</label>
                        <input className="inputbox body" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="details-container users_dob">
                        <label className="body">
                            Date of Birth <span>*</span>
                        </label>
                        <input type="date" className="inputbox body" value={dob} onChange={(e) => setDob(e.target.value)} />
                    </div>


                    {/* Gender */}
                    <div className="details-container users_gender">
                        <label className="body">
                            Gender <span>*</span>
                        </label>
                        <select value={gender} onChange={(e) => setGender(e.target.value)} className="dropdown body">
                            <option value="" disabled hidden>Select Method</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>

                    <div className="details-container users_weight">
                        <label className="body">
                            Weight <small>({unit === "Metrics" ? "kg" : "lb"})</small> <span>*</span>
                        </label>
                        <input type="number" step="0.1" className="inputbox body" value={weight} onChange={(e) => setWeight(e.target.value)} />
                    </div>

                    <div className="details-container users_height">
                        <label className="body">
                            Height <small>({unit === "Metrics" ? "cm" : "inch"})</small> <span>*</span>
                        </label>
                        <input type="number" step="0.1" className="inputbox body" value={height} onChange={(e) => setHeight(e.target.value)} />
                    </div>

                    {/* Lifestyle Risks */}
                    <div className="details-container users_risks">
                        <label className="body">
                            Primary Conditions
                        </label>
                        <select value={lifestyleCondition} onChange={(e) => setLifestyleCondition(e.target.value)} className="dropdown body">
                            <option value="" disabled hidden>None</option>
                            {Lifestyle_ConditionsList.map((c, i) => <option key={i} value={c}>{c}</option>)}
                        </select>
                    </div>

                </div>

                {/* ---------------- METHOD SELECTION ---------------- */}
                <div className="method-section">

                    <div className={`toggle ${type === "FC" ? "toggle--right" : "toggle--left"}`}>
                        <button className={`body ${type === "FC" ? "toggle-active" : "toggle-disable"}`} onClick={() => { setType("FC"); setSelectedMethod(""); }}>Fat Caliper</button>

                        <button className={`body ${type === "TM" ? "toggle-active" : "toggle-disable"}`} onClick={() => { setType("TM"); setSelectedMethod(""); }}>Tape Measurement</button>
                    </div>

                    <select value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)} className="dropdown">
                        <option value="" disabled hidden>Select Method</option>

                        {(type === "FC" ? FC_MeasurementMethod : TM_MeasurementMethod)
                            .map((m, i) => <option key={i} value={m}>{m}</option>)}
                    </select>

                    <div className="tooltips">
                        <p className="body tooltip-icon" data-tooltip={tooltip}>i</p>
                    </div>

                </div>

                {/* ---------------- CALIPER FORMS ---------------- */}
                {type === "FC" && selectedMethod &&
                    <CaliperForm
                        gender={gender}
                        age={age}
                        method={selectedMethod}
                        setBodyDensity={setBodyDensity}
                        setBodyFatPercentOverride={setBodyFatPercentOverride} />
                }

                {/* ---------------- TAPE FORM ---------------- */}
                {type === "TM" && selectedMethod &&
                    <TapeForm
                        gender={gender}
                        heightCm={heightInCm}
                        weightInKg={weightInKg}
                        method={selectedMethod}
                        setBodyFatPercentOverride={setBodyFatPercentOverride} />
                }

                {/* ---------------- RESULTS ---------------- */}
                {submit && (
                    <div className="result-section">
                        <h3 className="heading-3">Results</h3>

                        <div className="result basic-result">
                            <div className="infobox">
                                <p className="body">Age</p>
                                <p className="inputbox body">{age} Yrs</p>
                            </div>

                            <div className="infobox">
                                <p className="body">BMI</p>
                                <p className="inputbox body">{bmi ? bmi.toFixed(2) : "-"} — {bmiCategory}</p>
                            </div>
                        </div>

                        <div className="result body-result">
                            <div className="infobox">
                                <p className="body">Body Fat %</p>
                                <p className="inputbox body">{bodyFatPercent ? bodyFatPercent.toFixed(2) : "-"} %</p>
                            </div>

                            <div className="infobox">
                                <p className="body">Body Fat Mass</p>
                                <p className="inputbox body">{bodyFatMassKg ? bodyFatMassKg.toFixed(2) : "-"} kg</p>
                            </div>

                            <div className="infobox">
                                <p className="body">Ideal Body Weight</p>
                                <p className="inputbox body">{idealBodyWeight ? idealBodyWeight.toFixed(2) : "-"} kg</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ---------------- CTA ---------------- */}
                <div className="cta">
                    {!submit && (
                        <button className="result-btn pill-button body" onClick={handleSubmit}>
                            View Results
                        </button>
                    )}

                    <button className="print-btn pill-button body" onClick={handlePrint}>
                        Print Results
                    </button>
                </div>

            </div>
        </div>
    );
}
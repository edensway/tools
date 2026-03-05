import { useState, useMemo, useEffect } from "react";

import logo from "../assets/logo.svg";

export default function BodyIndex() {

    const [unit, setUnit] = useState("Metrics");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");

    const [waist, setWaist] = useState("");
    const [hip, setHip] = useState("");
    const [bodyFat, setBodyFat] = useState("");

    const [submit, setSubmit] = useState(false);

    // ---------- LOCAL STORAGE ----------
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("userForm"));
        if (!saved) return;

        setUnit(saved.unit ?? "Metrics");
        setAge(saved.age ?? "");
        setGender(saved.gender ?? "");
        setHeight(saved.height ?? "");
    }, []);

    useEffect(() => {
        localStorage.setItem(
            "userForm",
            JSON.stringify({ unit, age, gender, height })
        );
    }, [unit, age, gender, height]);

    // ---------- SESSION STORAGE ----------
    useEffect(() => {
        const savedWeight = sessionStorage.getItem("userWeight");
        if (savedWeight) setWeight(savedWeight);
    }, []);

    useEffect(() => {
        if (weight) sessionStorage.setItem("userWeight", weight);
    }, [weight]);

    // ---------- UNIT CONVERSION ----------
    const weightInKg = useMemo(() => {
        if (!weight) return 0;
        return unit === "Imperial"
            ? parseFloat(weight) / 2.20462
            : parseFloat(weight);
    }, [weight, unit]);

    const heightInCm = useMemo(() => {
        if (!height) return 0;
        return unit === "Imperial"
            ? parseFloat(height) * 2.54
            : parseFloat(height);
    }, [height, unit]);

    const waistCm = useMemo(() => {
        if (!waist) return 0;
        return unit === "Imperial"
            ? parseFloat(waist) * 2.54
            : parseFloat(waist);
    }, [waist, unit]);

    const hipCm = useMemo(() => {
        if (!hip) return 0;
        return unit === "Imperial"
            ? parseFloat(hip) * 2.54
            : parseFloat(hip);
    }, [hip, unit]);

    const heightM = heightInCm / 100;

    // ---------- BMI ----------
    const bmi = useMemo(() => {
        if (!weightInKg || !heightM) return null;
        return weightInKg / (heightM * heightM);
    }, [weightInKg, heightM]);

    // ---------- LEAN BODY MASS ----------
    const leanBodyMass = useMemo(() => {
        if (bodyFat === "" || !weightInKg) return null;
        return weightInKg * (1 - bodyFat / 100);
    }, [bodyFat, weightInKg]);

    // ---------- FFMI ----------
    const ffmi = useMemo(() => {
        if (!leanBodyMass || !heightM) return null;
        return leanBodyMass / (heightM * heightM);
    }, [leanBodyMass, heightM]);

    // ---------- WHR ----------
    const whr = useMemo(() => {
        if (!waistCm || !hipCm) return null;
        return waistCm / hipCm;
    }, [waistCm, hipCm]);

    // ---------- WHtR ----------
    const whtr = useMemo(() => {
        if (!waistCm || !heightInCm) return null;
        return waistCm / heightInCm;
    }, [waistCm, heightInCm]);

    // ---------- BAI ----------
    const bai = useMemo(() => {
        if (!hipCm || !heightM) return null;
        return (hipCm / Math.pow(heightM, 1.5)) - 18;
    }, [hipCm, heightM]);

    // ---------- ABSI ----------
    const absi = useMemo(() => {
        if (!waistCm || !bmi || !heightM) return null;

        const waistM = waistCm / 100;

        return waistM /
            (Math.pow(bmi, 2 / 3) * Math.sqrt(heightM));
    }, [waistCm, bmi, heightM]);

    // ---------- BODY TYPE CLASSIFICATION ----------
    const bodyType = useMemo(() => {

        if (!whtr) return null;

        if (ffmi !== null && ffmi >= 24 && whtr < 0.44)
            return { label: "Elite Athlete", desc: "Extremely muscular with excellent body composition." };

        if (ffmi !== null && ffmi >= 22 && whtr < 0.46)
            return { label: "Athletic", desc: "High muscle mass and very healthy fat distribution." };

        if (whtr < 0.50)
            return { label: "Fit", desc: "Healthy body composition and good fat distribution." };

        if (whtr < 0.55)
            return { label: "Average", desc: "Body composition within typical population range." };

        if (whtr < 0.60)
            return { label: "Overfat", desc: "Higher than recommended body fat levels." };

        return { label: "Obese", desc: "High abdominal fat which may increase health risks." };

    }, [ffmi, whtr]);

    // ---------- SUBMIT ----------
    const handleSubmit = () => {

        const missing = [];

        if (!gender) missing.push("Gender");
        if (!height) missing.push("Height");
        if (!weight) missing.push("Weight");
        if (!waist) missing.push("Waist");
        if (!hip) missing.push("Hip");

        if (missing.length > 0) {
            alert(`Please enter ${missing.join(", ")}`);
            return;
        }

        setSubmit(true);
    };

    const handleRestart = () => {

        if (!window.confirm("Restart calculator?")) return;

        localStorage.removeItem("userForm");
        sessionStorage.removeItem("userWeight");

        setAge("");
        setGender("");
        setHeight("");
        setWeight("");
        setWaist("");
        setHip("");
        setBodyFat("");
        setUnit("Metrics");
        setSubmit(false);
    };

    const handlePrint = () => window.print();

    return (

        <div className="tool">
            <div className="tool-container container">

                {/* UNIT TOGGLE */}

                <div className="units-section">
                    <div className={`toggle ${unit === "Metrics" ? "toggle--right" : "toggle--left"}`}>

                        <button
                            className={`body ${unit === "Metrics" ? "toggle-active" : "toggle-disable"}`}
                            onClick={() => setUnit("Metrics")}
                        >
                            Metrics <small>(kg/cm)</small>
                        </button>

                        <button
                            className={`body ${unit === "Imperial" ? "toggle-active" : "toggle-disable"}`}
                            onClick={() => setUnit("Imperial")}
                        >
                            Imperial <small>(lb/in)</small>
                        </button>

                    </div>
                </div>

                {/* INPUTS */}

                <div className="user-section">

                    <div className="details-container">
                        <label className="body">Age</label>
                        <input type="number"
                            min={0}
                            max={122}
                            step={1}
                            className="inputbox body"
                            value={age}
                            onChange={(e) => setAge(e.target.value)} />
                    </div>

                    <div className="details-container">
                        <label className="body">Gender <span>*</span></label>
                        <select className="dropdown" value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value="" hidden>Select</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>

                    <div className="details-container">
                        <label className="body">Height <small>({unit === "Metrics" ? "cm" : "inch"})</small> <span>*</span></label>
                        <input type="number" className="inputbox body" value={height} onChange={(e) => setHeight(e.target.value)} />
                    </div>

                    <div className="details-container">
                        <label className="body">Weight <small>({unit === "Metrics" ? "kg" : "lb"})</small> <span>*</span></label>
                        <input type="number" className="inputbox body" value={weight} onChange={(e) => setWeight(e.target.value)} />
                    </div>

                    <div className="details-container">
                        <label className="body">Waist <small>({unit === "Metrics" ? "cm" : "inch"})</small> <span>*</span></label>
                        <input type="number" className="inputbox body" value={waist} onChange={(e) => setWaist(e.target.value)} />
                    </div>

                    <div className="details-container">
                        <label className="body">Hip <small>({unit === "Metrics" ? "cm" : "inch"})</small> <span>*</span></label>
                        <input type="number" className="inputbox body" value={hip} onChange={(e) => setHip(e.target.value)} />
                    </div>

                    <div className="details-container">
                        <label className="body">Body Fat Percentage</label>
                        <input
                            type="number"
                            min="0"
                            max="70"
                            className="inputbox body"
                            value={bodyFat}
                            onChange={(e) => setBodyFat(e.target.value)}
                        />
                    </div>

                </div>

                {/* RESULTS */}

                {submit && (

                    <div className="result-section">

                        <h3 className="heading-3">Body Index Results</h3>

                        <div className="result body-index-result">

                            <div className="infobox">
                                <p className="body">Waist-to-Hip Ratio</p>
                                <p className="inputbox mono">{whr?.toFixed(2) ?? "-"}</p>
                            </div>

                            <div className="infobox">
                                <p className="body">Waist-to-Height Ratio</p>
                                <p className="inputbox mono">{whtr?.toFixed(2) ?? "-"}</p>
                            </div>

                        </div>

                        <div className="result body-index-result-2">

                            <div className="infobox">
                                <p className="body">Fat-Free Mass Index</p>
                                <p className="inputbox mono">{ffmi?.toFixed(2) ?? "-"}</p>
                            </div>

                            <div className="infobox">
                                <p className="body">Body Adiposity Index</p>
                                <p className="inputbox mono">{bai?.toFixed(2) ?? "-"} <small>%</small></p>
                            </div>

                            <div className="infobox">
                                <p className="body">A Body Shape Index</p>
                                <p className="inputbox mono">{absi?.toFixed(4) ?? "-"}</p>
                            </div>

                        </div>

                        <div className="result body-index-result-3">

                            <div className="infobox">
                                <p className="body">Body Classification</p>
                                <p className="inputbox">
                                    {bodyType?.label ?? "-"} - {bodyType?.desc}
                                </p>
                            </div>

                        </div>

                    </div>

                )}

                {/* BUTTONS */}

                <div className="lower-section">

                    <div className="cta">

                        {!submit ? (
                            <>
                                <button className="result-btn pill-button body" onClick={handleSubmit}>
                                    View Results
                                </button>

                                <button className="print-btn pill-button body" onClick={handleRestart}>
                                    Restart
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="refresh-btn pill-button body" onClick={handleRestart}>
                                    Restart
                                </button>

                                <button className="print-btn pill-button body" onClick={handlePrint}>
                                    Print Results
                                </button>
                            </>
                        )}

                    </div>

                    <div className="source-logo">
                        <img src={logo} alt="Logo" className="logo ew-logo" />
                    </div>

                </div>

            </div>
        </div>
    );
}
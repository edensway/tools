import { useState, useMemo } from "react";
import cdcLms from "../data/cdc_bmi_lms.json";

import logo from "../assets/logo.svg";
import who_logo from "../assets/bmi/WHO_logo.svg";
import cdc_logo from "../assets/bmi/CDC_logo.svg";

// Error function (convert z-score → percentile)
function erf(x) {
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const t = 1 / (1 + 0.3275911 * x);

    const y =
        1 -
        (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
            t *
            Math.exp(-x * x));

    return sign * y;
}

export default function BMI() {
    // ------------------------
    // STATE
    // ------------------------
    const [unit, setUnit] = useState("Metrics");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [submit, setSubmit] = useState(false);

    // ------------------------
    // BASIC COMPUTED VALUES
    // ------------------------
    const isChild = useMemo(() => parseInt(age) < 18, [age]);
    const ageMonths = useMemo(() => (parseInt(age) || 0) * 12, [age]);

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

    const bmi = useMemo(() => {
        if (!weightInKg || !heightInCm) return null;
        return weightInKg / Math.pow(heightInCm / 100, 2);
    }, [weightInKg, heightInCm]);

    // ------------------------
    // CHILD PERCENTILE (CDC)
    // ------------------------
    const childPercentile = useMemo(() => {
        if (!bmi || !isChild || !gender) return null;

        const sexNum = gender === "M" ? 1 : 2;
        const entries = cdcLms.filter(e => e.Sex === sexNum);
        if (!entries.length) return null;

        const minAge = entries[0].Agemos;
        const maxAge = entries[entries.length - 1].Agemos;

        const clampedAge = Math.min(Math.max(ageMonths, minAge), maxAge);

        let lower = entries[0];
        let upper = entries[entries.length - 1];

        for (let i = 0; i < entries.length; i++) {
            if (entries[i].Agemos <= clampedAge) lower = entries[i];
            if (entries[i].Agemos >= clampedAge) {
                upper = entries[i];
                break;
            }
        }

        const t =
            lower.Agemos === upper.Agemos
                ? 0
                : (clampedAge - lower.Agemos) /
                (upper.Agemos - lower.Agemos);

        const L = lower.L + t * (upper.L - lower.L);
        const M = lower.M + t * (upper.M - lower.M);
        const S = lower.S + t * (upper.S - lower.S);

        const z =
            L !== 0
                ? (Math.pow(bmi / M, L) - 1) / (L * S)
                : Math.log(bmi / M) / S;

        const percentile =
            100 * 0.5 * (1 + erf(z / Math.sqrt(2)));

        return Math.min(Math.max(percentile, 0), 100);
    }, [bmi, isChild, ageMonths, gender]);

    // ------------------------
    // CATEGORY
    // ------------------------
    const progressCategory = useMemo(() => {
        if (!bmi) return "-";

        if (isChild && childPercentile !== null) {
            const p = childPercentile;

            if (p < 5) return "Underweight";
            if (p < 85) return "Healthy";
            if (p < 95) return "Overweight";
            return "Obesity";
        }

        if (bmi < 18.5) return "Underweight";
        if (bmi < 25) return "Normal";
        if (bmi < 30) return "Overweight";
        if (bmi < 35) return "Obesity I";
        if (bmi < 40) return "Obesity II";
        return "Obesity III";
    }, [bmi, childPercentile, isChild]);

    // ------------------------
    // PROGRESS BAR COLOUR
    // ------------------------
    const getProgressBarClass = () => {
        switch (progressCategory) {
            case "Underweight": return "pb-uw blue";
            case "Normal":
            case "Healthy": return "pb-n green";
            case "Overweight": return "pb-ow yellow";
            case "Obesity I":
            case "Obesity": return "pb-o1 orange";
            case "Obesity II": return "pb-o2 dark_orange";
            case "Obesity III": return "pb-o3 red";
            default: return "";
        }
    };

    // ------------------------
    // PROGRESS VALUE POSITION
    // ------------------------
    const progressValue = useMemo(() => {
        if (!bmi) return 0;

        if (isChild && childPercentile !== null) {
            const p = childPercentile;

            if (p < 5) return (p / 5) * 20;
            if (p < 85) return 20 + ((p - 5) / 80) * 60;
            if (p < 95) return 80 + ((p - 85) / 10) * 10;
            return 90 + Math.min((p - 95) * 2, 10);
        }

        const clamped = Math.min(Math.max(bmi, 16), 40);
        return ((clamped - 16) / 24) * 100;
    }, [bmi, childPercentile, isChild]);

    // ------------------------
    // IDEAL BODY WEIGHT (ADULTS)
    // ------------------------
    const idealBodyWeight = useMemo(() => {
        if (!heightInCm || isChild) return null;

        const hIn = heightInCm / 2.54;

        return gender === "M"
            ? 50 + 2.3 * (hIn - 60)
            : 45.5 + 2.3 * (hIn - 60);
    }, [gender, heightInCm, isChild]);

    // ------------------------
    // LABEL DEFINITIONS
    // ------------------------
    const childLabels = [
        { label: "0th", pos: 0 },
        { label: "5th", pos: 20 },
        { label: "85th", pos: 80 },
        { label: "95th", pos: 90 },
        { label: "100th", pos: 100 },
    ];

    const adultLabels = [
        { label: 16, pos: 0 },
        { label: 18.5, pos: ((18.5 - 16) / 24) * 100 },
        { label: 25, pos: ((25 - 16) / 24) * 100 },
        { label: 30, pos: ((30 - 16) / 24) * 100 },
        { label: 35, pos: ((35 - 16) / 24) * 100 },
        { label: 40, pos: 100 },
    ];

    const formattedChildPercentile = useMemo(() => {
        if (childPercentile === null) return "";
        if (childPercentile < 5) return "<5th";
        if (childPercentile > 100) return ">100th";
        return `${childPercentile.toFixed(0)}th`;
    }, [childPercentile]);

    // ------------------------
    // BUTTON HANDLERS
    // ------------------------
    const handleSubmit = () => {
        if (!weight || !height || !age || !gender) {
            alert("Please enter all required fields.");
            return;
        }
        setSubmit(true);
    };

    const handleRestart = () => {
        if (!window.confirm("Are you sure you want to restart?")) return;

        setAge("");
        setGender("");
        setWeight("");
        setHeight("");
        setUnit("Metrics");
        setSubmit(false);
    };

    const handlePrint = () => window.print();

    // ============================================================
    // RENDER
    // ============================================================
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

                {/* USER INPUT */}
                <div className="user-section bmi-user-section">

                    <div className="details-container users_age">
                        <label className="body">Age <span>*</span></label>
                        <input
                            type="number"
                            className="inputbox body"
                            value={age}
                            min="0"
                            onChange={e => setAge(e.target.value)}
                        />
                    </div>

                    <div className="details-container users_gender">
                        <label className="body">Gender <span>*</span></label>
                        <select
                            value={gender}
                            onChange={e => setGender(e.target.value)}
                            className="dropdown body"
                        >
                            <option value="" disabled hidden>Select Gender</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>

                    <div className="details-container users_height">
                        <label className="body">
                            Height <small>({unit === "Metrics" ? "cm" : "inch"})</small> <span>*</span>
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            className="inputbox body"
                            value={height}
                            onChange={e => setHeight(e.target.value)}
                        />
                    </div>

                    <div className="details-container users_weight">
                        <label className="body">
                            Weight <small>({unit === "Metrics" ? "kg" : "lb"})</small> <span>*</span>
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            className="inputbox body"
                            value={weight}
                            onChange={e => setWeight(e.target.value)}
                        />
                    </div>

                </div>

                {/* RESULTS */}
                {submit && (
                    <div className="result-section">
                        <h3 className="heading-3">Results</h3>

                        {/* BMI SCALE */}
                        <div className="bmi-scale">
                            <div className="category">
                                <p className="bmi-category">
                                    {progressCategory}
                                    {isChild ? ` (${formattedChildPercentile})` : ""}
                                </p>
                                <div className={`indicator ${getProgressBarClass()}`} />
                            </div>

                            <progress
                                className={`progress-bar ${getProgressBarClass()}`}
                                min="0"
                                max="100"
                                value={progressValue}
                            />

                            {/* LABELS */}
                            <div className="label">
                                {isChild
                                    ? childLabels.map((l, i) => (
                                        <div
                                            key={i}
                                            className="name"
                                            style={{ left: `${l.pos}%` }}>
                                            <div className="line"></div>
                                            <p>{l.label}</p>
                                        </div>
                                    ))
                                    : adultLabels.map((l, i) => (
                                        <div
                                            key={i}
                                            className="name"
                                            style={{ left: `${l.pos}%` }}>
                                            <div className="line"></div>
                                            <p>{l.label}</p>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* NUMERIC RESULTS */}
                        <div className="result bmi-result">

                            <div className="infobox">
                                <p className="body">BMI</p>
                                <p className="inputbox body">
                                    {bmi ? bmi.toFixed(2) : "-"}{" "}
                                    <small>kg/m<sup>2</sup></small>
                                </p>
                            </div>

                            {!isChild && idealBodyWeight && (
                                <div className="infobox">
                                    <p className="body">Ideal Body Weight</p>
                                    <p className="inputbox body">
                                        {idealBodyWeight.toFixed(2)} <small>kg</small>{" "}
                                        <span className="diff">
                                            ({weightInKg - idealBodyWeight > 0 ? "+" : ""}{(weightInKg - idealBodyWeight).toFixed(2)} <small>kg</small>)
                                        </span>
                                    </p>
                                </div>
                            )}

                        </div>
                    </div>
                )}

                {/* BOTTOM BUTTONS */}
                <div className="lower-section">
                    <div className="cta">
                        {!submit ? (
                            <button className="result-btn pill-button body" onClick={handleSubmit}>
                                View Results
                            </button>
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
                        <img src={who_logo} alt="WHO Logo" className="logo who-logo" />
                        <img src={cdc_logo} alt="CDC Logo" className="logo cdc-logo" />
                        <img src={logo} alt="Eden's Way Logo" className="logo ew-logo" />
                    </div>
                </div>

            </div>
        </div>
    );
}
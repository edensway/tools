import { useState, useMemo } from "react";

export default function BMI() {
    const [unit, setUnit] = useState("Metrics");
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("F");
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [submit, setSubmit] = useState(false);

    const weightInKg = useMemo(() => {
        if (!weight) return 0;
        return unit === "Imperial" ? parseFloat(weight) / 2.20462 : parseFloat(weight);
    }, [weight, unit]);

    const heightInCm = useMemo(() => {
        if (!height) return 0;
        return unit === "Imperial" ? parseFloat(height) * 2.54 : parseFloat(height);
    }, [height, unit]);

    const bmi = useMemo(() => {
        if (!weightInKg || !heightInCm) return null;
        return weightInKg / (Math.pow(heightInCm / 100, 2));
    }, [weightInKg, heightInCm]);

    const bmiPercent = useMemo(() => {
        if (!bmi) return 0;
        const clamped = Math.min(Math.max(bmi, 16), 40);
        return ((clamped - 16) / (40 - 16)) * 100;
    }, [bmi]);

    const bmiCategory = useMemo(() => {
        if (!bmi) return "-";
        if (bmi < 18.5) return "Underweight";
        if (bmi < 25) return "Normal";
        if (bmi < 30) return "Overweight";
        if (bmi < 35) return "Obesity I";
        if (bmi < 40) return "Obesity II";
        return "Obesity III";
    }, [bmi]);

    const getProgressBarClass = () => {
        if (!bmi) return "";
        switch (bmiCategory) {
            case "Underweight":
                return "pb-uw blue";
            case "Normal":
                return "pb-n green";
            case "Overweight":
                return "pb-ow yellow";
            case "Obesity I":
                return "pb-o1 orange";
            case "Obesity II":
                return "pb-o2 dark_orange";
            case "Obesity III":
                return "pb-o3 red";
            default:
                return "";
        }
    };

    const idealBodyWeight = useMemo(() => {
        if (!heightInCm) return null;
        const hIn = heightInCm / 2.54;
        return gender === "M"
            ? 50 + 2.3 * (hIn - 60)
            : 45.5 + 2.3 * (hIn - 60);
    }, [gender, heightInCm]);

    const handleSubmit = () => {
        if (!weight || !height || !age) {
            alert("Please enter your Weight, Height, and Age");
            return;
        }
        setSubmit(true);
    };

    const handlePrint = () => {
        window.print();
    };

    // scale positions
    const labels = [
        { value: 16, pos: 0 },
        { value: 18.5, pos: (2.5 / 24) * 100 },
        { value: 25, pos: ((2.5 + 6.5) / 24) * 100 },
        { value: 30, pos: ((2.5 + 6.5 + 5) / 24) * 100 },
        { value: 35, pos: ((2.5 + 6.5 + 5 + 5) / 24) * 100 },
        { value: 40, pos: 100 }
    ];

    return (
        <div className="tool">
            <div className="tool-container container">
                <div className="units-section">
                    <div className={`toggle ${unit === "Metrics" ? "toggle--right" : "toggle--left"}`}>
                        <button className={`body ${unit === "Metrics" ? "toggle-active" : "toggle-disable"}`} onClick={() => setUnit("Metrics")}>
                            Metrics <small>(kg/cm)</small>
                        </button>
                        <button className={`body ${unit === "Imperial" ? "toggle-active" : "toggle-disable"}`} onClick={() => setUnit("Imperial")}>
                            Imperial <small>(lb/in)</small>
                        </button>
                    </div>
                </div>

                <div className="user-section bmi-user-section">

                    <div className="details-container users_age">
                        <label className="body">Age <span>*</span></label>
                        <input type="number" className="inputbox body" value={age} onChange={(e) => setAge(e.target.value)} />
                    </div>

                    <div className="details-container users_gender">
                        <label className="body">Gender <span>*</span></label>
                        <select value={gender} onChange={(e) => setGender(e.target.value)} className="dropdown body">
                            <option value="" disabled hidden>
                                Select Method
                            </option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>

                    <div className="details-container users_weight">
                        <label className="body">Weight <small>({unit === "Metrics" ? "kg" : "lb"})</small> <span>*</span></label>
                        <input type="number" step="0.1" className="inputbox body" value={weight} onChange={(e) => setWeight(e.target.value)} />
                    </div>

                    <div className="details-container users_height">
                        <label className="body">Height <small>({unit === "Metrics" ? "cm" : "inch"})</small> <span>*</span></label>
                        <input type="number" step="0.1" className="inputbox body" value={height} onChange={(e) => setHeight(e.target.value)} />
                    </div>
                </div>

                {submit && (
                    <div className="result-section">
                        <h3 className="heading-3">Results</h3>

                        <div className="bmi-scale">

                            <div className="category">
                                <p className="bmi-category">{bmiCategory}</p>
                                <div className={`indicator ${getProgressBarClass()}`}></div>

                            </div>

                            <progress
                                className={`progress-bar ${getProgressBarClass()}`}
                                min="0"
                                max="100"
                                value={bmiPercent}>
                            </progress>


                            <div className="label">
                                {labels.map((l, i) => (
                                    <p key={i} style={{ left: `${l.pos}%` }}>
                                        {l.value}
                                    </p>
                                ))}
                            </div>
                        </div>

                        <div className="result bmi-result">
                            <div className="infobox">
                                <p className="body">BMI</p>
                                <p className="inputbox body">{bmi ? bmi.toFixed(2) : "-"} <small>kg/m<sup>2</sup></small></p>
                            </div>

                            <div className="infobox">
                                <p className="body">Ideal Body Weight</p>
                                <p className="inputbox body">{idealBodyWeight ? idealBodyWeight.toFixed(2) : "-"} <small>kg</small></p>
                            </div>
                        </div>
                    </div>
                )}

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
        </div >
    );
}
import { useState, useMemo } from "react";

export default function BMI() {

    const [unit, setUnit] = useState("Metrics");

    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [submit, setSubmit] = useState(false);

    // ---------------- UNIT CONVERSIONS ----------------
    const weightInKg = useMemo(() => {
        if (!weight) return 0;
        return unit === "Imperial" ? parseFloat(weight) / 2.20462 : parseFloat(weight);
    }, [weight, unit]);

    const heightInCm = useMemo(() => {
        if (!height) return 0;
        return unit === "Imperial" ? parseFloat(height) * 2.54 : parseFloat(height);
    }, [height, unit]);

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
        if (!weight || !height || !age) {
            alert("Please enter your Weight, Height, and Age");
            return;
        }
        setSubmit(true);
    };


    // ---------------- PRINT ----------------
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="tool">
            <div className="tool-container container">

                <div className="units-section">

                    {/* Units */}
                    <div className={`toggle ${unit === "Metrics" ? "toggle--right" : "toggle--left"}`}>
                        <button className={`body ${unit === "Metrics" ? "toggle-active" : "toggle-disable"}`} onClick={() => setUnit("Metrics")}>Metrics (kg/cm)</button>
                        <button className={`body ${unit === "Imperial" ? "toggle-active" : "toggle-disable"}`} onClick={() => setUnit("Imperial")}>Imperial (lb/in)</button>
                    </div>
                </div>

                {/* ---------------- USER INPUT ---------------- */}
                <div className="user-section">

                    <div className="details-container users_name">
                        <label className="body">Full Name</label>
                        <input className="inputbox body" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="details-container users_age">
                        <label className="body">
                            Age <span>*</span>
                        </label>
                        <input type="number" className="inputbox body" value={age} onChange={(e) => setAge(e.target.value)} />
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

                </div>

                {/* ---------------- RESULTS ---------------- */}
                {submit && (
                    <div className="result-section">
                        <h3 className="heading-3">Results</h3>

                        <div className="result basic-result">
                            <div className="infobox">
                                <p className="body">BMI</p>
                                <p className="inputbox body">{bmi ? bmi.toFixed(2) : "-"} — {bmiCategory}</p>
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
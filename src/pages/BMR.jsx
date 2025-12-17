import { useState, useMemo } from "react";

import logo from "../assets/logo.svg";
import who_logo from "../assets/bmi/WHO_logo.svg";

export default function BMR() {
    // ------------------------
    // STATE
    // ------------------------
    const [unit, setUnit] = useState("Metrics");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [activity, setActivity] = useState("sedentary");
    const [goal, setGoal] = useState("lose");
    const [submit, setSubmit] = useState(false);

    // ------------------------
    // UNIT CONVERSIONS
    // ------------------------
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

    // ------------------------
    // BMR (Mifflin–St Jeor)
    // ------------------------
    const bmr = useMemo(() => {
        if (!age || !weightInKg || !heightInCm || !gender) return null;

        return gender === "M"
            ? 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5
            : 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;
    }, [age, gender, weightInKg, heightInCm]);

    // ------------------------
    // TDEE
    // ------------------------
    const activityLevels = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9,
    };

    const tdee = useMemo(() => {
        if (!bmr) return null;
        return bmr * activityLevels[activity];
    }, [bmr, activity]);

    // ------------------------
    // CALORIE TARGET (BASED ON GOAL)
    // ------------------------
    const calorieTarget = useMemo(() => {
        if (!tdee) return null;

        switch (goal) {
            case "lose":
                return {
                    note: "Calorie Deficit (~15%)",
                    calories: tdee * 0.85,
                };
            case "gain":
                return {
                    note: "Calorie Surplus (~12%)",
                    calories: tdee * 1.12,
                };
            default:
                return {
                    note: "Maintenance Calories",
                    calories: tdee,
                };
        }
    }, [tdee, goal]);

    // ------------------------
    // HANDLERS
    // ------------------------
    const handleSubmit = () => {
        if (!age || !gender || !weight || !height) {
            alert("Please fill in all required fields.");
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
        setActivity("sedentary");
        setGoal("lose");
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
                <div className="user-section bmr-user-section">

                    <div className="details-container">
                        <label className="body">Age <span>*</span></label>
                        <input
                            type="number"
                            min={0}
                            step={1}
                            className="inputbox body"
                            value={age}
                            onChange={e => {
                                const v = e.target.value;
                                if (Number.isInteger(Number(v)) || v === "") setAge(v);
                            }}
                        />
                    </div>

                    <div className="details-container">
                        <label className="body">Gender <span>*</span></label>
                        <select
                            className="dropdown body"
                            value={gender}
                            onChange={e => setGender(e.target.value)}
                        >
                            <option value="" disabled hidden>Select gender</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>

                    <div className="details-container">
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

                    <div className="details-container">
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

                    <div className="details-container">
                        <label className="body">Activity level <span>*</span></label>
                        <select
                            className="dropdown body"
                            value={activity}
                            onChange={e => setActivity(e.target.value)}
                        >
                            <option value="sedentary">Sedentary</option>
                            <option value="light">Light (1–3 days/week)</option>
                            <option value="moderate">Moderate (3–5 days/week)</option>
                            <option value="active">Active (6–7 days/week)</option>
                            <option value="very_active">Very active</option>
                        </select>
                    </div>

                    <div className="details-container">
                        <label className="body">Goal <span>*</span></label>
                        <select
                            className="dropdown body"
                            value={goal}
                            onChange={e => setGoal(e.target.value)}
                        >
                            <option value="lose">Lose Weight</option>
                            <option value="maintain">Maintain Weight</option>
                            <option value="gain">Gain weight</option>
                        </select>
                    </div>

                </div>

                {/* RESULTS */}
                {submit && (
                    <div className="result-section">
                        <h3 className="heading-3">Results</h3>

                        <div className="result bmr-result">

                            <div className="infobox">
                                <p className="body">Basal Metabolic Rate (BMR)</p>
                                <p className="inputbox body">
                                    {bmr?.toFixed(0)} <small>kcal/day</small>
                                </p>
                            </div>

                            <div className="infobox">
                                <p className="body">Total Daily Energy Expenditure (TDEE)</p>
                                <p className="inputbox body">
                                    {tdee?.toFixed(0)} <small>kcal/day</small>
                                </p>
                            </div>

                            {calorieTarget && (
                                <div className="infobox">
                                    <p className="body">{calorieTarget.note}</p>
                                    <p className="inputbox body">
                                        {calorieTarget.calories.toFixed(0)}{" "}
                                        <small>kcal/day</small>
                                    </p>
                                </div>
                            )}

                        </div>
                    </div>
                )}

                {/* BUTTONS */}
                <div className="lower-section">
                    <div className="cta">
                        {!submit ? (
                            <button className="result-btn pill-button body" onClick={handleSubmit}>
                                View results
                            </button>
                        ) : (
                            <>
                                <button className="refresh-btn pill-button body" onClick={handleRestart}>
                                    Restart
                                </button>
                                <button className="print-btn pill-button body" onClick={handlePrint}>
                                    Print results
                                </button>
                            </>
                        )}
                    </div>

                    <div className="source-logo">
                        <img src={who_logo} alt="WHO Logo" className="logo who-logo" />
                        <img src={logo} alt="Eden's Way logo" className="logo ew-logo" />
                    </div>
                </div>

            </div>
        </div>
    );
}
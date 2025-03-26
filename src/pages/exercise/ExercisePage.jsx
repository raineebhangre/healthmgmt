import React, { useState, useEffect } from "react";
import { FaDumbbell } from "react-icons/fa";
import PastRecordsGrid from "./components/PastRecordsGrid";

const API_KEY = "1b1d57fa2dmsh4d93f79c5f069d4p1483f6jsn398ff3b58e0c";
const API_URL = "https://exercisedb.p.rapidapi.com/exercises/bodyPart/";


const MedicalExercisePage = () => {
    const [userInfo, setUserInfo] = useState({
        height: "",
        weight: "",
        sex: "default",
    });

    const [bmi, setBmi] = useState(null);
    const [bmiCategory, setBmiCategory] = useState("");
    const [bmiColor, setBmiColor] = useState("bg-gray-800");
    const [bmiWarningMessage, setBmiWarningMessage] = useState("");
    const [exerciseRecommendations, setExerciseRecommendations] = useState([]);
    //const [pastRecords, setPastRecords] = useState([]);
    const [bmiRecords, setBmiRecords] = useState([]);  // ✅ Store records locally


    // Added dynamic boundaries
    const BOUNDARIES = {
        height: { min: 100, max: 250 },
        weight: { min: 26, max: 150 }
    };

    // Retrieve records from localStorage when the component mounts
    useEffect(() => {
        const storedRecords = localStorage.getItem("bmiRecords");
        if (storedRecords) {
            setBmiRecords(JSON.parse(storedRecords));
        }
    }, []);

    // Save records to localStorage whenever bmiRecords changes
    useEffect(() => {
        localStorage.setItem("bmiRecords", JSON.stringify(bmiRecords));
    }, [bmiRecords]);


    const handleUserInfoChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    const calculateBMI = async () => {
        const { height, weight, sex } = userInfo;

        const heightValue = parseFloat(height);
        const weightValue = parseFloat(weight);

        if (!heightValue || !weightValue || sex === "default") {
            setBmiWarningMessage("⚠ Please fill all required fields for BMI calculation!");
            return;
        }

          if (heightValue < BOUNDARIES.height.min || heightValue > BOUNDARIES.height.max) {
            setBmiWarningMessage(`⚠ Height must be between ${BOUNDARIES.height.min} cm and ${BOUNDARIES.height.max} cm!`);
            return;
        }
        if (weightValue < BOUNDARIES.weight.min || weightValue > BOUNDARIES.weight.max) {
            setBmiWarningMessage(`⚠ Weight must be between ${BOUNDARIES.weight.min} kg and ${BOUNDARIES.weight.max} kg!`);
            return;
        }

        setBmiWarningMessage("");

        const heightInMeters = heightValue / 100;
        const bmiValue = weightValue / (heightInMeters * heightInMeters);
        setBmi(bmiValue.toFixed(2));

        let category = "", colorClass = "";

        if (bmiValue < 16) {
            category = "Severe Thinness";
            colorClass = "bg-red-900";
        } else if (bmiValue < 17) {
            category = "Moderate Thinness";
            colorClass = "bg-red-700";
        } else if (bmiValue < 18.5) {
            category = "Mild Thinness";
            colorClass = "bg-yellow-500";
        } else if (bmiValue < 25) {
            category = "Normal";
            colorClass = "bg-green-500";
        } else if (bmiValue < 30) {
            category = "Overweight";
            colorClass = "bg-yellow-400";
        } else if (bmiValue < 35) {
            category = "Obese Class I";
            colorClass = "bg-yellow-600";
        } else if (bmiValue < 40) {
            category = "Obese Class II";
            colorClass = "bg-red-600";
        } else {
            category = "Obese Class III";
            colorClass = "bg-red-900";
        }

        setBmiCategory(category);
        setBmiColor(colorClass);

       const newRecord = {
            height: heightValue,
            weight: weightValue,
            sex: sex,
            bmi: bmiValue.toFixed(2),
            category,
            colorClass,
            createdAt: new Date().toISOString(), // Add a timestamp
        };
    
        setBmiRecords(prevRecords => [...prevRecords, newRecord]);

        fetchExercises(category);


    };


    const fetchExercises = async (bmiCategory) => {
        let bodyParts = [];
        const validBodyParts = [
            'back', 'cardio', 'chest', 'lower arms', 'lower legs', 
            'neck', 'shoulders', 'upper arms', 'upper legs', 'waist'
        ];

        if (bmiCategory.includes("Severe Thinness") || bmiCategory.includes("Moderate Thinness")) {
            bodyParts = ["upper arms", "upper legs", "chest"];
        } else if (bmiCategory.includes("Mild Thinness")) {
            bodyParts = ["upper arms", "upper legs", "back"];
        } else if (bmiCategory === "Normal") {
            bodyParts = ["cardio", "shoulders", "waist"];
        } else if (bmiCategory === "Overweight") {
            bodyParts = ["cardio", "lower legs", "waist"];
        } else if (bmiCategory === "Obese Class I") {
            bodyParts = ["cardio", "upper legs", "lower legs"];
        } else if (bmiCategory === "Obese Class II") {
            bodyParts = ["cardio", "waist", "lower arms"];
        } else {
            bodyParts = ["cardio", "upper legs"];
        }

        try {
            console.log("🚀 Fetching exercise data for:", bodyParts);
        
            const validRequests = bodyParts
                .filter(part => validBodyParts.includes(part))
                .map(part => {
                    console.log(`🔹 Fetching data for: ${part}`);
                    return fetch(`${API_URL}${encodeURIComponent(part)}`, {
                        method: "GET",
                        headers: {
                            "X-RapidAPI-Key": API_KEY, 
                            "X-RapidAPI-Host": "exercisedb.p.rapidapi.com"
                        }
                    });
                });
        
                const responses = await Promise.all(validRequests);
        
                // Check for valid responses
                const validResponses = responses.filter(response => 
                    response.status === 200 && response.ok
                );
        
                if (validResponses.length === 0) {
                    throw new Error("No valid exercise data found");
                }
        
                const data = await Promise.all(validResponses.map(res => res.json()));
                const combinedData = data.flat();
                
                // Use proper placeholder URL
                const exercisesWithFallback = combinedData.map(exercise => ({
                    ...exercise,
                    gifUrl: exercise.gifUrl || "https://placehold.co/600x400"
                }));
        
                setExerciseRecommendations(exercisesWithFallback.slice(0, 12));
            } catch (error) {
                console.error("Error fetching exercises:", error);
                setExerciseRecommendations([]);
            }
        };

        const handleDeleteRecord = (index) => {
            setBmiRecords((prevRecords) => {
                const updatedRecords = [...prevRecords];
                updatedRecords.splice(index, 1); // Remove the record at the specified index
                return updatedRecords;
            });
        };
    
        // ... (rest of your existing code, e.g., calculateBMI, fetchExercises, etc.)


    return (
        <div className="min-h-screen w-full flex flex-col items-center bg-gray-900 text-gray-200 p-6">
            <div className="w-full max-w-6xl bg-gray-800 bg-opacity-90 shadow-lg rounded-lg p-8">
                <h1 className="text-3xl font-bold text-blue-400 text-center mb-6">🏥 Medical Exercise Tracker</h1>

                <div className="p-6 rounded-lg border border-blue-500 bg-gray-900">
                    <h2 className="text-xl font-semibold text-blue-400 mb-4">🩺 Patient Information</h2>

                    <div className="grid grid-cols-2 gap-4">
                        {["height", "weight"].map((field) => (
                            <div key={field} className="relative group">
                                <input
                                    type="number"
                                    name={field}
                                    value={userInfo[field]}
                                    onChange={handleUserInfoChange}
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1) + " (cm/kg)"}
                                    className="p-3 w-full border border-blue-500 rounded-md bg-gray-800 text-white text-lg"
                                />
                            </div>
                        ))}

                        <div>
                            <select
                                name="sex"
                                value={userInfo.sex}
                                onChange={handleUserInfoChange}
                                className="p-3 w-full border rounded-md bg-gray-800 text-white text-lg"
                            >
                                <option value="default" disabled>Sex (♂/♀)</option>
                                <option value="male">♂ Male</option>
                                <option value="female">♀ Female</option>
                                <option value="other">  ⚧ Prefer not to say</option>
                            </select>
                        </div>
                    </div>

                    {bmiWarningMessage && (
                        <div className="mt-4 p-3 text-yellow-400 bg-gray-800 border-l-4 border-yellow-500 rounded-md">
                            {bmiWarningMessage}
                        </div>
                    )}

                    <button
                        onClick={calculateBMI}
                        className="mt-4 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md w-full"
                    >
                        🧮 Calculate BMI & Get Exercises
                    </button>
                </div>

                {bmi && (
                    <div className={`mt-6 p-4 text-center text-white font-semibold rounded-lg ${bmiColor}`}>
                        BMI: {bmi} ({bmiCategory})
                    </div>
                )}

                {/* Past Records Section */}
                <div className="mt-6 p-6 bg-gray-800 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-green-400 mb-4">📊 Past Records</h2>
                    {bmiRecords.length > 0 ? (
                        <PastRecordsGrid records={bmiRecords} onDelete={handleDeleteRecord} /> 
                    ) : (
                        <p className="text-gray-400">No records available. Add a new record to see it here.</p>
                    )}
                </div>

                {exerciseRecommendations.length > 0 && (
                    <div className="mt-6 p-6 bg-gray-800 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-green-400 mb-4">🎯 Recommended Exercises</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {exerciseRecommendations.map((exercise, index) => (
                                <div key={index} className="p-6 bg-gray-900 rounded-xl shadow-xl h-full">
                                    <div className="mb-4 h-64 overflow-hidden rounded-lg bg-gray-800 flex items-center justify-center">
                                        <img 
                                            src={exercise.gifUrl || "https://placehold.co/600x400"} 
                                            alt={exercise.name} 
                                            className="w-full h-full object-contain p-2"
                                        />
                                    </div>
                                    <p className="text-lg font-bold text-center mb-2">{exercise.name}</p>
                                    <p className="text-sm text-gray-400 text-center">Target: {exercise.target}</p>
                                    <p className="text-sm text-gray-400 text-center mt-2">
                                        Equipment: {exercise.equipment}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MedicalExercisePage;
import { useLocation } from "react-router-dom";

const AnalysisPage = () => {
    const { state } = useLocation();
    
    return (
        <div className="p-6 bg-[#13131a] text-white">
            <h2 className="text-xl font-semibold">Analysis Results</h2>
            <p>{state?.analysisResult || "No analysis available."}</p>
        </div>
    );
};

export default AnalysisPage;

import { IconChevronRight, IconFileUpload, IconProgress } from "@tabler/icons-react";
import React, { useState } from "react";
import RecordDetailsHeader from "./components/record-detail-header";
import { useLocation, useNavigate } from "react-router-dom";
import FileUploadModal from "./components/file-upload-modal";
import { useStateContext } from "../../context";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SingleRecordDetails = () => {
    const geminiApiKey= import.meta.env.VITE_GEMINI_API_KEY;
    const { state } = useLocation(); // ✅ Ensure state is not null
    const [analysisResult, setAnalysisResult] = useState(state?.analysisResult || "",
    );
    //console.log(state);

    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [processing, setProcessing] = useState(false);
   
    
    const [filename, setFilename] = useState("");
    const [filetype, setFileType] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const {updateRecord} = useStateContext()

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };


    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFileType(selectedFile.type);
        setFilename(selectedFile.name);
        setFile(selectedFile);
    };

    const readFileBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(",")[1]); // Fix split issue
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleFileUpload = async () => {
        if (!file) return;

        setUploading(true);
        setUploadSuccess(false);

        const genAI = new GoogleGenerativeAI(geminiApiKey);

        try {
            const base64 = await readFileBase64(file);
            const imageParts = [
                {
                    inlineData: {
                        data: base64,
                        mimeType: filetype,
                    },
                },
            ];

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            const prompt = `
                You are a highly experienced medical expert specializing in report analysis and health recommendations. 
                Analyze the uploaded medical report in detail and provide a structured response, covering the following aspects:

                1. Examination & Critical Health Indicators  
                - Identify key health parameters and check for abnormalities.  
                - Highlight any critical values that deviate from the normal range.  
                - Provide a brief medical explanation of the abnormalities.  

                2. Summary & Health Implications  
                - Summarize key findings in a patient-friendly way.  
                - Explain potential health risks based on the report.  

                3. General Health Recommendations  
                - List do’s and don’ts based on report findings.  
                - Suggest harmless home remedies for minor health concerns.  
                - Advise whether a doctor visit is necessary and specify which specialist (e.g., Endocrinologist, Gynecologist, General Physician).  

                4. Condition-Specific Recommendations  
                - For Diabetes:  
                    - Provide a personalized diet plan (recommended and restricted foods).  
                    - Suggest a safe and effective exercise routine.  
                    - Outline a detailed treatment plan (medications, lifestyle changes, monitoring strategies).  
                    - Recommend which doctor to visit and when, based on severity.  
                
                - For PCOD:  
                    - Suggest a balanced diet plan focusing on hormonal balance, weight management, and insulin resistance.  
                    - Provide an exercise routine that helps regulate menstrual cycles.  
                    - Outline a treatment plan (lifestyle changes, supplements, medical interventions).  
                    - Recommend a gynecologist or endocrinologist, based on the severity of symptoms.  

                - For Other Major Health Conditions:  
                    - Briefly explain the health issue and its implications.  
                    - Suggest precautionary tests or follow-up evaluations.  
                    - Provide general health tips for maintaining well-being.  

                5. Urgency & Final Recommendations  
                - Clearly mention if the condition is severe and requires immediate medical attention.  
                - Avoid medical jargon and ensure the analysis is clear, actionable, and patient-friendly.  
                `;

            const results = await model.generateContent([prompt, ...imageParts]);
            const response = await results.response;
            const text = response.text();
            setAnalysisResult(text);

            await updateRecord({
                documentID: state.id,
                analysisResult: text,
                kanbanRecords: "",
            });

            setUploadSuccess(true);
            setIsModalOpen(false);
            setFilename("");
            setFile(null);
            setFileType("");
        } catch (error) {
            console.error("Error uploading file:", error);
            setUploadSuccess(false);
            setIsModalOpen(false);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-wrap gap-[26px]">
            <button
                type="button"
                onClick={handleOpenModal}
                className="mt-6 inline-flex items-center gap-x-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-[#13131a] dark:text-white dark:hover:bg-neutral-800"
            >
                <IconFileUpload size={20} />
                Upload Reports
            </button>

            <FileUploadModal 
            isOpen={isModalOpen} 
            onClose={handleCloseModal} 
            onFileChange={handleFileChange}
            onFileUpload={handleFileUpload}
            uploading={uploading}
            uploadSuccess={uploadSuccess}
            filename={filename}
            />

            <RecordDetailsHeader recordName={state.recordName} />

            <div className="w-full">
                <div className="flex flex-col">
                    <div className="-m-1.5 overflow-x-auto">
                        <div className="inline-block min-w-full p-1.5 align-middle">
                            <div className="overflow-hidden rounded-xl border border-neutral-700 shadow-sm bg-[#13131a]">
                                <div className="border-b border-neutral-700 px-6 py-4">
                                    <h2 className="text-xl font-semibold text-neutral-200">
                                        Personalized AI-Driven Treatment Plan
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                                        A tailored medical strategy leveraging advanced AI insights.
                                    </p>
                                </div>

                                <div className="flex w-full flex-col px-6 py-4 text-white">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                                            Analysis Result
                                        </h2>
                                        <div className="space-y-2">{analysisResult}</div>
                                    </div>

                                    <div className="mt-5 grid gap-2 sm:flex">
                                        <button
                                            type="button"
                                            onClick={() => {}}
                                            className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
                                        >
                                            View Treatment plan
                                            <IconChevronRight size={20} />
                                            {processing && (
                                                <IconProgress
                                                    size={10}
                                                    className="mr-3 h-5 w-5 animate-spin"
                                                />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleRecordDetails;
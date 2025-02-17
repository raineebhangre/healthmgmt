import { IconChevronRight, IconFileUpload, IconProgress } from "@tabler/icons-react";
import React, { useState } from "react";
import RecordDetailsHeader from "./components/record-detail-header";
import { useLocation, useNavigate } from "react-router-dom";
import FileUploadModal from "./components/file-upload-modal";
import { useStateContext } from "../../context";

const SingleRecordDetails = () => {
    const {state} = useLocation();
    //console.log(state);
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [analysisResult,setAnalysisResult] = useState(
        state.analysisResult || "",
    );
    //console.log(state);
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
        const file = e.target.files[0];
        setFileType(file.type);
        setFilename(file.name);
        setFile(file);
        
    };

    return(
        <div className="flex flex-wrap gap-[26px]">
            <button 
            type="button"
            onClick={() => {}}
            className="mt-6 inline-flex items-center gap-x-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-[#13131a] dark:text-white dark:hover:bg-neutral-800"
            >
                {/*<IconFileUpload/>*/}
                Upload Reports

            </button>
            {/*fileuploadmodal*/}
            <FileUploadModal
            //isOpen={isModalOpen}
            
            />
            <RecordDetailsHeader recordName={state.recordName}/>

            <div className="w-full">
                <div className="flex flex-col">
                    <div className="-m-1.5 overflow-x-auto">
                        <div className="inline-block min-w-full p-1.5 align-middle">
                            <div className="overflow- rounded-xl border border-neutral-700 shadow-sm bg-[#13131a]">
                                <div className="border-b border-neutral-700 px-6 py-4">
                                    <h2 className="text-xl font-semibold text-neutral-200">
                                        Personalized AI-Driven Treatment Plan 
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                                        A tailored medical strategy leveraging advanced AI insights.
                                    </p>
                                </div >
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
                                                {true && (
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
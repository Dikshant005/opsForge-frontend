import { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { createTicket } from "./ticketSlice";

const CreateTicket = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message }

    const dispatch = useDispatch();

    const previewUrl = useMemo(() => {
        if (!file) return null;
        return URL.createObjectURL(file);
    }, [file]);

    useEffect(() => {
        if (!previewUrl) return;
        return () => URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0] || null);
    };

    const handleRemoveFile = () => {
        setFile(null);
        const input = document.getElementById('ticketFile');
        if (input) input.value = ''; // lets the same file be re-selected later
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedback(null);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (file) {
            formData.append('file', file);
        }

        setIsSubmitting(true);
        try {
            await dispatch(createTicket(formData)).unwrap();
            setTitle('');
            setDescription('');
            setFile(null);
            setFeedback({ type: 'success', message: 'Ticket created successfully.' });
        } catch (error) {
            console.error('Failed to create ticket:', error);
            setFeedback({ type: 'error', message: "Something went wrong while creating the ticket. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Create Ticket</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow border flex flex-col gap-5">

                {feedback && (
                    <div
                        className={`rounded-lg p-3 text-sm font-medium ${
                            feedback.type === 'success'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-600 border border-red-200'
                        }`}
                    >
                        {feedback.message}
                    </div>
                )}

                {/* TITLE FIELD */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="ticketTitle" className="text-sm font-semibold text-gray-700">
                        Ticket Title
                    </label>
                    <input
                        id="ticketTitle"
                        name="title"
                        type="text"
                        required
                        autoComplete="off"
                        placeholder="e.g., Login button is broken"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                </div>

                {/* DESCRIPTION FIELD */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="ticketDesc" className="text-sm font-semibold text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="ticketDesc"
                        name="description"
                        autoComplete="off"
                        placeholder="Describe the issue in detail..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 h-28 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                    />
                </div>

                {/* FILE UPLOAD FIELD */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="ticketFile" className="text-sm font-semibold text-gray-700">
                        Attach Screenshot <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                        id="ticketFile"
                        name="file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="text-sm text-gray-600 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-blue-600 hover:file:bg-blue-100"
                    />

                    {file && (
                        <div className="mt-2 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-2">
                            {file.type?.startsWith('image/') ? (
                                <img
                                    src={previewUrl}
                                    alt="Screenshot preview"
                                    className="h-14 w-14 rounded-md border border-gray-200 object-cover"
                                />
                            ) : (
                                <div className="flex h-14 w-14 items-center justify-center rounded-md border border-gray-200 bg-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-gray-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                    </svg>
                                </div>
                            )}
                            <div className="flex-1 overflow-hidden">
                                <p className="truncate text-sm font-medium text-gray-700">{file.name}</p>
                                <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleRemoveFile}
                                className="text-xs font-semibold text-red-500 hover:text-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !title.trim()}
                    className="bg-blue-600 text-white font-semibold p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
            </form>
        </div>
    );
};

export default CreateTicket;
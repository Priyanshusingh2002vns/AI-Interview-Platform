import React, { useState } from "react";
import api from "../api";

const CVInterview = () => {

    const [file, setFile] = useState(null);

    const [questions, setQuestions] = useState([]);

    const [current, setCurrent] = useState(0);

    const [answer, setAnswer] = useState("");

    const [feedback, setFeedback] = useState("");

    const [loading, setLoading] = useState(false);

    const [completed, setCompleted] = useState(false);

    const uploadCV = async () => {

        const formData = new FormData();

        formData.append("cv", file);

        const res = await api.post(
            "/cv_question/",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        setQuestions(res.data.questions);
    };

    const submitAnswer = async () => {

        setLoading(true);

        try {

            const res = await api.post("/evaluate_answer/", {

                technology: "cv",

                question: questions[current],

                answer

            });

            setFeedback(res.data.feedback);

        } finally {

            setLoading(false);

        }

    };

    const nextQuestion = () => {

        if (current === questions.length - 1) {

            setCompleted(true);

            return;

        }

        setCurrent(current + 1);

        setAnswer("");

        setFeedback("");

    };

    if (completed) {

        return (

            <div className="min-h-screen flex justify-center items-center">

                <div className="bg-white p-10 rounded shadow">

                    <h1 className="text-4xl font-bold">

                        🎉 Interview Completed

                    </h1>

                </div>

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-gray-100 flex justify-center items-center">

            <div className="bg-white p-8 rounded-xl shadow-lg w-[700px]">

                <h1 className="text-3xl font-bold mb-6">

                    CV Interview

                </h1>

                {questions.length === 0 && (

                    <>

                        <input

                            type="file"

                            accept=".txt,.docx,.doc,.pdf"

                            onChange={(e) => setFile(e.target.files[0])}

                        />

                        {file && (
                            <p className="text-green-600 mt-3">Selected:{file.name}</p>
                        )}

                        <br /><br />

                        <button

                            onClick={uploadCV}

                            className="bg-blue-600 text-white px-5 py-2 rounded"

                        >

                            Upload CV

                        </button>

                    </>

                )}

                {questions.length > 0 && (

                    <>

                        <h2 className="text-xl font-bold">

                            Question {current + 1} / {questions.length}

                        </h2>

                        <div className="mt-5 bg-blue-50 p-5 rounded">

                            {questions[current]}

                        </div>

                        <textarea

                            rows="6"

                            className="border w-full mt-5 p-3"

                            value={answer}

                            onChange={(e) => setAnswer(e.target.value)}

                        />

                        {!feedback && (

                            <button

                                onClick={submitAnswer}

                                disabled={loading}

                                className="bg-green-600 text-white px-5 py-2 rounded mt-5"

                            >

                                {loading ? "Evaluating..." : "Submit"}

                            </button>

                        )}

                        {feedback && (

                            <>

                                <div className="bg-gray-100 p-5 mt-5 rounded whitespace-pre-wrap">

                                    {feedback}

                                </div>

                                <button

                                    onClick={nextQuestion}

                                    className="bg-blue-600 text-white px-5 py-2 rounded mt-5"

                                >

                                    {current === questions.length - 1

                                        ? "Finish Interview"

                                        : "Next Question"}

                                </button>

                            </>

                        )}

                    </>

                )}

            </div>

        </div>

    );

};

export default CVInterview;
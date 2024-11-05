import React, { useState } from "react";
import { useSnippets } from "./SnippetContext";

const InitialUserPage = ({ setIsFirstTimeUser }) => {
    const { isDarkMode } = useSnippets()
    const [sheetUrl, setSheetUrl] = useState("")

    function getSheetId(url) {
        const regex = /\/d\/([a-zA-Z0-9-_]+)\//;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    return (
        <>
            <div className="w-full h-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-semibold text-gray-700 mb-4">Welcome</h1>

                <p className="text-gray-600 mb-2">Instruction - 1</p>
                <input
                    className="w-full p-3 rounded-lg bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    type="text"
                    value={sheetUrl}
                    placeholder="Enter sheet URL"
                    onChange={(e) => setSheetUrl(e.target.value)}
                />

                <p className="text-gray-600 mt-4 mb-2">Instruction - 2</p>
                <button
                    className="w-full p-3 mt-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onClick={() => {
                        if (!sheetUrl) {
                            alert('Please enter a URL');
                            return;
                        }
                        chrome.runtime.sendMessage({
                            msg: 'InitialUserSetup',
                            payload: getSheetId(sheetUrl)
                        }, (response) => {
                            if (response == 'ok') {
                                setIsFirstTimeUser(false)
                            }
                        });
                    }}
                >
                    Register
                </button>
            </div>

        </>
    )

}

export default InitialUserPage;
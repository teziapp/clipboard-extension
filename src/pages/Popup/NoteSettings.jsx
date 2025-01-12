import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dexieStore } from "../../Dexie/DexieStore";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useSnippets } from "./SnippetContext";

export const NoteSettings = () => {
    const activeSymbolId = parseInt(useParams().activeSymbolId);
    const [activeSymbol, setActiveSymbol] = useState({});
    const [titleInput, setTitleInput] = useState("");
    const [variantInput, setVariantInput] = useState("");
    const [linkedSymbols, setLinkedSymbols] = useState([]);
    const [positiveUrls, setPositiveUrls] = useState([]);
    const [positiveUrlInput, setPositiveUrlInput] = useState("");

    const { isDarkMode } = useSnippets()
    const navigate = useNavigate();

    useEffect(() => {
        dexieStore.getSymbol(activeSymbolId).then((symbol) => {
            setActiveSymbol(symbol);
            setTitleInput(symbol.title);
            setLinkedSymbols(symbol.symbols);
            setPositiveUrls(symbol.urls);
        });
    }, []);

    return (
        <div
            className={` w-full h-full flex flex-col py-2 ${isDarkMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-800"
                }`}
        >
            {/* Header */}
            <div className="flex p-2 items-center mb-2">
                <ArrowLeft
                    className={`cursor-pointer ${isDarkMode ? "text-[#00d091]" : "text-[#008069]"
                        } hover:opacity-80`}
                    size={24}
                    onClick={() => navigate(`/activeNotes/${activeSymbol.symId}`)}
                />
                <span className="px-4 font-semibold text-2xl">Settings</span>
            </div>
            <div className="p-3 pb-2 w-full h-full overflow-y-scroll">
                {/* Title Section */}
                <div
                    className={`mb-4 p-4 rounded-md ${isDarkMode ? "bg-gray-800" : "bg-gray-100"
                        }`}
                >
                    <label className="block mb-2 text-lg font-semibold">Title</label>
                    <input
                        type="text"
                        value={titleInput}
                        onChange={(e) => setTitleInput(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md ${isDarkMode
                            ? "bg-gray-700 border-gray-600 text-gray-200"
                            : "bg-white border-gray-300"
                            }`}
                    />
                </div>

                {/* Linked Symbols Section */}
                <div
                    className={`mb-4 p-4 rounded-md ${isDarkMode ? "bg-gray-800" : "bg-gray-100"
                        }`}
                >
                    <span className="block mb-2 text-lg font-semibold">Linked Symbols</span>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {linkedSymbols.map((variant, index) => (
                            <div
                                key={index}
                                className={`flex items-center px-3 py-1 rounded-md ${isDarkMode
                                    ? "bg-gray-700 text-gray-200 border border-gray-600"
                                    : "bg-white text-gray-800 border border-gray-300"
                                    }`}
                            >
                                {variant}
                                <button
                                    onClick={() => {
                                        if (linkedSymbols.length == 1) return;
                                        setLinkedSymbols((p) => p.filter((ele) => ele !== variant));
                                    }}
                                    className="ml-2 hover:opacity-75"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={variantInput}
                            onChange={(e) => setVariantInput(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md ${isDarkMode
                                ? "bg-gray-700 border-gray-600 text-gray-200"
                                : "bg-white border-gray-300"
                                }`}
                        />
                        <button
                            onClick={() => {
                                if (!variantInput) return;
                                setLinkedSymbols((p) => [...p, variantInput]);
                                setVariantInput("");
                            }}
                            className={`px-3 py-1 rounded-md ${isDarkMode
                                ? "bg-green-500 hover:bg-green-400 text-gray-900"
                                : "bg-green-500 hover:bg-green-400 text-white"
                                }`}
                        >
                            <Plus size={15} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* Positive URLs Section */}
                <div
                    className={`p-4 mb-2 rounded-md ${isDarkMode ? "bg-gray-800" : "bg-gray-100"
                        }`}
                >
                    <span className="block mb-2 text-lg font-semibold">Positive URLs</span>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {positiveUrls.map((url, index) => (
                            <div
                                key={index}
                                className={`flex items-center px-3 py-1 rounded-md ${isDarkMode
                                    ? "bg-gray-700 text-gray-200 border border-gray-600"
                                    : "bg-white text-gray-800 border border-gray-300"
                                    }`}
                            >
                                {url}
                                <button
                                    onClick={() => {
                                        setPositiveUrls((p) => p.filter((i) => !url.includes(i)));
                                    }}
                                    className="ml-2 hover:opacity-75"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={positiveUrlInput}
                            onChange={(e) => setPositiveUrlInput(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md ${isDarkMode
                                ? "bg-gray-700 border-gray-600 text-gray-200"
                                : "bg-white border-gray-300"
                                }`}
                        />
                        <button
                            onClick={() => {
                                if (!positiveUrlInput) return;
                                setPositiveUrls((p) => [...p, positiveUrlInput]);
                                setPositiveUrlInput("");
                            }}
                            className={`px-3 py-2 rounded-md ${isDarkMode
                                ? "bg-green-500 hover:bg-green-400 text-gray-900"
                                : "bg-green-500 hover:bg-green-400 text-white"
                                }`}
                        >
                            <Plus size={15} strokeWidth={3} />
                        </button>
                    </div>
                </div>
                <div className="flex flex-row justify-around mt-4">
                    <button
                        className={`mt-3 px-3 py-2 text-white rounded-md font-semibold ${isDarkMode
                            ? "bg-green-500 hover:bg-green-400"
                            : "bg-green-500 hover:bg-green-400"
                            }`}
                        onClick={async () => {
                            if (!titleInput) {
                                alert("Enter title please")
                                return;
                            }
                            await dexieStore.updateSymbol({
                                symId: activeSymbolId,
                                title: titleInput,
                                symbols: linkedSymbols,
                                urls: positiveUrls
                            })
                            navigate(`/activeNotes/${activeSymbolId}`)
                        }}
                    >
                        Save
                    </button>
                    <button onClick={async () => {
                        await deleteChat()
                        navigate('/noteList/')
                    }}
                        className="bg-red-500 mt-3 px-3 py-2 text-white rounded-md font-semibold">
                        Delete Chat
                    </button>
                </div>
            </div>
        </div>
    );

};

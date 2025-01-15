import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, dexieStore } from "../../Dexie/DexieStore";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useSnippets } from "./SnippetContext";

export const NoteSettings = () => {
    const activeSymbolId = parseInt(useParams().activeSymbolId);
    const [activeSymbol, setActiveSymbol] = useState({});
    const [titleInput, setTitleInput] = useState("");
    const [variantInput, setVariantInput] = useState("");
    const [linkedSymbols, setLinkedSymbols] = useState([]);
    const [negativeUrls, setNegativeUrls] = useState([]);
    const [negativeUrlInput, setNegativeUrlInput] = useState("");

    const { isDarkMode } = useSnippets()
    const navigate = useNavigate();

    useEffect(() => {
        dexieStore.getSymbol(activeSymbolId).then((symbol) => {
            setActiveSymbol(symbol);
            setTitleInput(symbol.title);
            setLinkedSymbols(symbol.symbols);
        });
    }, []);

    useEffect(() => {
        dexieStore.getNegatives(linkedSymbols.map((symbol) => {
            return [
                activeSymbolId,
                symbol.toLocaleLowerCase().replace(/[ .]/g, "")
            ]
        })).then((arr) => {
            console.log(arr)
            setNegativeUrls(arr.filter(negative => negative))
        })

    }, [linkedSymbols])

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
                            onClick={async () => {
                                if (!variantInput) return;
                                setLinkedSymbols((p) => [...p, variantInput.trim()]);
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

                {/* negative URLs Section */}
                {/* Negative URLs Section */}
                <div
                    className={`mb-4 p-4 rounded-md ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}
                >
                    {/* Title */}
                    <label className="block mb-4 text-lg font-semibold">Negative URLs</label>

                    {/* Negative URL Display */}
                    <div className="mb-4 flex flex-wrap gap-4">
                        {negativeUrls.map((negative, index) => !negative.urls.length ? null : (
                            <div
                                key={index}
                                className={`p-3 rounded-md shadow-sm w-full sm:w-auto ${isDarkMode
                                    ? "bg-gray-700 text-gray-200 border border-gray-600"
                                    : "bg-white text-gray-800 border border-gray-300"
                                    }`}
                            >
                                {/* Symbol Label */}
                                <p className="font-medium mb-2">
                                    {linkedSymbols.find(symbol =>
                                        symbol.toLocaleLowerCase().replace(/[ .]/g, "") ===
                                        negative.symbol.toLocaleLowerCase().replace(/[ .]/g, "")
                                    )}
                                </p>

                                {/* URL List */}
                                <div className="space-y-1">
                                    {negative.urls.map((url, urlIndex) => (
                                        <div
                                            key={urlIndex}
                                            className="flex items-center gap-2 p-2 rounded-md bg-opacity-80 border"
                                        >
                                            <span
                                                className={`text-sm font-medium break-words ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
                                                style={{ maxWidth: "150px" }}
                                            >
                                                {url}
                                            </span>
                                            <button
                                                onClick={async () => {

                                                    setNegativeUrls((prev) => [
                                                        ...prev.filter((i) => i.symbol !== negative.symbol),
                                                        {
                                                            ...negative,
                                                            urls: negative.urls.filter((i) => !i.includes(url)),
                                                        },
                                                    ]);

                                                }}
                                                className="p-1 rounded hover:bg-red-100"
                                            >
                                                <Trash2 size={16} strokeWidth={2} className="text-red-500" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Section */}
                    <div
                        className={`p-2 rounded-md border ${isDarkMode
                            ? "bg-gray-700 border-gray-600"
                            : "bg-gray-50 border-gray-300"
                            }`}
                    >
                        {/* Select Dropdown */}
                        <div className="mb-3">
                            <select
                                id="negativeUrlSymbolSelector"
                                className={`w-full px-3 py-2 border rounded-md ${isDarkMode
                                    ? "bg-gray-800 border-gray-600 text-gray-200"
                                    : "bg-white border-gray-300"
                                    }`}
                            >
                                <option value={""}>Select a symbol</option>
                                {linkedSymbols.map((symbol) => (
                                    <option value={symbol} key={symbol}>{symbol}</option>
                                ))}
                            </select>
                        </div>

                        {/* Input and Button */}
                        <div className="flex items-center gap-1">
                            <input
                                type="text"
                                value={negativeUrlInput}
                                onChange={(e) => setNegativeUrlInput(e.target.value)}
                                placeholder="Enter a negative URL"
                                className={`flex-1 px-3 py-2 border rounded-md ${isDarkMode
                                    ? "bg-gray-800 border-gray-600 text-gray-200"
                                    : "bg-white border-gray-300"
                                    }`}
                            />

                            <button
                                onClick={() => {
                                    if (!negativeUrlInput || !document.getElementById("negativeUrlSymbolSelector").value) return;
                                    const negativeToBeUpdated = negativeUrls.find(
                                        (i) =>
                                            document
                                                .getElementById("negativeUrlSymbolSelector")
                                                .value.toLocaleLowerCase()
                                                .replace(/[ .]/g, "") === i.symbol
                                    );

                                    const negativeToBeAdded = {
                                        symId: activeSymbolId,
                                        symbol: document
                                            .getElementById("negativeUrlSymbolSelector")
                                            .value.toLocaleLowerCase()
                                            .replace(/[ .]/g, ""),
                                        urls: [negativeUrlInput.match(/^https?:\/\/[^\/\s]+/)[0]],
                                    };

                                    negativeToBeUpdated
                                        ? setNegativeUrls((prev) => [
                                            ...prev.filter((i) => i.symbol !== negativeToBeUpdated.symbol),
                                            {
                                                ...negativeToBeUpdated,
                                                urls: [...negativeToBeUpdated.urls, negativeUrlInput.match(/^https?:\/\/[^\/\s]+/)[0]],
                                            },
                                        ])
                                        : setNegativeUrls((prev) => [...prev, negativeToBeAdded]);

                                    setNegativeUrlInput("");
                                }}
                                className={`px-3 py-2 rounded-md shadow ${isDarkMode
                                    ? "bg-green-500 hover:bg-green-400 text-gray-900"
                                    : "bg-green-500 hover:bg-green-400 text-white"
                                    }`}
                            >
                                <Plus size={16} strokeWidth={3} />
                            </button>
                        </div>
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
                            })

                            await dexieStore.updateNegatives(negativeUrls)

                            navigate(`/activeNotes/${activeSymbolId}`)
                        }}
                    >
                        Save
                    </button>
                    <button onClick={async () => {
                        document.getElementById("deleteConfirmationDialogue").showModal()
                    }}
                        className="bg-red-500 hover:bg-red-400 mt-3 px-3 py-2 text-white rounded-md font-semibold">
                        Delete Chat
                    </button>
                </div>
            </div>

            <dialog id="deleteConfirmationDialogue"
                className="rounded-md p-4 mx-8">
                <p className="text-sm font-semibold">
                    You're about to delete this chat with all it's notes and symbols,
                    <br />
                    <br />
                    Are you sure you want to delete?
                </p>
                <div className="m-1 flex flex-row justify-around">
                    <button
                        onClick={() => {
                            document.getElementById("deleteConfirmationDialogue").close()
                        }}
                        className={`mt-3 px-3 py-2 text-white rounded-md font-semibold ${isDarkMode
                            ? "bg-green-500 hover:bg-green-400"
                            : "bg-green-500 hover:bg-green-400"
                            }`}>
                        Cancel
                    </button>
                    <button onClick={async () => {
                        await dexieStore.deleteSymbol(activeSymbolId)
                        document.getElementById("deleteConfirmationDialogue").close()
                        navigate('/noteList/')
                    }}
                        className="bg-red-500 hover:bg-red-400 mt-3 px-3 py-2 text-white rounded-md font-semibold">
                        Delete
                    </button>
                </div>
            </dialog>
        </div>
    );

};

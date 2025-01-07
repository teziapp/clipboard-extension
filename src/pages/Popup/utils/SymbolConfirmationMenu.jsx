import React, { useEffect, useRef, useState } from "react";
import { dexieStore } from "../../../Dexie/DexieStore";
import { Search } from "lucide-react";
import { useSnippets } from "../SnippetContext";
import { useNavigate } from "react-router-dom";

const SymbolConfirmationMenu = () => {
    const { isDarkMode, clickedSymbolPayload } = useSnippets();

    const [searchValue, setSearchValue] = useState("");
    const [symbolDisplay, setSymbolDisplay] = useState([]);
    const [newTitle, setNewTitle] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        console.log("this is..", clickedSymbolPayload.current)
        if (searchValue === "") {
            setSymbolDisplay(clickedSymbolPayload.current.nearestSymbols);
            return;
        }

        setSymbolDisplay(() =>
            clickedSymbolPayload.current.nearestSymbols.filter((symbol) =>
                symbol.title.toLowerCase().includes(searchValue.toLowerCase())
            )
        );
    }, [searchValue]);

    return (
        <>
            <div className={`w-full h-full flex flex-col ${isDarkMode ? "bg-[#111b21]" : "bg-[#f8f9fa]"}`}>
                {/* Search Box */}
                <div
                    className={`w-full py-4 px-4 shadow-md ${isDarkMode ? "bg-[#202c33]" : "bg-[#f0f2f5]"}`}
                >
                    <div
                        className={`flex items-center w-full px-4 py-2 rounded-lg ${isDarkMode ? "bg-[#2a3942]" : "bg-[#ffffff]"}`}
                    >
                        <Search
                            size={20}
                            className={`mr-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                        />
                        <input
                            type="text"
                            value={searchValue}
                            placeholder="Search Titles"
                            onChange={(e) => setSearchValue(e.target.value)}
                            className={`flex-1 bg-transparent outline-none ${isDarkMode ? "text-gray-200 placeholder-gray-400" : "text-gray-900 placeholder-gray-500"
                                }`}
                        />
                    </div>
                </div>

                {/* Main Body */}
                <div
                    id="mainBody"
                    className={`w-full h-full flex flex-col gap-3 p-3 rounded-md overflow-y-scroll ${isDarkMode ? "bg-[#0b141a]" : "bg-white"
                        }`}
                >
                    {symbolDisplay.map((i, index) => (
                        <div
                            key={index}
                            className={`flex justify-between items-center p-2 rounded-md border text-[0.9rem] ${isDarkMode
                                ? "bg-[#1f2c34] text-gray-200 border-[#2a3942]"
                                : "bg-gray-100 text-gray-800 border-gray-300"
                                }`}
                        >
                            <span className="font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                                {`${i.title}: `}
                                <i className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                    {`${i.symbols.join(", ")}`}
                                </i>
                            </span>
                            <button
                                className={`ml-2 p-2 rounded-md ${isDarkMode
                                    ? "bg-[#00a884] text-white hover:bg-[#009175]"
                                    : "bg-green-500 text-white hover:bg-green-600"
                                    }`}
                                onClick={async () => {
                                    await dexieStore.updateSymbol(i, clickedSymbolPayload.current.clickedSymbol);
                                    navigate(`/activeNotes/${JSON.stringify(i)}`);
                                }}
                            >
                                Select
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={() => {
                            document.getElementById("symbolConfimationDialogue").showModal();
                        }}
                        className={`absolute bottom-24 left-6 w-10 h-10 text-xl pb-1 font-bold rounded-lg shadow-lg ${isDarkMode
                            ? "bg-[#25d366] text-white hover:bg-[#1da759]"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                    >
                        +
                    </button>
                </div>

                {/* Dialog */}
                <dialog
                    id="symbolConfimationDialogue"
                    className={`p-4 rounded-md shadow-lg w-[90%] max-w-[400px] ${isDarkMode ? "bg-[#202c33] text-gray-200" : "bg-white text-gray-900"
                        }`}
                >
                    <span className="text-lg mb-2 block">
                        Create a new chat for{" "}
                        <strong>{clickedSymbolPayload.current.clickedSymbol}</strong>
                    </span>
                    <input
                        type="text"
                        placeholder="Enter Title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className={`w-full p-2 rounded-md border-2 focus:outline-none focus:ring-2 mb-3 ${isDarkMode
                            ? "bg-[#2a3942] text-gray-200 border-[#3c474d] focus:ring-[#8696a0]"
                            : "bg-white text-gray-900 border-gray-300 focus:ring-gray-200"
                            }`}
                    />
                    <button
                        onClick={async () => {
                            const symbolToBeAdded = {
                                title: newTitle,
                                symbols: [clickedSymbolPayload.current.clickedSymbol]
                            };
                            const idOfAddedSymbol = await dexieStore.addNewSymbol(symbolToBeAdded);
                            document.getElementById("symbolConfimationDialogue").close();
                            navigate(
                                `/activeNotes/${JSON.stringify({
                                    symId: idOfAddedSymbol,
                                    ...symbolToBeAdded
                                })}`
                            );
                        }}
                        className={`w-full p-2 rounded-md font-semibold ${isDarkMode
                            ? "bg-[#00a884] text-white hover:bg-[#009175]"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                    >
                        Add
                    </button>
                </dialog>
            </div>
        </>
    );
};

export default SymbolConfirmationMenu;

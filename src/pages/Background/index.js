import { db } from "../../Dexie/DexieStore";
import { deleteUnsynced, loadUnsynced } from "../../Dexie/utils/sheetSyncHandlers";
import nearestSymbolFinder from "./nearestSymbolFinder";

let exactMatches;
let nearestSymbols;
let clickedSymbolPayload;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.msg == 'clickedSymbol') {
        clickedSymbolPayload = message.payload
        symbolButtonClickHandler(message.payload).then((res) => {
            console.log(res)
            exactMatches = res.exactMatches
            nearestSymbols = res.nearestSymbols
            chrome.action.openPopup()
        })
    } else if (message.msg == 'requestedSymbolList') {
        db.symbols.toArray((symbols) => {
            db.negatives.toArray((negatives) => {
                sendResponse({ symbols, negatives })
            })
        })
        return true;
    } else if (message.msg == 'isOnline') {
        loadUnsynced().then(() => {
            deleteUnsynced().then()
        })

    } else if (message.msg == 'popupOpened') {
        exactMatches.length ? (exactMatches.length == 1 ? sendResponse({ msg: 'exactMatchFound', payload: { exactMatch: exactMatches[0], url: clickedSymbolPayload.url } }) : sendResponse({ msg: 'conflictOccurred', payload: { exactMatches, url: clickedSymbolPayload.url, clickedSymbol: clickedSymbolPayload.clickedSymbol } })) : sendResponse({
            msg: 'exactMatchNotFound', payload: {
                nearestSymbols,
                clickedSymbol: clickedSymbolPayload.clickedSymbol,
                url: clickedSymbolPayload.url
            }
        })
        return true
    }
})

//it will check for whether exact match of clicked symbol is found or not and accordinglu returns response object
async function symbolButtonClickHandler(payload) {

    const nearestSymbols = await nearestSymbolFinder(payload) || []

    const exactMatches = nearestSymbols.filter((symbol) => symbol.levenshteinDistance == 0)

    return { nearestSymbols, exactMatches }
}

//it will open the popup and send a message in runtime with the required payload
async function sendToPopup(msg, payload) {
    return setTimeout(() => {
        chrome.runtime.sendMessage({
            msg,
            payload
        })
    }, 300)
}

function parseCSV(csv) {
    const lines = csv.trim().split("\n");
    const headers = lines[0].split(",").map(header => header.trim());

    const data = lines.slice(1).map(line => {
        const values = line.split(",").map(value => value.trim());
        return { symbols: [values[0], values[6]], title: values[1], color: "#FFD0A3" }
    });

    return data;
}

async function loadCSV() {
    try {
        const response = await fetch("EQUITY_L.csv"); // Adjusted path
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const csvText = await response.text();
        const parsedData = parseCSV(csvText);

        await db.symbols.bulkAdd(parsedData);
        console.log("✅ Data successfully added to Dexie DB");
    } catch (error) {
        console.error("❌ Error loading CSV:", error);
    }
}

loadCSV()
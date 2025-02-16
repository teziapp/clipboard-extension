import { db } from "../../Dexie/DexieStore";
import { deleteUnsynced, loadUnsynced } from "../../Dexie/utils/sheetSyncHandlers";
import nearestSymbolFinder from "./nearestSymbolFinder";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.msg == 'clickedSymbol') {
        symbolButtonClickHandler(message.payload)
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

    }
})

//it will check for whether exact match of clicked symbol is found or not and accordinglu returns response object
async function symbolButtonClickHandler(payload) {

    const nearestSymbols = await nearestSymbolFinder(payload) || []

    const exactMatches = nearestSymbols.filter((symbol) => symbol.levenshteinDistance == 0)

    exactMatches.length ? (exactMatches.length == 1 ? await openPopup('exactMatchFound', { exactMatch: exactMatches[0], url: payload.url }) : await openPopup('conflictOccurred', { exactMatches, url: payload.url, clickedSymbol: payload.clickedSymbol })) : await openPopup('exactMatchNotFound', {
        nearestSymbols,
        clickedSymbol: payload.clickedSymbol,
        url: payload.url
    })
}

//it will open the popup and send a message in runtime with the required payload
async function openPopup(msg, payload) {
    chrome.action.openPopup()
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
import { db } from "../../Dexie/DexieStore";
import { deleteUnsynced, loadUnsynced } from "../../Dexie/utils/sheetSyncHandlers";
import nearestSymbolFinder from "./nearestSymbolFinder";

// import { seedSymbols, seedNotes, seedNegatives } from "./utils/seeder";
// seedNegatives()
// seedSymbols()
// seedNotes()

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
        loadUnsynced().then((res1) => {
            deleteUnsynced().then((res2) => {
                sendResponse(res1 && res2)
            })
        })
        return true;
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

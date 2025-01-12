import nearestSymbolFinder from "./nearestSymbolFinder";

// import { seedSymbols, seedNotes } from "./utils/seeder";
// seedSymbols()
// seedNotes()

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.msg == 'clickedSymbol') {
        symbolButtonClickHandler(message.payload).then((res) => {
            sendResponse(res)
        })
    }
})

//it will check for whether exact match of clicked symbol is found or not and accordinglu returns response object
async function symbolButtonClickHandler(payload) {
    const nearestSymbols = await nearestSymbolFinder(payload) || []

    if (nearestSymbols.length == 0) return;

    const exactMatch = nearestSymbols.find((symbol) => symbol.levenshteinDistance == 0 && symbol.urlMatch)

    exactMatch ? await openPopup('activeSymbolSelected', exactMatch) : await openPopup('nearestSymbolsList', {
        nearestSymbols,
        clickedSymbol: payload.clickedSymbol,
        url: payload.url.match(/^https?:\/\/[^\/\s]+/)[0] //The regex part will capture the base URL.. and remve the paths and params
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


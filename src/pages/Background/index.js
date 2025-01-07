import nearestSymbolFinder from "./nearestSymbolFinder";

// import { seeder } from "./utils/seeder";
// seeder()

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.msg == 'clickedSymbol') {
        symbolButtonClickHandler(message.payload).then((res) => {
            sendResponse(res)
        })
    }
})

//it will check for whether exact match of clicked symbol is found or not and accordinglu returns response object
async function symbolButtonClickHandler(clickedSymbol) {
    const nearestSymbols = await nearestSymbolFinder(clickedSymbol) || []

    if (nearestSymbols.length != 0 && nearestSymbols[0].levenshteinDistance == 0) {
        await openPopup('activeSymbolSelected', nearestSymbols[0])

    } else {
        await openPopup('nearestSymbolsList', {
            nearestSymbols,
            clickedSymbol
        })

    }
}

//it will open the popup and send a message in runtime with the required payload
async function openPopup(msg, payload) {
    switch (msg) {
        case 'activeSymbolSelected':
            chrome.action.openPopup()
            return setTimeout(() => {
                chrome.runtime.sendMessage({
                    msg: 'activeSymbolSelected',
                    payload,
                })
            }, 300)
            break;

        case "nearestSymbolsList":
            chrome.action.openPopup()
            setTimeout(() => {
                chrome.runtime.sendMessage({
                    msg: "nearestSymbolsList",
                    payload
                })
            }, 300)
            break;
    }
}

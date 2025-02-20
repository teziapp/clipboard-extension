import { db } from "../../Dexie/DexieStore";
import { deleteUnsynced, loadUnsynced } from "../../Dexie/utils/sheetSyncHandlers";
import nearestSymbolFinder from "./nearestSymbolFinder";

let exactMatches;
let nearestSymbols;
let clickedSymbolPayload;

let openPopupFor = {
    'openSymbolChat': false,
    'openQuickNotes': false,
    'authSetupCompleted': false
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.msg) {
        case 'clickedSymbol':
            chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
                clickedSymbolPayload = {
                    ...message.payload,
                    url: tabs[0].url
                }
                symbolButtonClickHandler(clickedSymbolPayload).then((res) => {
                    exactMatches = res.exactMatches
                    nearestSymbols = res.nearestSymbols

                    openPopupFor.openSymbolChat = true;
                    chrome.action.openPopup();
                })
            })
            break;

        case 'requestedSymbolList':
            chrome.storage.local.get(["blockedSites"]).then((val) => {
                if (val.blockedSites?.includes(message.url.match(/^(?:https?:\/\/)?([^?#]+)/)[1])) return;
                db.symbols.toArray((symbols) => {
                    db.negatives.toArray((negatives) => {
                        sendResponse({ symbols, negatives })
                    })
                })
            })
            return true;

        case 'isOnline':
            loadUnsynced().then((res1) => {
                if (!res1 || res1 == 'networkError') {
                    sendResponse('error')
                    return;
                }

                deleteUnsynced().then((res2) => {
                    if (!res2 || res2 == 'networkError') {
                        sendResponse('error')
                        return;
                    }

                    sendResponse('success')
                })
            })

            return true;

        case 'popupOpened':
            console.log('opened')
            switch (true) {
                case openPopupFor.openSymbolChat:
                    console.log('happened')
                    exactMatches?.length ? (exactMatches.length == 1 ? sendResponse({ msg: 'exactMatchFound', payload: { exactMatch: exactMatches[0], url: clickedSymbolPayload.url } }) : sendResponse({ msg: 'conflictOccurred', payload: { exactMatches, url: clickedSymbolPayload.url, clickedSymbol: clickedSymbolPayload.clickedSymbol } })) : sendResponse({
                        msg: 'exactMatchNotFound', payload: {
                            nearestSymbols: nearestSymbols || [],
                            clickedSymbol: clickedSymbolPayload.clickedSymbol,
                            url: clickedSymbolPayload.url
                        }
                    })

                    openPopupFor.openSymbolChat = false;
                    break;

                case openPopupFor.openQuickNotes:
                    sendResponse({
                        msg: 'openQuickNotes'
                    })

                    openPopupFor.openQuickNotes = false;
                    break;

                case openPopupFor.authSetupCompleted:

                    openPopupFor.authSetupCompleted = false;
                    break;

                default:
                    sendResponse(null)
            }

            return true

        case 'openQuickNotes':
            openPopupFor.openQuickNotes = true;
            chrome.action.openPopup()
            break;

    }
})

//it will check for whether exact match of clicked symbol is found or not and accordinglu returns response object
async function symbolButtonClickHandler(payload) {

    const nearestSymbols = await nearestSymbolFinder(payload) || []

    const exactMatches = nearestSymbols.filter((symbol) => symbol.levenshteinDistance == 0)

    return { nearestSymbols, exactMatches }
}

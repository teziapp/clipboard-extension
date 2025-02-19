import { db } from "../../Dexie/DexieStore";
import { deleteUnsynced, loadUnsynced } from "../../Dexie/utils/sheetSyncHandlers";
import nearestSymbolFinder from "./nearestSymbolFinder";

let openQuickNotes;

let exactMatches;
let nearestSymbols;
let clickedSymbolPayload;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.msg == 'clickedSymbol') {
        clickedSymbolPayload = message.payload

        chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
            clickedSymbolPayload.url = tabs[0].url
            symbolButtonClickHandler(clickedSymbolPayload).then((res) => {
                exactMatches = res.exactMatches
                nearestSymbols = res.nearestSymbols
                chrome.action.openPopup()
            })
        })

    } else if (message.msg == 'requestedSymbolList') {
        chrome.storage.local.get(["blockedSites"]).then((val) => {
            if (val.blockedSites?.includes(message.url.match(/^(?:https?:\/\/)?([^?#]+)/)[1])) return;
            db.symbols.toArray((symbols) => {
                db.negatives.toArray((negatives) => {
                    sendResponse({ symbols, negatives })
                })
            })
        })
        return true;
    } else if (message.msg == 'isOnline') {
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

    } else if (message.msg == 'popupOpened') {
        console.log(clickedSymbolPayload)
        if (!clickedSymbolPayload) {
            console.log('thissss')
            if (openQuickNotes) {
                sendResponse({
                    msg: 'openQuickNotes'
                })

            }
            return;
        }
        exactMatches?.length ? (exactMatches.length == 1 ? sendResponse({ msg: 'exactMatchFound', payload: { exactMatch: exactMatches[0], url: clickedSymbolPayload.url } }) : sendResponse({ msg: 'conflictOccurred', payload: { exactMatches, url: clickedSymbolPayload.url, clickedSymbol: clickedSymbolPayload.clickedSymbol } })) : sendResponse({
            msg: 'exactMatchNotFound', payload: {
                nearestSymbols: nearestSymbols || [],
                clickedSymbol: clickedSymbolPayload.clickedSymbol,
                url: clickedSymbolPayload.url
            }
        })
        exactMatches = null;
        nearestSymbols = null;
        clickedSymbolPayload = null;
        openQuickNotes = false
        return true

    } else if (message.msg == 'openQuickNotes') {

        openQuickNotes = true;
        chrome.action.openPopup()
    }
})

//it will check for whether exact match of clicked symbol is found or not and accordinglu returns response object
async function symbolButtonClickHandler(payload) {

    const nearestSymbols = await nearestSymbolFinder(payload) || []

    const exactMatches = nearestSymbols.filter((symbol) => symbol.levenshteinDistance == 0)

    return { nearestSymbols, exactMatches }
}

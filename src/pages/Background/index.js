import dexieStore, { db } from "../../Dexie/DexieStore";
import nearestSymbolFinder from "./nearestSymbolFinder";


console.log('This is the background page.');

// db.symbols.bulkAdd([
//     { title: 'Cynsies Tech', symbols: ["cyntech", "ctech"] },
//     { title: 'DomsInd', symbols: ["doms"] },
//     { title: 'AB real', symbols: ["adireal", "abreal"] },
//     { title: 'Shiv Textile & Chemicals', symbols: ["shivtx", "shtexchem"] },
//     { title: 'Kaka industries', symbols: ["kkind", 'kaka'] }
// ]).then(() => console.log('done'))

// db.notes.bulkPut([
//     { noteId: 1731582409387, content: "new note", symId: 2, date: 1731582409387, title: 'DomsInd' },
//     { noteId: 1731582409388, content: "a newwwww note", symId: 2, date: 17315824093, title: 'DomsInd' },
//     { noteId: 1731582409389, content: "notessss", symId: 3, date: 173158240938, title: 'AB real' },
// ])


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.msg) {
        case 'clickedSymbol':
            onClickHandler(message.payload).then((res) => {
                console.log('this time...', res)
                sendResponse(res)
            })
            break;
    }
    return true
})

//it will check for whether exact match of clicked symbol is found or not and accordinglu returns response object
async function onClickHandler(clickedSymbol) {
    const nearestSymbols = await nearestSymbolFinder(clickedSymbol) || []

    if (nearestSymbols.length == 0) {
        return {
            msg: 'symbolMatchNotFound',
            payload: nearestSymbols
        }
    }

    if (nearestSymbols[0].nearbyIndex == 0) {
        await activeSymbolSetter(nearestSymbols[0])
        return {
            msg: 'symbolMatchFound'
        };
    }

    return {
        msg: 'symbolMatchNotFound',
        payload: nearestSymbols
    }
}

async function activeSymbolSetter(symbol) {
    console.log('it now... ', symbol)
    // return chrome.storage.local.set({ 'activeSymbol': { ...symbol } }, () => {
    //     return setTimeout(() => {
    //         chrome.action.openPopup()
    //         console.log('did it')
    //     }, 200)
    // })
    chrome.action.openPopup()
    return setTimeout(() => {
        chrome.runtime.sendMessage({
            msg: 'setActiveSymbol',
            payload: symbol
        })
    }, 200)

}


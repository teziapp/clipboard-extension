import nearestSymbolFinder from "./nearestSymbolFinder";

// FOLLOWIG LINES WILL ADD SOME DUMMY DATA IN DEXIE TO GET STARTED WITH...uncomment them to use
// db.symbols.bulkAdd([
//     { symId: 1, title: 'Cynsies Tech', symbols: ["cyntech", "ctech"] },
//     { symId: 2, title: 'DomsInd', symbols: ["doms"] },
//     { symId: 3, title: 'AB real', symbols: ["adireal", "abreal"] },
//     { symId: 4, title: 'Shiv Textile & Chemicals', symbols: ["shivtx", "shtexchem"] },
//     { symId: 5, title: 'Kaka industries', symbols: ["kkind", 'kaka'] }
// ]).then(() => console.log('done'));

// db.notes.bulkPut([
//     { noteId: 1731582409387, content: "new note", symId: 2, date: 1731582409387, title: 'DomsInd' },
//     { noteId: 1731582409388, content: "a newwwww note", symId: 2, date: 17315824093, title: 'DomsInd' },
//     { noteId: 1731582409389, content: "notessss", symId: 3, date: 173158240938, title: 'AB real' },
//     { noteId: 1731582409390, content: "notessss-two", symId: 3, date: 173158240743, title: 'AB real' },
//     { noteId: 1731582409391, content: "notessss-two", symId: 1, date: 173158240746, title: 'Cynsies Tech' },
//     { noteId: 1731582409392, content: "notessss-two", symId: 4, date: 173158241749, title: 'Shiv Textile & Chemicals' }
// ])


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.msg) {
        case 'clickedSymbol':
            onClickHandler(message.payload).then((res) => {
                sendResponse(res)
            })
            break;
    }
    return true
})

//it will check for whether exact match of clicked symbol is found or not and accordinglu returns response object
async function onClickHandler(clickedSymbol) {
    const nearestSymbols = await nearestSymbolFinder(clickedSymbol) || []

    if (nearestSymbols.length != 0 && nearestSymbols[0].nearbyIndex == 0) {
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

//it will open the popup and send a message in runtime with the particular symbol that has been selected as active symbol
async function activeSymbolSetter(symbol) {
    chrome.action.openPopup()
    return setTimeout(() => {
        chrome.runtime.sendMessage({
            msg: 'activeSymbolSelected',
            payload: symbol
        })
    }, 200)
}

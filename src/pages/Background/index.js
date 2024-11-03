//Even while development.. extension need to be reloaded for changes here to come into effect
import { closest, distance } from 'fastest-levenshtein';
import { InitialUserSetup } from './modules/InitialUserSetup';

console.log('This is the background page.');

console.log('Put the background scripts here.');

console.log('new line by hamza');

chrome.runtime.onInstalled.addListener(() => {
    chrome.identity.getAuthToken({
        interactive: true
    }, (token) => {
        // chrome.storage.local.set/get both are aynchronous but is callback is passed as argument then u can't handle the resolved value through then/catch.. so either then/catch or callBack handler! 

        chrome.storage.local.get(['userCreds'], (val) => {
            chrome.storage.local.set({
                'userCreds': {
                    ...val.userCreds,
                    token: token
                }
            }, () => {
                console.log('set initially')
            })
        })




        console.log(token)
        // chrome.storage.local.set({ 'token': token }, (i) => {
        //     console.log('done: ', i)
        // })
    })
})



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.msg) {
        case 'InitialUserSetup':
            InitialUserSetup(message.payload).then((res) => {
                sendResponse("ok") // to let the sender know 
            })
    }
    return true
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == 'complete') {
        console.log(tabId, ' : changed')
    }
})

// let symbolData;

// fetch('https://script.google.com/macros/s/AKfycbxJPjCcowBQS124lLZfmw1ItprLtxNx7MiAmTgsdcp_dpTazJJVM7zEOrM_KHPSoib4/exec', {
//     method: 'GET',
//     mode: 'cors'
// }).then(res => res.json()).then((data) => {
//     console.log(data)
//     symbolData = data
// })

// chrome.runtime.onMessage.addListener((message, sender, sendRes) => {
//     if (!message.msg) return
//     onSymbolMessage(message.msg)
// })


// function onSymbolMessage(clickedSymbol) {

//     if (!symbolData) return;

//     const nearbyIndexes = symbolData.map((i) => {
//         const arrayOfSimilarSymbols = i.split(",")
//         const nearbyIndex = distance(clickedSymbol, closest(clickedSymbol, arrayOfSimilarSymbols.map((i) => {
//             [...Array(25 - i.length).keys()].forEach(() => i += '*')
//             return i
//         })))
//         return nearbyIndex
//     })


//     const nearbyIndexesObjs = []

//     nearbyIndexes.forEach((i, n) => {
//         if (i == "") return
//         nearbyIndexesObjs[n] = { [symbolData[n]]: i }
//     })


//     console.log(clickedSymbol)
//     nearbyIndexesObjs.sort((a, b) => Object.values(a)[0] - Object.values(b)[0])
//     console.log(nearbyIndexesObjs[0], nearbyIndexesObjs[1], nearbyIndexesObjs[2], nearbyIndexesObjs[3], nearbyIndexesObjs[4])


// }







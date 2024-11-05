//Even while development.. extension need to be reloaded for changes here to come into effect
import { closest, distance } from 'fastest-levenshtein';
import { InitialUserSetup } from './modules/InitialUserSetup';

console.log('This is the background page.');


//When extension is installed first it will popup a login and consent approval window
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ 'userCreds': {} })
})


//for every event message triggered from UI, this will the main handling function
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.msg) {
        case 'InitialUserSetup':
            InitialUserSetup(message.payload).then((res) => {
                if (!res) return
                sendResponse("ok") // to let the sender know that initialSetup is complete and it can load the UI home page
            })
    }
    return true
})

//Below is the code for calculating nearest matching symbol from the Symbol value obtained from contentScrip message
//CODE WAS WORKING FINE IN PREVIOUS PR-commit, BUT..Ignore everything below for now..

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







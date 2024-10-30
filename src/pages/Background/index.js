//Even while development.. extension need to be reloaded for changes here to come into effect
import { closest, distance } from 'fastest-levenshtein';

console.log('This is the background page.');

console.log('Put the background scripts here.');

console.log('new line by hamza');

//fetch('http://localhost:5000').then((res) => res.json()).then((res) => { console.log(JSON.stringify(res)) })

// chrome.runtime.onInstalled(() => {
//     chrome.runtime.onMessage.addListener((msg, sender, res) => {
//         alert(msg)
//     })
// })

let symbolData;

fetch('https://script.google.com/macros/s/AKfycbxJPjCcowBQS124lLZfmw1ItprLtxNx7MiAmTgsdcp_dpTazJJVM7zEOrM_KHPSoib4/exec', {
    method: 'GET',
    mode: 'cors'
}).then(res => res.json()).then((data) => {
    console.log(data)
    symbolData = data
})

chrome.runtime.onMessage.addListener((message, sender, sendRes) => {
    if (!message.msg) return
    func(message.msg)
})

function func(clickedSymbol) {

    if (!symbolData) return;

    const nearbyIndexes = symbolData.map((i) => {
        const arrayOfSimilarSymbols = i.split(",")
        const nearbyIndex = distance(clickedSymbol, closest(clickedSymbol, arrayOfSimilarSymbols.map((i) => {
            [...Array(25 - i.length).keys()].forEach(() => i += '*')
            return i
        })))
        return nearbyIndex
    })


    const nearbyIndexesObjs = []

    nearbyIndexes.forEach((i, n) => {
        if (i == "") return
        nearbyIndexesObjs[n] = { [symbolData[n]]: i }
    })


    console.log(clickedSymbol)
    nearbyIndexesObjs.sort((a, b) => Object.values(a)[0] - Object.values(b)[0])
    console.log(nearbyIndexesObjs[0], nearbyIndexesObjs[1], nearbyIndexesObjs[2], nearbyIndexesObjs[3], nearbyIndexesObjs[4])


}







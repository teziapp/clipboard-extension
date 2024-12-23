import { dexieStore } from "../../Dexie/DexieStore"
import { closest, distance } from 'fastest-levenshtein';

//code to find the nearest matching symbol
//the function goes on to comapare teh clcicked symbol with all the archived symbols in database and...
//..returns an array of 5 closest matching symbol object where each object contains all the previous symbol properties and adiitionally


// two new properties for each symbol - nearByIndex and bias  
export default async function nearestSymbolFinder(clickedSymbol) {

    const symbolData = await dexieStore.getSymbols() || '[]'
    console.log(symbolData)

    if (symbolData.length == 0) return

    const nearbyIndexesTable = symbolData.map((i) => {

        const arrayOfSimilarSymbols = i.symbols
        console.log(arrayOfSimilarSymbols)
        let bias

        const nearbyIndex = distance(clickedSymbol, (() => {
            const closestWord = closest(clickedSymbol, arrayOfSimilarSymbols)
            bias = Math.abs(closestWord.length - clickedSymbol.length) // ideally bias will have to be 0..
            return closestWord
        })())

        return {
            ...i,
            nearbyIndex,
            bias
        }
    })


    nearbyIndexesTable.sort((a = {}, b = {}) => a.nearbyIndex - b.nearbyIndex)

    return [nearbyIndexesTable[0], nearbyIndexesTable[1], nearbyIndexesTable[2], nearbyIndexesTable[3], nearbyIndexesTable[4]]
}
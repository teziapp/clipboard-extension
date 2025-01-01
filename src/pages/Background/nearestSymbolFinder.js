import { dexieStore } from "../../Dexie/DexieStore"
import { closest, distance } from 'fastest-levenshtein';

//code to find the nearest matching symbol
//the function goes on to comapare teh clicked symbol with all the archived symbols in database and...
//..returns an array of 5 closest matching symbol object where each object contains all the previous symbol properties and adiitionally
// two new properties for each symbol - nearByIndex and bias  
export default async function nearestSymbolFinder(clickedSymbol) {

    const symbolData = await dexieStore.getSymbols() || '[]'

    if (symbolData.length == 0) return

    const nearbyIndexesTable = symbolData.map((i) => {

        const arrayOfVariants = i.symbols
        let bias

        //in dexie, every symbol entry has a field called 'symbols',
        //this field is an array which stores all the possible name variants for that symbol
        //the following function takes an array of variants as an arguments and returns the closest variant
        const closestWord = (clickedSymbol, array) => {
            const closestWord = closest(clickedSymbol, array)
            bias = Math.abs(closestWord.length - clickedSymbol.length) // ideally bias will have to be 0..
            return closestWord
        }

        //following line will get the 'levenshtine distance' or 'nearbyIndex' for the closest variant found
        const nearbyIndex = distance(clickedSymbol, closestWord(clickedSymbol, arrayOfVariants))

        return {
            ...i,
            nearbyIndex,
            bias
        }
    })


    nearbyIndexesTable.sort((a = {}, b = {}) => a.nearbyIndex - b.nearbyIndex)

    return [nearbyIndexesTable[0], nearbyIndexesTable[1], nearbyIndexesTable[2], nearbyIndexesTable[3], nearbyIndexesTable[4]]
}
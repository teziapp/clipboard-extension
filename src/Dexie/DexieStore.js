//Dexie is not a typical database container, it's an abstraction on top of indexedDB which is already present in browsers  
import Dexie from "dexie";

export const db = new Dexie('User')

db.version(1).stores({
    symbols: "++symId, title, *symbols",
    notes: "noteId, symId, title, content, date"
})

// db.symbols.bulkAdd([
//     { title: 'Cynsies Tech', symbols: ["cyntech", "ctech"] },
//     { title: 'DomsInd', symbols: ["doms"] },
//     { title: 'AB real', symbols: ["adireal", "abreal"] },
//     { title: 'Shiv Textile & Chemicals', symbols: ["shivtx", "shtexchem"] },
//     { title: 'Kaka industries', symbols: ["kkind", 'kaka'] }
// ]).then(() => console.log('done'))

const dexieStore = {
    getItem: getFunc,
    setItem: setFunc,
    db
}

async function getFunc(itemName) {
    switch (itemName) {
        case 'notes':
            const notes = await db.notes.toArray()
            return notes
            break;

        case 'currentNotes':
            const { activeSymbol } = await chrome.storage.local.get(['activeSymbol']) || null
            const currentNotes = await db.notes.where('symId').equals(activeSymbol.symId).toArray()
            return currentNotes
            break;

        case 'symbols':
            return await db.symbols.toArray()
            break;
    }
}

async function setFunc(itemName, payload) {
    switch (itemName) {
        case 'currentNotes':
            const { activeSymbol } = payload

            const toBeDeletedNotes = await db.notes.where('symId').equals(activeSymbol.symId).toArray()

            await db.notes.bulkDelete([...toBeDeletedNotes.map((obj) => {
                return obj.noteId
            })])

            await db.notes.bulkPut([...payload.notes])
            return
            break;

        case 'updateSymbol':
            try {
                await db.symbols.put({
                    symId: payload.confirmedSymbol.symId,
                    symbols: [...payload.confirmedSymbol.symbols, val.newSymbol],
                    title: payload.confirmedSymbol.title
                })
            } catch (e) {
                console.log('error for reading the value of undefined.. reading symbols..')
            }
            break;

        case 'addNewSymbol':
            try {
                const addedSymbolId = await db.symbols.put({
                    symId: undefined,
                    symbols: [payload.symbolValue],
                    title: payload.title
                })

                return await db.symbols.get(addedSymbolId)

            } catch (e) {
                console.log('error for reading the value of undefined.. reading symbols..')
            }

            break;
    }
}

export default dexieStore
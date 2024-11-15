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
    }
}

async function setFunc(itemName, payload) {
    switch (itemName) {
        case 'currentNotes':
            const { activeSymbol } = payload

            // const transformedNotesArray = payload.notes.map((i) => {
            //     return {
            //         symId: activeSymbol.symId,
            //         noteId: i.id,
            //         content: i.content,
            //         date: i.date,
            //     }
            // })

            const toBeDeletedNotes = await db.notes.where('symId').equals(activeSymbol.symId).toArray()

            await db.notes.bulkDelete([...toBeDeletedNotes.map((obj) => {
                return obj.noteId
            })])

            await db.notes.bulkPut([...payload.notes])
            return
            break;
    }
}

export default dexieStore
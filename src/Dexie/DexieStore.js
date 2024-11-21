//Dexie is not a typical database container, it's an abstraction on top of indexedDB which is already present in browsers  
import Dexie from "dexie";

export const db = new Dexie('User')

db.version(1).stores({
    symbols: "++symId, title, *symbols",
    notes: "noteId, symId, title, content, date"
})

const dexieStore = {
    getItem: getFunc,
    setItem: setFunc,
    db
}

async function getFunc(itemName, activeSymId = null) {
    switch (itemName) {
        case 'notes':
            return await db.notes.toArray()
            break;

        case 'activeNotes':
            return await db.notes.where('symId').equals(activeSymId).toArray()
            break;

        case 'symbols':
            return await db.symbols.toArray()
            break;

        // this is for the main noteList section (that shows all chats like whatsapp..)
        case 'recentNotes':
            let recentNotesObj = {}
            //this will sort all notes in descending order of their dates
            const notesSortedByDates = await db.notes.orderBy('date').toArray((arr) => arr.reverse())
            notesSortedByDates.forEach((note) => {
                if (!recentNotesObj[note.symId]) {
                    recentNotesObj[note.symId] = note;
                }
            })

            //the following lines will sort all the symId keys in descending order of their most recently added notes
            const recentNotes = Object.keys(recentNotesObj).sort((a, b) => recentNotesObj[b].date - recentNotesObj[a].date).map((symId) => {
                return {
                    symId,
                    note: recentNotesObj[symId]
                }
            })

            return recentNotes
    }
}

async function setFunc(itemName, payload) {
    switch (itemName) {

        //whenever notes of a particular symbol are opened.. any kind of editing taking place there ie, adding..deleting.. 
        //all will be handled by the following
        //it will first delete all the existing notes of that symbol.. 
        //and then from UI's context it will load the new array of edited note objects in dexie
        case 'currentNotes':

            // payload is provided from activeNotes component.. 
            // it carries two things.. first : activeSymbol-which is opened currently..
            // and.. second : it also carries.. an updated/edited array of notes that belong to the active symbol  
            const { activeSymbol } = payload

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
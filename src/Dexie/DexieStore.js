//Dexie is not a typical database container, it's an abstraction on top of indexedDB which is already present in browsers  
import Dexie from "dexie";
import { addNoteToSheet, addOrUpdateNegativesToSheet, addOrUpdateSymbolToSheet, deleteNoteInSheet } from "./utils/sheetSyncHandlers";

export const db = new Dexie('User')

db.version(1).stores({
    symbols: "++symId, title, *symbols",
    negatives: "[symId+symbol], *urls",
    notes: "noteId, symId, content, date"
})

export const dexieStore = {
    getNotes: async () => {
        return await db.notes.toArray()
    },

    getActiveNotes: async (activeSymId) => {
        return await db.notes.where('symId').equals(activeSymId).toArray()
    },

    getSymbols: async () => {
        return await db.symbols.toArray()
    },

    getSymbol: async (symId) => {
        return await db.symbols.get({ symId: symId })
    },

    // this is for the main noteList section (that shows all chats like whatsapp..)
    getRecentNotes: async () => {
        let recentsymIdWiseNotesObj = {}
        //this will sort all notes in descending order of their dates
        const notesSortedByDates = await db.notes.orderBy('date').toArray((arr) => arr.reverse())
        notesSortedByDates.forEach((note) => {
            if (!recentsymIdWiseNotesObj[note.symId]) {
                recentsymIdWiseNotesObj[note.symId] = note;
            }
        })

        //the following lines will sort all the symId keys in descending order of their most recently added notes
        const recentNotes = Object.keys(recentsymIdWiseNotesObj).sort((a, b) => recentsymIdWiseNotesObj[b].date - recentsymIdWiseNotesObj[a].date).map((symId) => {
            return {
                symId,
                note: recentsymIdWiseNotesObj[symId]
            }
        })

        return recentNotes
    },

    getNegatives: async (arr) => {
        return await db.negatives.bulkGet(arr)
    },

    getNotesCsv: async () => {
        const formattedDate = (ms) => new Date(ms).toLocaleDateString('en-GB').replace(/\//g, '-');
        const notes = await db.notes.toArray()

        const notesArray = notes.map((note) => [note.symId, formattedDate(note.date), note.content, `${note.noteId}--:${note.date}`])

        let csv = notesArray.map((row) => {
            return row.join(",")
        }).join("\n")

        return new Blob([csv], { "type": "text/csv" })
    },

    addNote: async (newNote) => {
        const localAdded = await db.notes.add(newNote)
        const remoteAdded = await addNoteToSheet(newNote)

        return { remoteAdded, localAdded }
    },

    addNewSymbol: async (symbol) => {
        const localAdded = await db.symbols.add(symbol)
        const remoteAdded = await addOrUpdateSymbolToSheet(symbol)

        return { remoteAdded, localAdded }
    },

    updateSymbol: async (symbolData) => {
        const localUpdated = await db.symbols.put(symbolData)
        const remoteUpdated = await addOrUpdateSymbolToSheet(symbolData)

        return { remoteUpdated, localUpdated }
    },

    updateNegatives: async (negativesArr) => {
        const localUpdate = await db.negatives.bulkPut(negativesArr)
        const toBeDeleted = negativesArr.filter(negative => !negative.urls.length)
        await db.negatives.bulkDelete(toBeDeleted.map(i => [i.symId, i.symbol]))

        const remoteUpdate = await addOrUpdateNegativesToSheet(negativesArr)

        return { remoteUpdate, localUpdate }
    },

    deleteNote: async (noteId) => {
        const localDelete = await db.notes.delete(noteId)
        const remoteDelete = await deleteNoteInSheet({ noteId })

        return { remoteDelete, localDelete }
    },

    deleteSymbol: async (symId) => {
        await db.symbols.delete(symId)
        await db.notes.where("symId").equals(symId).delete()

    }
}

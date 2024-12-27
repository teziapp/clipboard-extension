//Dexie is not a typical database container, it's an abstraction on top of indexedDB which is already present in browsers  
import Dexie from "dexie";

export const db = new Dexie('User')

db.version(1).stores({
    symbols: "++symId, title, *symbols",
    notes: "noteId, symId, title, content, date"
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

    // this is for the main noteList section (that shows all chats like whatsapp..)
    getRecentNotes: async () => {
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
    },

    addNote: async (newNote) => {
        await db.notes.add(newNote)
    },

    deleteNote: async (noteId) => {
        await db.notes.delete(noteId)
    },

    updateSymbol: async (symbol, newVariant) => {
        await db.symbols.put({
            symId: symbol.symId,
            title: symbol.title,
            symbols: [...symbol.symbols, newVariant]
        })
    },

    addNewSymbol: async (symbol) => {
        return await db.symbols.add({
            ...symbol
        })
    }
}

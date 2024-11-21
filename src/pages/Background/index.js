import dexieStore, { db } from "../../Dexie/DexieStore";

console.log('This is the background page.');

// FOLLOWIG LINES WILL ADD SOME DUMMY DATA IN DEXIE TO GET STARTED WITH...

db.symbols.bulkAdd([
    { symId: 1, title: 'Cynsies Tech', symbols: ["cyntech", "ctech"] },
    { symId: 2, title: 'DomsInd', symbols: ["doms"] },
    { symId: 3, title: 'AB real', symbols: ["adireal", "abreal"] },
    { symId: 4, title: 'Shiv Textile & Chemicals', symbols: ["shivtx", "shtexchem"] },
    { symId: 5, title: 'Kaka industries', symbols: ["kkind", 'kaka'] }
]).then(() => console.log('done'))

db.notes.bulkPut([
    { noteId: 1731582409387, content: "new note", symId: 2, date: 1731582409387, title: 'DomsInd' },
    { noteId: 1731582409388, content: "a newwwww note", symId: 2, date: 17315824093, title: 'DomsInd' },
    { noteId: 1731582409389, content: "notessss", symId: 3, date: 173158240938, title: 'AB real' },
    { noteId: 1731582409390, content: "notessss-two", symId: 3, date: 173158240743, title: 'AB real' },
])



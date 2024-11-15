import dexieStore, { db } from "../../Dexie/DexieStore";

console.log('This is the background page.');





// db.symbols.bulkAdd([
//     { title: 'Cynsies Tech', symbols: ["cyntech", "ctech"] },
//     { title: 'DomsInd', symbols: ["doms"] },
//     { title: 'AB real', symbols: ["adireal", "abreal"] },
//     { title: 'Shiv Textile & Chemicals', symbols: ["shivtx", "shtexchem"] },
//     { title: 'Kaka industries', symbols: ["kkind", 'kaka'] }
// ]).then(() => console.log('done'))

db.notes.bulkPut([
    { noteId: 1731582409387, content: "new note", symId: 2, date: 1731582409387, title: 'DomsInd' },
    { noteId: 1731582409388, content: "a newwwww note", symId: 2, date: 17315824093, title: 'DomsInd' },
    { noteId: 1731582409389, content: "notessss", symId: 3, date: 173158240938, title: 'AB real' },
])
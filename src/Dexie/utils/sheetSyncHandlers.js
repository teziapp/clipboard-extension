import { db } from "../DexieStore";

const loadLocalChangeUrl = "https://script.googleapis.com/v1/scripts/AKfycbx1Ogni4KIUZRhl-RK10dJsvP2I4_cDwo7NnO6_F6heF-qn8IKuUovflcJokmMfru43:run"
const backupToSheetUrl = "https://script.googleapis.com/v1/scripts/AKfycbwbQ7ClWTIsBO6KoekN_sASTgpT5ztuKUyvogrbQNmHV3uVVYEikzAGn4GyTfJhCI-Q:run"
const populateLocalUrl = "https://script.googleapis.com/v1/scripts/AKfycbzh9rPw6yWiGYCKNLGoxWmjf9zTjCQZcCnexGndfXoTbeKhMersTozJtbP7ljRwTzc:run"

async function getCreds() {
    const sheetId = await chrome.storage.local.get(['userCreds']).then(({ userCreds }) => userCreds.sheetId)
    if (!sheetId || !navigator.onLine) return { sheetId, token: null }; // handls unRegistered user whose token can't be generated

    const token = await new Promise((res, rej) => {
        chrome.identity.getAuthToken({
            interactive: true
        }, (token) => {
            res(token)
        })
    })

    return { sheetId, token }
}

export async function addNoteToSheet(note) {

    const { token, sheetId } = await getCreds()
    if (!sheetId) return;
    if (!token) return 'networkError';

    return await fetch(loadLocalChangeUrl, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            function: "handleLocalChange",
            parameters: [{ sheetId, message: "noteAdded", payload: note }]
        })
    }).then((data) => {
        return data.json()
    }).catch((err) => {
        console.log(err)
        return;
    })
}

export async function deleteNoteInSheet(note) {

    const { token, sheetId } = await getCreds()
    if (!sheetId) return;
    if (!token) return 'networkError';

    return await fetch(loadLocalChangeUrl, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            function: "handleLocalChange",
            parameters: [{ sheetId, message: 'noteDeleted', payload: note }]
        })
    }).then((data) => {
        return data.json()
    }).catch((err) => {
        console.log('cant fetch..', err)
        return;
    })
}

export async function addOrUpdateSymbolToSheet(symbol) {
    const { token, sheetId } = await getCreds()
    if (!sheetId) return;
    if (!token) return 'networkError';

    return await fetch(loadLocalChangeUrl, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            function: "handleLocalChange",
            parameters: [{ sheetId, message: "symbolAddedOrUpdated", payload: symbol }]
        })
    }).then((data) => {
        return data.json()
    }).catch((err) => {
        console.log('cant fetch..', err)
        return;
    })
}

export async function deleteSymbolInSheet(symbol) {

    const { token, sheetId } = await getCreds()
    if (!sheetId) return;
    if (!token) return 'networkError';

    return await fetch(loadLocalChangeUrl, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            function: "handleLocalChange",
            parameters: [{ sheetId, message: "symbolDeleted", payload: symbol }]
        })
    }).then((data) => {
        return data.json()
    }).catch((err) => {
        console.log(err)
        return;
    })
}

export async function addOrUpdateNegativesToSheet(negativesArr) {

    const { token, sheetId } = await getCreds()
    if (!sheetId) return;
    if (!token) return 'networkError';

    return await fetch(loadLocalChangeUrl, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            function: "handleLocalChange",
            parameters: [{ sheetId, message: 'negativeAddedOrUpdated', payload: negativesArr }]
        })
    }).then((data) => {
        return data.json()
    }).catch((err) => {
        console.log('cant fetch..', err)
        return;
    })
}

export async function loadUnsynced() {

    const { sheetId, token } = await getCreds()
    if (!sheetId) return;
    if (!token) return 'networkError';

    //Notes..
    const unSyncedNotes = await db.notes.where("synced").notEqual('true').toArray()

    let loadNotesResult
    let loadSymbolsResult
    let loadNegativesResult

    if (unSyncedNotes.length) {
        loadNotesResult = await fetch(backupToSheetUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                function: "loadUnsynched",
                parameters: [{ sheetId, message: "addOrUpdate", table: 'Notes', payload: unSyncedNotes }]
            })
        }).then((data) => {
            return data.json()
        }).catch((err) => {
            console.log('cant fetch..', err)
            return;
        })

        loadNotesResult?.response?.result.status ? await db.notes.bulkPut(unSyncedNotes.map(note => ({ ...note, synced: 'true' }))) : null
    }

    //Symbols
    const unSyncedSymbols = await db.symbols.where("synced").notEqual('true').toArray()

    if (unSyncedSymbols.length) {
        loadSymbolsResult = await fetch(backupToSheetUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                function: "loadUnsynched",
                parameters: [{ sheetId, message: "addOrUpdate", table: 'Symbols', payload: unSyncedSymbols }]
            })
        }).then((data) => {
            return data.json()
        }).catch((err) => {
            console.log('cant fetch..', err)
            return;
        })

        loadSymbolsResult?.response?.result.status ? await db.symbols.bulkPut(unSyncedSymbols.map(symbol => ({ ...symbol, synced: 'true' }))) : null
    }


    //Negatives
    const unSyncedNegatives = await db.negatives.where("synced").notEqual('true').toArray()

    if (unSyncedNegatives.length) {
        loadNegativesResult = await fetch(backupToSheetUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                function: "loadUnsynched",
                parameters: [{ sheetId, message: "addOrUpdate", table: 'Negatives', payload: unSyncedNegatives }]
            })
        }).then((data) => {
            return data.json()
        }).catch((err) => {
            console.log('cant fetch..', err)
            return;
        })

        loadNegativesResult?.response?.result.status ? await db.negatives.bulkPut(unSyncedNegatives.map(negative => ({ ...negative, synced: 'true' }))) : null
    }

    return (loadNotesResult?.response?.result.status || true) && (loadSymbolsResult?.response?.result.status || true) && (loadNegativesResult?.response?.result.status || true)
}

export async function deleteUnsynced() {


    const { sheetId, token } = await getCreds()
    if (!sheetId) return;
    if (!token) return 'networkError';

    //Notes
    const deleteLogNotes = await db.deleteLog.where("type").equals("note").toArray()

    const notesDeleteResult = await fetch(backupToSheetUrl, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            function: "loadUnsynched",
            parameters: [{ sheetId, message: "delete", table: 'Notes', payload: deleteLogNotes.map(({ object }) => ({ noteId: object.noteId })) }]
        })
    }).then((data) => {
        return data.json()
    }).catch((err) => {
        console.log('cant fetch..', err)
        return;
    })

    notesDeleteResult?.response?.result.status ? await db.deleteLog.where("type").equals("note").delete() : console.log('error while backingUp', notesDeleteResult)

    //Symbols
    const deleteLogSymbols = await db.deleteLog.where("type").equals("symbol").toArray()

    const symbolsDeleteResult = await fetch(backupToSheetUrl, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            function: "loadUnsynched",
            parameters: [{ sheetId, message: "delete", table: 'Symbols', payload: deleteLogSymbols.map(({ object }) => ({ symId: object.symId })) }]
        })
    }).then((data) => {
        return data.json()
    }).catch((err) => {
        console.log('cant fetch..', err)
        return;
    })

    symbolsDeleteResult?.response?.result.status ? await db.deleteLog.where("type").equals("symbol").delete() : console.log('error while backingUp', symbolsDeleteResult)

    //Negatives
    const deleteLogNegatives = await db.deleteLog.where("type").equals("negative").toArray()

    const negativesDeleteResult = await fetch(backupToSheetUrl, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            function: "loadUnsynched",
            parameters: [{ sheetId, message: "delete", table: 'Negatives', payload: deleteLogNegatives.map(({ object }) => ({ symId: object.symId, symbol: object.symbol })) }]
        })
    }).then((data) => {
        return data.json()
    }).catch((err) => {
        console.log('cant fetch..', err)
        return;
    })

    negativesDeleteResult?.response?.result.status ? await db.deleteLog.where("type").equals("negative").delete() : console.log('error while backingUp', negativesDeleteResult)

    return (!deleteLogNotes || notesDeleteResult?.response?.result.status) && (!deleteLogSymbols || symbolsDeleteResult?.response?.result.status) && (!deleteLogNegatives || negativesDeleteResult?.response?.result.status)
}

export async function populateLocalFromSheet() {

    const { sheetId, token } = await getCreds()
    if (!sheetId) return;
    if (!token) return 'networkError';



    const notesArrayResult = await fetch(populateLocalUrl, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            function: "populateLocal",
            parameters: [{ sheetId, table: 'Notes' }]
        })
    }).then((data) => {
        return data.json()
    }).catch((err) => {
        console.log('cant fetch..', err)
        return;
    })


    const symbolsArrayResult = await fetch(populateLocalUrl, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            function: "populateLocal",
            parameters: [{ sheetId, table: 'Symbols' }]
        })
    }).then((data) => {
        return data.json()
    }).catch((err) => {
        console.log('cant fetch..', err)
        return;
    })


    const negativesArrayResult = await fetch(populateLocalUrl, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            function: "populateLocal",
            parameters: [{ sheetId, table: 'Negatives' }]
        })
    }).then((data) => {
        return data.json()
    }).catch((err) => {
        console.log('cant fetch..', err)
        return;
    })

    return { notesArrayResult, symbolsArrayResult, negativesArrayResult }
}
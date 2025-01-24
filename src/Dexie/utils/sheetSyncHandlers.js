const url = "https://script.googleapis.com/v1/scripts/AKfycbyN7kNa0bGGH3U4GV2boKPeRJAW_dgiwnH5CdLoP7-tcVJw3KrERdE16ZqA4z2BMwKy:run"

async function getCreds() {
    const sheetId = await chrome.storage.local.get(['userCreds']).then(({ userCreds }) => userCreds.sheetId)
    if (!sheetId) return { sheetId: null, token: null }; // handls unRegistered user whose token can't be generated

    const token = await new Promise((res, rej) => {
        chrome.identity.getAuthToken({
            interactive: true
        }, (token) => {
            token ?
                res(token) :
                null
        })
    })

    return { sheetId, token }
}

export async function addNoteToSheet(note) {

    const { token, sheetId } = await getCreds()
    if (!sheetId || !token) return;

    return await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            function: "onLocalChangeHandler",
            parameters: [{ sheetId, message: "noteAdded", payload: note }]
        })
    }).then((data) => {
        return data.json()
    }).catch((err) => {
        console.log(err)
        return;
    })
}

export async function addOrUpdateSymbolToSheet(symbol) {

    const { token, sheetId } = await getCreds()
    if (!sheetId || !token) return;

    return await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            function: "onLocalChangeHandler",
            parameters: [{ sheetId, message: "symbolAddedOrUpdated", payload: symbol }]
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
    if (!sheetId || !token) return;

    return await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            function: "onLocalChangeHandler",
            parameters: [{ sheetId, message: 'noteDeleted', payload: note }]
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
    if (!sheetId || !token) return;

    return await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            function: "onLocalChangeHandler",
            parameters: [{ sheetId, message: 'negativeAddedOrUpdated', payload: negativesArr }]
        })
    }).then((data) => {
        return data.json()
    }).catch((err) => {
        console.log(err)
        return;
    })
}


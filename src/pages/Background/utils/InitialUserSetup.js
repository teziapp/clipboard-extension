import { getToken, onLaunchWebAuthFlow } from "./auth";

async function InitialUserSetup(registerExisting = false, payload) {
    console.log('inside')
    //getAuthToken will get temporary access token which will be stored in local with the key named userCreds

    if (!navigator.onLine) return ('error')

    let result;

    await onLaunchWebAuthFlow()
    const accessToken = await getToken()

    //no need to create another sheet if registration is for an existinf sheet-id 
    if (registerExisting) {
        if (accessToken) {
            await chrome.storage.local.set({ 'userCreds': { sheetId: payload.sheetId } })
            return 'doneSetup'
        } else {
            return 'error'
        }
    }

    const res = await fetch(`https://script.googleapis.com/v1/scripts/AKfycbwN5IgU586N7Mo_i258RM95jq-oHjFzs1HZsTys_iqvlB_tMPp_t2WoUubHYt2iWC1M:run`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            function: "setupSheets",
            parameters: []
        })
    })

    const jsonRes = await res.json()

    if (jsonRes.response?.result.status) {
        await chrome.storage.local.set({   //if API call request goes fine, we will store the provided sheetId in userCreds 
            'userCreds': {
                sheetId: jsonRes.response?.result.spreadsheetId
            }
        }).then(() => {
            result = 'doneSetup'
        })
    } else {
        console.log('error in script..', jsonRes)
        result = 'error'
    }

    return result

    // EDGE-CASE : is the above promise-chain properly handling all possible potential errors

}

export { InitialUserSetup }
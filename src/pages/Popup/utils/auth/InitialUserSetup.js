import { getToken, onLaunchWebAuthFlow } from "../../../Background/utils/auth";

async function InitialUserSetup() {

    //getAuthToken will get temporary access token which will be stored in local with the key named userCreds

    if (!navigator.onLine) return ('error')

    let result;

    await onLaunchWebAuthFlow()
    const accessToken = await getToken()

    console.log(accessToken)

    const res = await fetch(`https://script.googleapis.com/v1/scripts/AKfycbw8ZFnKnYCOa5d_B2JWGmDy_tcUwGGKTPODs68zN25u90vKip39-_XX0oDZ8w6tjrbE:run`, {
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
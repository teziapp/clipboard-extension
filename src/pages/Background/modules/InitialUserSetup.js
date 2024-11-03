import { Handler401 } from "./Handler401"

async function InitialUserSetup(payload) {

    const { userCreds } = await chrome.storage.local.get(['userCreds'])  //this will resolve with the object which has the queried key ie, userCreds, not the key userCreds itself, so must be deconstructed 

    const response = await fetch(`https://script.googleapis.com/v1/scripts/AKfycbxU78foFJwhaYB7uz0PKvv2S904U0zJe87t-s3BkAWrQJPKNRGxA69i0Ge19Qb2WQnU:run`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${userCreds.token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            function: "doGet",
            parameters: [{ sheetId: `${payload}`, another: 'anything' }]
        })
    }).then(async (res) => {
        return chrome.storage.local.set({
            'userCreds': {
                ...userCreds,
                sheetId: payload
            }
        }).then((val) => {
            console.log('successfully registered!')
            return res.json()
        })

    }).catch((rej) => {
        console.log('rej from initialSetup: ', rej)
    })                         // EDGE-CASE : is it all properly handling all possible potential erros

    console.log(response)
    return response;

}

export { InitialUserSetup }


//token refresh mechanism ; for later use
// if (res.status == 401) {
//     Handler401()
//     console.log('401 errorroroo')
//     // InitialUserSetup(payload)
// } else {                                             // EDGE-CASE: consider Another potential errors throug elseif
//     res.json().then((res) => {
//         console.log(res)
//     })
// }
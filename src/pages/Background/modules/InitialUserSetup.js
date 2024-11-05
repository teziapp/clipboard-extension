import { json } from "react-router-dom"
import { Handler401 } from "./Handler401"

async function InitialUserSetup(payload) {


    //getAuthToken will get temporary access token which will be stored in local with the key named userCreds
    const authDone = await new Promise((res, rej) => {
        chrome.identity.getAuthToken({
            interactive: true
        }, (token) => {

            // chrome.storage.local.set/get both are aynchronous but if callback is passed as argument then u can't handle the resolved value through then/catch.. so either then/catch or callBack handler! 
            chrome.storage.local.get(['userCreds'], (val) => {
                chrome.storage.local.set({
                    'userCreds': {
                        ...val.userCreds,
                        token: token
                    }
                }).then(() => {
                    res(token)
                })
            })

            console.log('from initialSetup: ', token)

        })
    })

    if (!authDone) return

    //get userCredentials from local
    const { userCreds } = await chrome.storage.local.get(['userCreds'])  //this will resolve with the object which has the queried key ie, userCreds, not the key userCreds itself, so must be deconstructed 

    //use access token to make authorized API call to the appScript project 
    const response = await fetch(`https://script.googleapis.com/v1/scripts/AKfycbxU78foFJwhaYB7uz0PKvv2S904U0zJe87t-s3BkAWrQJPKNRGxA69i0Ge19Qb2WQnU:run`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${userCreds.token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            function: "doGet",
            parameters: [{ sheetId: `${payload}` }] //the sheetId obtained from UI will be used here
        })
    }).then(async (res) => {
        return res.json().then((jsonRes) => {
            console.log(jsonRes)
            if (jsonRes.error) {
                return 'error from URL'
            } else if (jsonRes.response.result.status) {
                return chrome.storage.local.set({   //if API call request goes fine, we will store the provided sheetId in userCreds 
                    'userCreds': {
                        ...userCreds,
                        sheetId: payload
                    }
                }).then(() => {
                    return 'doneSetup'
                })
            } else {
                return 'error from appScript'
            }
        })


    }).catch((rej) => {
        console.log('rej from initialSetup: ', rej)
    })
    // EDGE-CASE : is the above promise-chain properly handling all possible potential errors

    console.log(response)

    if (response == 'doneSetup') {
        return response;
    } else {
        return
    }


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
async function InitialUserSetup() {

    //getAuthToken will get temporary access token which will be stored in local with the key named userCreds
    return new Promise((resolve, reject) => {

        if (!navigator.onLine) resolve('error')
        chrome.identity.getAuthToken({
            interactive: true
        }, (token) => {

            if (!token) {
                resolve('noToken')
                return;
            }

            fetch(`https://script.googleapis.com/v1/scripts/AKfycbw8ZFnKnYCOa5d_B2JWGmDy_tcUwGGKTPODs68zN25u90vKip39-_XX0oDZ8w6tjrbE:run`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    function: "setupSheets",
                    parameters: []
                })
            }).then((res) => {

                res.json().then((jsonRes) => {

                    if (jsonRes.response?.result.status) {
                        console.log(jsonRes.response?.result.spreadsheetId)
                        chrome.storage.local.set({   //if API call request goes fine, we will store the provided sheetId in userCreds 
                            'userCreds': {
                                sheetId: jsonRes.response?.result.spreadsheetId
                            }
                        }).then(() => {
                            resolve('doneSetup')
                        })
                    } else {
                        console.log('error in script..', jsonRes)
                        resolve('error')
                    }
                })

            }).catch((err) => {
                console.log("error from fetch..", err)
                resolve('error')
            })

        })

    })
    // EDGE-CASE : is the above promise-chain properly handling all possible potential errors

}

export { InitialUserSetup }
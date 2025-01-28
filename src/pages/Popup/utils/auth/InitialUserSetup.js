async function InitialUserSetup(payload) {

    //getAuthToken will get temporary access token which will be stored in local with the key named userCreds
    const authDone = await new Promise((resolve, reject) => {

        chrome.identity.getAuthToken({
            interactive: true
        }, (token) => {

            if (!token) {
                resolve('noToken')
                return;
            }

            fetch(`https://script.googleapis.com/v1/scripts/AKfycbyM04ZW1u23cRDwzF6LIYctbLf8bLjKcebjelRIQbj_gmcKhReQhx5P2Pp4xL6IJLf1:run`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    function: "setupSheets",
                    parameters: [{ sheetId: payload }] //the sheetId obtained from UI will be used here
                })
            }).then((res) => {

                res.json().then((jsonRes) => {

                    if (jsonRes.response?.result.status) {
                        chrome.storage.local.set({   //if API call request goes fine, we will store the provided sheetId in userCreds 
                            'userCreds': {
                                sheetId: payload
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

    return authDone
}

export { InitialUserSetup }
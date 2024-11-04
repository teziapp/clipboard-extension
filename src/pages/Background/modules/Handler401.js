//This function is to handle expiration of the temporory access token which was obtained through chrome.identity.getAuthToken 
//the token is only valid for around 45 minutes or so
//so after expiration, if any API fetch request is made to appScript, it will return a response object with status 401,
//for all API fetch requests we could handle this unAuthenticated request error by calling this Handler401 function 
//it will simply regenerate the token value which will be updated in userCreds in local
//but this time with No consent or login requirement.
//and we can call the API fetch function again with the updated token value from userCreds stored in local 

function Handler401() {
    chrome.identity.getAuthToken({
        interactive: false
    }, (token) => {
        console.log('new token: ', token)
        chrome.storage.local.get(['userCreds'], (val) => {          // chrome.storage.local.set/get both are aynchronous but is callback is passed as argument then u can't handle the resolved value through then/catch.. so either then/catch or callBack handler! 
            let userCreds = {
                ...val.userCreds || null,
                'token': token
            }

            chrome.storage.local.set({ 'userCreds': { ...userCreds } }, () => {
                console.log('set from handler401')
            })
        })
    })
}

export { Handler401 }
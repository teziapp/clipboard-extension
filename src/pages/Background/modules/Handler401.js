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

            chrome.storage.local.set({ 'userCreds': userCreds }, () => {
                console.log('set from handler401')
            })
        })

        // localStorage.setItem('userCreds', {
        //     ...localStorage.getItem('userCreds'),
        //     token: token
        // })
    })
}

export { Handler401 }
function login() {
    fetch('https://accounts.google.com/o/oauth2/v2/auth', {
        "method": 'GET',
        "client_id": '650198074640-t2ebl9o4206gsk7jggbvoqr7mp530ab2.apps.googleusercontent.com',
        "redirect_url": '',
        "response_type": '',
        "scope": "https://www.googleapis.com/auth/spreadsheets",
        "include_granted_scopes": "true"
    })
}
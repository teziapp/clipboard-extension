export const onLaunchWebAuthFlow = async () => {
    try {
        const authUrl = new URL("https://accounts.google.com/o/oauth2/auth")
        const clientId = "650198074640-ndskhk7q7u831es5bvjg4sc1s2e0rgn7.apps.googleusercontent.com"

        // Note: this needs to match the one used on the server (below)
        // note the lack of a trailing slash
        const redirectUri = `https://gljlocpedgbjadcefehhcpflemmlcmpb.chromiumapp.org`

        const state = Math.random().toString(36).substring(7)

        const scopes = "https://www.googleapis.com/auth/spreadsheets.currentonly https://www.googleapis.com/auth/drive.file"

        authUrl.searchParams.set("state", state)
        authUrl.searchParams.set("client_id", clientId)
        authUrl.searchParams.set("redirect_uri", redirectUri)

        authUrl.searchParams.set("scope", scopes)
        authUrl.searchParams.set("response_type", "code")
        authUrl.searchParams.set("access_type", "offline")
        authUrl.searchParams.set("include_granted_scopes", "true")
        authUrl.searchParams.set("prompt", "consent")

        return new Promise((resolve, reject) => {
            chrome.identity.launchWebAuthFlow(
                {
                    url: authUrl.href,
                    interactive: true,
                },
                async (redirectUrl) => {
                    if (chrome.runtime.lastError || !redirectUrl) {
                        return new Error(
                            `WebAuthFlow failed: ${chrome.runtime.lastError.message}`,
                        )
                    }

                    const params = new URLSearchParams(redirectUrl.split("?")[1])
                    const code = params.get("code")

                    if (!code) {
                        return new Error("No code found")
                    }
                    let response;

                    try {
                        response = await fetch(
                            `https://tezi-extension.hamzaravani4.workers.dev/api/auth/token`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    code,
                                }),
                            }
                        );

                        const { accessToken, expiresAt, refreshToken } = await response.json();

                        if (accessToken) {
                            // save the tokens and expiration time to Chrome Storage
                            await chrome.storage.local.set({
                                accessToken,
                                refreshToken,
                                expiresAt,
                            });
                            resolve()
                        }
                    }
                    catch (error) {
                        console.log('error while launching authFlow', error)
                        throw new Error(`OAuth Sign-in failed: ${error.message}`)
                    }
                },
            )
        })
    } catch (error) {
        throw new Error(`Sign-in failed: ${error.message}`)
    }
}

export async function getToken() {
    return await new Promise((resolve, reject) => {

        chrome.storage.local.get(["accessToken", "refreshToken", "expiresAt"], async (items) => {
            const { accessToken, refreshToken, expiresAt } = items;

            if (accessToken) {
                const nowInSeconds = Math.floor(Date.now() / 1000);
                const nowPlus60 = nowInSeconds + 60;

                // expired or will expire in the next 60 seconds
                console.log(nowPlus60, expiresAt)
                if (expiresAt <= nowPlus60) {
                    const response = await fetch(`https://tezi-extension.hamzaravani4.workers.dev/api/auth/refresh`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            refresh_token: refreshToken,
                        }),
                    });
                    if (response.ok) {
                        const { accessToken, expiresAt } = await response.json();
                        chrome.storage.local.set({ accessToken, expiresAt });

                        console.log("Access token refreshed");
                        resolve(accessToken);

                    } else {
                        const data = await response.json();
                        console.error("request failed: ", data);
                    }
                } else {
                    console.log("Access token is still valid");
                    resolve(accessToken);
                }

            }
        })
    });

}
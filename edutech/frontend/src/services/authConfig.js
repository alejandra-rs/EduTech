export const loginConfig = {
    auth: {
        clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
        authority: "https://login.microsoftonline.com/common",
        redirectUri: "http://localhost:5173",
        postLogoutRedirectUri: "/",
        navigateToLoginRequestUrl: false,
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
};

export const loginRequest = {
    scopes: ["User.Read"],
};

import decode from "jwt-decode";

// creating a new JavaScript class called AuthService that we instantiate a new version of for every component that imports it
class AuthService {
    // retrieve data saved in token
    getProfile() {
        return decode(this.getToken());
    }

    // check if user is still logged in
    loggedIn() {
        // checks if there's a saved token and if it's still valid
        const token = this.getToken();
        // uses type coersion to check if the token is NOT undefined and the token is NOT expired
        return !!token && !this.isTokenExpired(token);
    }

    // check is token has expired
    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    // retrieve token from localStorage
    getToken() {
        // retrieves the user token from localStorage
        return localStorage.getItem("id_token");
    }

    // set token to localStorage and reload page to homepage
    login(idToken) {
        // saves user token to localStorage
        localStorage.setItem("id_token", idToken);

        window.location.assign("/");
    }

    // clear token from localStorage and force logout with reload
    logout() {
        // clear user token and profile data from localStorage
        localStorage.removeItem("id_token");

        // this will reload the page and reset state of app
        window.location.assign("/");
    }
}


export default new AuthService();

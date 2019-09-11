import Connection from "../Connection";
import GoogleUser from "./GoogleUser";
import OauthData from "../OauthData";
import { request } from "../../utils/Utils";

class GoogleAuth extends Connection<GoogleUser> {
	
	constructor (data: OauthData) {
		super(data);
		this.authorization_url = 'https://accounts.google.com/o/oauth2/auth';
		this.token_url = 'https://accounts.google.com/o/oauth2/token';
		this.revoke_url = 'https://accounts.google.com/o/oauth2/revoke';
		this.user_url = 'https://www.googleapis.com/plus/v1/people/me';
	}

	async login(): Promise<GoogleUser> {
		return this.openPopout();
	}
	
	async getUser(): Promise<GoogleUser> {
		return new Promise((resolve, reject) => {
			if (!this.accessToken) {
				reject("You must login first");
                return;
			}
			if ( !(this.oauth_data.scopes.includes('profile')) ) {
				reject(`You must have the scope 'profile' to use 'getUser'`);
				return;
			}
			request('GET', `${this.user_url}`, this.default_header)
				.then(user => {
					const u = new GoogleUser(JSON.parse(user));
					u.oauth = this;
					resolve(u);
				})
				.catch(error => reject(error));
		});
	}    

}

export default GoogleAuth;
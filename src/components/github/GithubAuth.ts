import Connection from "../Connection";
import GithubUser from "./GithubUser";
import OauthData from "../OauthData";
import { request } from "../../utils/Utils";

class GithubAuth extends Connection<GithubUser> {
	
	constructor (data: OauthData) {
		super({
			client_id: "Iv1.89655f6cc09d9835",
			client_secret: "7d2f500284dc57b5ba9d161916eb04f97a137ee4",
			redirect_url: "http://localhost:62721/",
			scopes: []
		});
		this.authorization_url = 'https://github.com/login/oauth/authorize';
		this.token_url = 'https://github.com/login/oauth/access_token';
		this.user_url = 'https://api.github.com/user';
		this.oauth_data.scopes = [];
	}

	async login(): Promise<GithubUser> {
		return this.openPopout();
	}
	
	async getUser(): Promise<GithubUser> {
		return new Promise((resolve, reject) => {
			if (!this.accessToken) {
				reject("You must login first");
                return;
			}
			if ( !(this.oauth_data.scopes.includes('account')) ) {
				reject(`You must have the scope 'account' to use 'getUser'`);
				return;
			}
			request('GET', `${this.user_url}/user`, this.default_header)
				.then(user => {
					const u = new GithubUser(JSON.parse(user));
					u.oauth = this;
					resolve(u);
				})
				.catch(error => reject(error));
		});
	}    

}

export default GithubAuth;
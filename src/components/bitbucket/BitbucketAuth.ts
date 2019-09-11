import Connection from "../Connection";
import BitbucketUser from "./BitbucketUser";
import OauthData from "../OauthData";
import { request } from "../../utils/Utils";

// Documentation available here: https://confluence.atlassian.com/bitbucket/oauth-on-bitbucket-cloud-238027431.html
// See more here: https://developer.atlassian.com/bitbucket/api/2/reference/resource/

class BitbucketAuth extends Connection<BitbucketUser> {
	
	constructor (data: OauthData) {
		super(data);
		this.authorization_url = 'https://bitbucket.org/site/oauth2/authorize';
		this.token_url = 'https://bitbucket.org/site/oauth2/access_token';
		this.user_url = 'https://api.bitbucket.org/2.0';
	}

	async login(): Promise<BitbucketUser> {
		return this.openPopout();
	}
	
	async getUser(): Promise<BitbucketUser> {
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
					const u = new BitbucketUser(JSON.parse(user));
					u.oauth = this;
					resolve(u);
				})
				.catch(error => reject(error));
		});
	}    

}

export default BitbucketAuth;
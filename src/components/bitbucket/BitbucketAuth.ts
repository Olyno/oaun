import OAuth2 from '../../auth/OAuth2';
import { request } from '../../Util';
import BitbucketUser from './BitbucketUser';
import AccessToken from '../../auth/AccessToken';

// Documentation available here: https://confluence.atlassian.com/bitbucket/oauth-on-bitbucket-cloud-238027431.html
// See more here: https://developer.atlassian.com/bitbucket/api/2/reference/resource/

class BitbucketAuth extends OAuth2 {

	constructor (element: string, config?: any) {
		super(element);
		this.authorization_url = 'https://bitbucket.org/site/oauth2/authorize';
		this.token_url = 'https://bitbucket.org/site/oauth2/access_token';
		this.informations_link = 'https://api.bitbucket.org/2.0';
		this.scopes = [];
		if (config) {
			for (let key of Object.keys(config)) {
				this[key] = config[key];
			}
		}
	}

	async useCode(w: Window): Promise<BitbucketUser> {
		return new Promise((resolve, reject) => {
			const code = w.location.search.replace('?code=', '');
			request('POST', <string> this.token_url, {
				code,
				client_id: this.client_id,
				client_secret: this.client_secret,
				grant_type: 'authorization_code',
				redirect_uri: this.redirect_uri,
				scope: this.scopes.join(' ')
			})
			.then(response => {
				response = JSON.parse(response);
				this.auth = new AccessToken(response);
				this.default_header = {
					headers: {
						Authorization: `${this.auth.token_type} ${this.auth.access_token}`,
					}
				}
				this.getUser()
					.then(user => resolve(user))
					.catch(error => reject(error))
			})
			.catch(error => reject(error))
		})
	}

	async getUser(): Promise<BitbucketUser> {
		return new Promise((resolve, reject) => {
			if (!this.auth) {
				reject("You must login first");
                return;
			}
			if ( !(this.scopes.includes('account')) ) {
				reject(`You must have the scope 'account' to use 'getUser'`);
				return;
			}
			request('GET', `${this.informations_link}/user`, this.default_header)
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
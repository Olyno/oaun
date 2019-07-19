import OAuth2 from '../../auth/OAuth2';
import { request } from '../../Util';
import GithubUser from './GithubUser';
import AccessToken from '../../auth/AccessToken';

// Documentation available here: https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/

class GithubAuth extends OAuth2 {

	constructor (element: string, config?: any) {
		super(element);
		this.authorization_url = 'https://github.com/login/oauth/authorize';
		this.token_url = 'https://github.com/login/oauth/access_token';
		this.informations_link = 'https://api.github.com/user';
		this.scopes = [];
		if (config) {
			for (let key of Object.keys(config)) {
				this[key] = config[key];
			}
		}
	}

	async useCode(w: Window): Promise<GithubUser> {
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

	async getUser(): Promise<GithubUser> {
		return new Promise((resolve, reject) => {
			if (!this.auth) {
				reject("You must login first");
                return;
			}
			request('GET', <string> this.informations_link, this.default_header)
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
import OAuth2 from '../../auth/OAuth2';
import { request } from '../../Util';
import DiscordUser from './DiscordUser';
import AccessToken from '../../auth/AccessToken';

// Documentation available here: https://discordapp.com/developers/docs/topics/oauth2

class DiscordAuth extends OAuth2 {

	constructor (element: string, config?: any) {
		super(element);
		this.authorization_url = 'https://discordapp.com/api/oauth2/authorize';
		this.token_url = 'https://discordapp.com/api/oauth2/token';
		this.revocation_url = 'https://discordapp.com/api/oauth2/token/revoke';
		this.informations_link = 'https://discordapp.com/api/v6/users/@me';
		this.scopes = ['identify'];
		if (config) {
			for (let key of Object.keys(config)) {
				this[key] = config[key];
			}
		}
	}

	async useCode(w: Window): Promise<DiscordUser> {
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

	async getUser(): Promise<DiscordUser> {
		return new Promise((resolve, reject) => {
			if (!this.auth) {
				reject('You must be logged in first!');
				return;
			}
			if ( !(this.scopes.includes('identify') || this.scopes.includes('email')) ) {
				reject(`You must have the scope 'identify' or 'email' to use 'getUser'`);
				return;
			}
			request('GET', <string> this.informations_link, this.default_header)
				.then(user => {
					const u = new DiscordUser(JSON.parse(user));
					u.oauth = this;
					resolve(u);
				})
				.catch(error => reject(error));
		});
	}

}

export default DiscordAuth;
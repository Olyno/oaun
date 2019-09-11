import Connection from "../Connection";
import DiscordUser from "./DiscordUser";
import { request } from "../../utils/Utils";
import OauthData from "../OauthData";

// Documentation available here: https://discordapp.com/developers/docs/topics/oauth2

class DiscordAuth extends Connection<DiscordUser> {

	constructor (data: OauthData) {
		super(data);
		this.authorization_url = 'https://discordapp.com/api/oauth2/authorize';
		this.token_url = 'https://discordapp.com/api/oauth2/token';
		this.revoke_url = 'https://discordapp.com/api/oauth2/token/revoke';
		this.user_url = 'https://discordapp.com/api/v6/users/@me';
		this.oauth_data.scopes = ['identify'];
	}

	async login(): Promise<DiscordUser> {
		return this.openPopout();
	}

	async getUser(): Promise<DiscordUser> {
		return new Promise((resolve, reject) => {
			if (!this.accessToken) {
				reject('You must be logged in first!');
				return;
			}
			if ( !(this.oauth_data.scopes.includes('identify') || this.oauth_data.scopes.includes('email')) ) {
				reject(`You must have the scope 'identify' or 'email' to use 'getUser'`);
				return;
			}
			request('GET', `${this.user_url}`, this.default_header)
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
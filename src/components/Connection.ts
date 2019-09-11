import User from "./User";
import AccessToken from "./AccessToken";
import { request, parseHash } from "../utils/Utils";
import OauthData from "./OauthData";

type Header = {};

abstract class Connection<T extends User> {

	// Parameters
	public oauth_data: OauthData;

	public accessToken: AccessToken | undefined;
	public default_header: Header;

	// Urls
	public authorization_url: string | undefined;
	public token_url: string | undefined;
	public revoke_url: string | undefined;
	public user_url: string | undefined;

	constructor (data: OauthData) {
		this.accessToken = undefined;
		this.oauth_data = data;
		this.default_header = {};
	}

	abstract async login(): Promise<T>;
	abstract async getUser(): Promise<T>;

	async openPopout(): Promise<T> {
		return new Promise((resolve, reject) => {
			const url = `${this.authorization_url}?response_type=code
				&client_id=${this.oauth_data.client_id}
				&scope=${this.oauth_data.scopes.join('%20')}
				&redirect_uri=${this.oauth_data.redirect_url}`;
			const popout = <Window> window.open(url, "OAuth2-Login", "width=400,height=600");
			popout.focus();
			let waiter = setInterval(() => {

			//	console.log(popout.location.href)
				try {
					if (popout.location.href.includes('?code=')) {
						clearInterval(waiter);
						popout.close();
						const code = parseHash(popout.location.search.replace(/\?/gmui, '')).code;
						request('POST', <string> this.token_url, {
							code,
							client_id: this.oauth_data.client_id,
							client_secret: this.oauth_data.client_secret,
							grant_type: 'authorization_code',
							redirect_uri: this.oauth_data.redirect_url,
							scope: this.oauth_data.scopes.join(' ')
						})
						.then(response => {
							response = JSON.parse(response);
							this.accessToken = <AccessToken> response;
							this.default_header = {
								headers: {
									Authorization: `${this.accessToken.token_type} ${this.accessToken.access_token}`,
								}
							}
							this.getUser()
								.then(user => resolve(user))
								.catch(error => reject(error))
						})
						.catch(error => reject(error))
						clearInterval(waiter);
						return;
					}
				} catch (ignore) {}

				if (popout.location.origin === window.location.origin) {
					popout.close();
					clearInterval(waiter);
					reject("Internal error");
					return;
				}

				if (popout.closed) {
					clearInterval(waiter);
					reject("Access Denied: User closed the popout");
					return;
				}
			
			}, 500);
		})
	}

	async openLink(): Promise<T> {
		return new Promise((resolve, reject) => {
			const url = `${this.authorization_url}?response_type=code
				&client_id=${this.oauth_data.client_id}
				&scope=${this.oauth_data.scopes.join('%20')}
				&redirect_uri=${this.oauth_data.redirect_url}`;
			window.location.href = url;
			//	window.location.replace(url);
			let waiter = setInterval(() => {
				if (window.location.href.includes('?code=')) {
					const code = parseHash(window.location.search.replace(/\?/gmui, '')).code;
					request('POST', <string> this.token_url, {
						code,
						client_id: this.oauth_data.client_id,
						client_secret: this.oauth_data.client_secret,
						grant_type: 'authorization_code',
						redirect_uri: this.oauth_data.redirect_url,
						scope: this.oauth_data.scopes.join(' ')
					})
					.then(response => {
						response = JSON.parse(response);
						this.accessToken = <AccessToken> response;
						this.default_header = {
							headers: {
								Authorization: `${this.accessToken.token_type} ${this.accessToken.access_token}`,
							}
						}
						this.getUser()
							.then(user => resolve(user))
							.catch(error => reject(error))
					})
					.catch(error => reject(error))
					clearInterval(waiter);
					return;
				}
			})
		})
	}

}

export default Connection;
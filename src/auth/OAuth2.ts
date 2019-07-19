import AccessToken from './AccessToken';
import User from '../components/User';

abstract class OAuth2 {

	element: HTMLElement;
	client_id: string | undefined;
	client_secret: string | undefined;
	
	authorization_url: string | undefined;
	token_url: string | undefined;
	revocation_url: string | undefined;
	informations_link: string | undefined;
	redirect_uri: string;
	scopes: string[] = [];
	default_header: any;
	auth: AccessToken;
	user: User | undefined;

	constructor (element: string) {
		this.element = <HTMLElement> (document.getElementById(element) ? document.getElementById(element) : document.getElementsByClassName(element)[0]);
		this.auth = new AccessToken();
		this.redirect_uri = window.location.href;
	}

	abstract async useCode(w: Window): Promise<User>;
	abstract async getUser(): Promise<User>;

	async login(): Promise<void> {
		return new Promise<any>((resolve, reject) => {
			const url = `${this.authorization_url}?response_type=code
				&client_id=${this.client_id}
				&client_secret=${this.client_secret}
				&scope=${this.scopes.join('%20')}
				&redirect_uri=${this.redirect_uri}`;
			const popout = <Window> window.open(url, "OAuth2-Login", "width=400,height=600");
			popout.focus();
			let waiter = setInterval(() => {

				console.log(popout.location.href)
				try {
					if (popout.location.href.includes('?code=')) {
						clearInterval(waiter);
						popout.close();
						this.useCode(popout)
							.then(user => {
								this.user = user;
								resolve(user);
							})
							.catch(error => reject(error))
						return;
					}
				} catch (ignore) {}

				if (popout.closed) {
					clearInterval(waiter);
					reject("Access Denied: User closed the popout");
					return;
				}
			
			}, 500);
		})
	}

}

export default OAuth2;
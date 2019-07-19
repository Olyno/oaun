import User from '../User';
import BitbucketAuth from './BitbucketAuth';
import BitbucketRepository from './BitbucketRepository';
import { request } from '../../Util';

class BitbucketUser extends User {

	public oauth: BitbucketAuth | undefined;

	public uuid: string;
	public display_name: string;
	public html: string;
	public status: string;
	public createdAt: Date;
	public mfa_enabled: boolean;
	public isStaff: boolean;

	constructor (user: any) {
		super();
		this.name = user.nickname;
		this.id = user.account_id;
		this.uuid = user.uuid;
		this.html = user.links.html.href;
		this.avatar = user.links.avatar.href;
		this.display_name = user.display_name;
		this.status = user.account_status;
		this.createdAt = new Date(user.created_on);
		this.mfa_enabled = user['has_2fa_enabled'];
		this.isStaff = user.is_staff;
	}

	async getFollowers(user?: string | BitbucketUser): Promise<BitbucketUser[]> {
		return new Promise((resolve, reject) => {
			if (this.oauth !== undefined) {
				if (user) {
					if (user instanceof BitbucketUser) {
						user = user.name;
					}
				} else {
					user = <string> this.name;
				}
				request('GET', `${this.oauth.informations_link}/${user}/followers`, this.oauth.default_header)
					.then(response => {
						response = JSON.parse(response);
						const users: BitbucketUser[] = [];
						for (let u of response) {
							users.push(new BitbucketUser(u))
						}
						resolve(users);
					})
					.catch(error => reject(error));
			} else {
				reject('You must be logged in first!');
				return null;
			}
		})
	}

	async getWatchers(repository: string | BitbucketRepository): Promise<BitbucketUser[]> {
		return new Promise<BitbucketUser[]>((resolve, reject) => {
			if (this.oauth !== undefined) {
				if (repository) {
					if (repository instanceof BitbucketRepository) {
						repository = <string> repository.name;
					}
				} else {
					repository = <string> this.name;
				}
				request('GET', `${this.oauth.informations_link}/${this.name}/${repository}`, this.oauth.default_header)
					.then(response => {
						response = JSON.parse(response);
						const watchers: BitbucketUser[] = [];
						for (let user of response.watchers) {
							watchers.push(new BitbucketUser(user))
						}
						resolve(watchers);
					})
					.catch(error => reject(error));
			} else {
				reject('You must be logged in first!');
				return null;
			}
		})
	}

	async getRepositories(user?: string | BitbucketUser): Promise<BitbucketRepository[]> {
		return new Promise<BitbucketRepository[]>((resolve, reject) => {
			if (this.oauth !== undefined) {
				if (user) {
					if (user instanceof BitbucketUser) {
						user = user.name;
					}
				} else {
					user = <string> this.name;
				}
				if ( !(this.oauth.scopes.includes('repository')) ) {
					reject(`You must have the scope 'repository' to use 'getRepositories'`);
					return null;
				}
				request('GET', `${this.oauth.informations_link}/${user}`, this.oauth.default_header)
					.then(response => {
						response = JSON.parse(response);
						const repositories: BitbucketRepository[] = [];
						for (let repository of response) {
							repositories.push(new BitbucketRepository(repository))
						}
						resolve(repositories);
					})
					.catch(error => reject(error));
			} else {
				reject('You must be logged in first!');
				return null;
			}
		})
	}

	async getRepository(user: string | BitbucketUser = <string> this.name, name: string): Promise<BitbucketRepository> {
		return new Promise<BitbucketRepository>((resolve, reject) => {
			if (this.oauth !== undefined) {
				if (user instanceof BitbucketUser) user = <string> user.name;
				if (!(this.oauth.scopes.includes('repository') )) {
					reject(`You must have the scope 'repository' to use 'getRepository'`);
					return null;
				}
				request('GET', `${this.oauth.informations_link}/${user}/${name}`, this.oauth.default_header)
					.then(response => {
						response = JSON.parse(response);
						resolve(new BitbucketRepository(response));
					})
					.catch(error => reject(error));
			} else {
				reject('You must be logged in first!');
				return null;
			}
		})
	}

	async createRepository(repository_name: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			if (!this.oauth) {
				reject("You must login first");
                return;
			}
			if ( !(this.oauth.scopes.includes('repository:admin')) ) {
				reject(`You must have the scope 'repository:admin' to use 'createRepository'`);
				return;
			}
			request('POST', `${this.oauth.informations_link}/repositories/${this.name}/${repository_name}`, this.oauth.default_header)
				.then(() => resolve())
				.catch(error => reject(error));
		});
	}



}

export default BitbucketUser;
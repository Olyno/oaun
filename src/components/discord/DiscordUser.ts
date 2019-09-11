import User from "../User";
import { request } from "../../utils/Utils";
import DiscordConnection from "./DiscordConnection";
import DiscordGuild from "./DiscordGuild";
import DiscordAuth from "./DiscordAuth";

class DiscordUser extends User {

	public oauth: DiscordAuth | undefined;

	public discriminator: string;
	public mention: string;
	public tag: string;
	public mfa_enabled: string;

	constructor (user: any) {
		super();
		this.name = user.username;
		this.id = user.id;
		this.email = user.email;
		this.avatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
		this.discriminator = user.discriminator;
		this.mention = `<@${user.id}>`;
		this.tag = `${user.username}#${user.discriminator}`;
		this.mfa_enabled = user.mfa_enabled;
	}

	async getConnections(): Promise<DiscordConnection[]> {
		return new Promise((resolve, reject) => {
			if (this.oauth !== undefined) {
				if (!(this.oauth.oauth_data.scopes.includes('connections') )) {
					reject(`You must have the scope 'connections' to use 'getConnections'`);
					return null;
				}
				request('GET', `${this.oauth.user_url}/connections`, this.oauth.default_header)
					.then(response => {
						response = JSON.parse(response);
						const connections: DiscordConnection[] = [];
						for (let connection of response) {
							connections.push(new DiscordConnection(connection))
						}
						resolve(connections);
					})
					.catch(error => reject(error));
			} else {
				reject('You must be logged in first!');
				return null;
			}
		})
	}
	
	async getGuilds(): Promise<DiscordGuild[]> {
		return new Promise((resolve, reject) => {
			if (this.oauth !== undefined) {
				if (!(this.oauth.oauth_data.scopes.includes('guilds') )) {
					reject(`You must have the scope 'guilds' to use 'getGuilds'`);
				}
				request('GET', `${this.oauth.user_url}/guilds`, this.oauth.default_header)
					.then(response => {
						response = JSON.parse(response);
						const guilds: DiscordGuild[] = [];
						for (let guild of response) {
							guilds.push(new DiscordGuild(guild))
						}
						resolve(guilds);
					})
					.catch(error => reject(error));
			} else {
				reject('You must be logged in first!');
			}
		})
	}
	
	async joinGuild(inviteID: string) {
		return new Promise((resolve, reject) => {
			if (this.oauth !== undefined) {
				if (!(this.oauth.oauth_data.scopes.includes('guilds.join') )) {
					reject(`You must have the scope 'guilds.join' to use 'joinGuild'`);
				}
				request('POST', `https://discordapp.com/api/v6/invites/${inviteID}`, this.oauth.default_header)
					.then(connections => resolve(connections))
					.catch(error => reject(error));
			} else {
				reject('You must be logged in first!');
			}
		})
	}

	isOwner(guild: DiscordGuild) {
		return guild.isOwner;
	}

}

export default DiscordUser;
class DiscordConnection {

	public name: string;
	public id: string;
	public friend_sync: boolean;
	public visibility: number;
	public verified: boolean;
	public type: string;

	constructor (connection: any) {
		this.name = connection.name;
		this.id = connection.id;
		this.friend_sync = connection.friend_sync;
		this.visibility = connection.visibility;
		this.verified = connection.verified;
		this.type = connection.type;
	}

}

export default DiscordConnection;
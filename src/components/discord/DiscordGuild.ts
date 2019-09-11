class DiscordGuild {

	public name: string;
	public id: string;
	public icon: string;
	public permissions: string;
	public isOwner: boolean;

	constructor (guild: any) {
		this.name = guild.name;
		this.id = guild.id;
		this.icon = `https://cdn.discordapp.com/avatars/${guild.id}/${guild.icon}.png`;
		this.permissions = guild.permissions;
		this.isOwner = guild.owner;
	}

}

export default DiscordGuild;
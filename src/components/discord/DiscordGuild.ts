class DiscordGuild {

    name: string;
    id: string;
    icon: string;
    permissions: string;
    isOwner: boolean;

    constructor (guild: any) {
        this.name = guild.name;
        this.id = guild.id;
        this.icon = `https://cdn.discordapp.com/avatars/${guild.id}/${guild.icon}.png`;
        this.permissions = guild.permissions;
        this.isOwner = guild.owner;
    }

}

export default DiscordGuild;
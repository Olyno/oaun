class DiscordConnection {

    name: string;
    id: string;
    friend_sync: boolean;
    visibility: number;
    verified: boolean;
    type: string;

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
import User from "../User";
import GoogleAuth from "./GoogleAuth";

class GoogleUser extends User {

	public oauth: GoogleAuth | undefined;

	public language: string;

	constructor (user: any) {
		super();
		this.name = user.displayName;
		this.email = user.emails[0];
		this.id = user.id;
		this.language = user.language;
		this.avatar = user.image.url;
	}

}

export default GoogleUser;
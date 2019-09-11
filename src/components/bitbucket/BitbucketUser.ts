import User from "../User";
import BitbucketAuth from "./BitbucketAuth";
import { request } from "../../utils/Utils";

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
		this.mfa_enabled = user.has_2fa_enabled;
		this.isStaff = user.is_staff;
	}

}

export default BitbucketUser;
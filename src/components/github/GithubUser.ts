import User from "../User";
import GithubAuth from "./GithubAuth";
import { request } from "../../utils/Utils";

class GithubUser extends User {

	public oauth: GithubAuth | undefined;

	constructor (user: any) {
		super();
	}

}

export default GithubUser;
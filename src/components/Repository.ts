import User from "./User";

class Repository {

	name: string | undefined;
	description: string | undefined;
	watchers: User[] = [];
	language: string | undefined;
	owner: string | undefined;
	website: string | undefined;
	clone_link: string | undefined;

	has_wiki: boolean = false;
	is_private: boolean = false;
//	branches: string

	async getWatchers(): Promise<User[]> {
		return this.watchers;
	}

}

export default Repository;
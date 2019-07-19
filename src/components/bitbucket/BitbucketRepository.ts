import Repository from '../Repository';

class BitbucketRepository extends Repository {
	
	avatar: string | undefined;
	has_issues: boolean = false;

	constructor (repository: any) {
		super();
		this.name = repository.name;
		this.description = repository.description;
		this.avatar = repository.avatar;
		this.language = repository.language;
		this.is_private = repository.is_private;
		this.has_wiki = repository.has_wiki;
		this.has_issues = repository.has_issues;
	}

}

export default BitbucketRepository;
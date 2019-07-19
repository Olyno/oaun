import User from '../User';
import GithubAuth from './GithubAuth';

class GithubUser extends User {

    public oauth: GithubAuth | undefined;

    constructor (user: any) {
        super();
        console.log(user);
    }

}

export default GithubUser;
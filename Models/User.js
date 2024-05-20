class User {
    constructor(user){
        this.sub = user.sub;
        this.name = user.name;
        this.email = user.email;
        this.picture = user.picture;
    }
}
module.exports = User;
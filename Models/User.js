class User {
    constructor(user){
        this.email = user.email;
        this.name = user.name;
        this.nickname = user.nickname;
        this.picture = user.picture;
        this.sub = user.sub;
    }
}
module.exports = User;
const { v4: uuid } = require('uuid');
module.exports = class Repository {
    constructor(params) {
        const id = uuid();
        this.title = params.title;
        this.url = params.url;
        this.techs = params.techs;
        this.likes = 0;

        this.id = function () {
            return id;
        };

        this.validate = function () {
            return this.title && this. url && this.techs && 
                (Array.isArray(this.techs) && this.techs.length > 0 && 
                this.techs.findIndex(tech => tech.trim() === '') < 0) ;
        };

        this.like = function () {
            this.likes++;
        };
    
        this.dislike = function () {
            this.likes--;
        };
    
        this.toJSON = function () {
            return { 
                id: this.id(),
                title: this.title, 
                url: this.url, 
                techs: this.techs,
                likes: this.likes
            }
        };
    }
}
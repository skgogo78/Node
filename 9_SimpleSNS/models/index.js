const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env]
const db = {}

const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);
console.log( config.database, config.username, config.password, config);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Member = require('./member')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.PostImg = require('./postimg')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);

db.Member.hasMany(db.Post);
db.Post.belongsTo(db.Member);

db.Member.belongsToMany(db.Post, { through : 'favorite'});
db.Post.belongsToMany(db.Member, { through : 'favorite'});

db.Post.hasMany(db.PostImg);
db.PostImg.belongsTo(db.Post);

db.Post.hasMany(db.Comment);
db.Comment.belongsTo(db.Post);

db.Comment.hasMany(db.Comment, {
  foreignKey : {
    name : 'parentno',
    type : Sequelize.INTEGER,
    allowNull : true
  }
});
db.Comment.belongsTo(db.Comment, {
  foreignKey : {
    name : 'parentno',
    type : Sequelize.INTEGER,
    allowNull : true
  }
});

db.Post.belongsToMany(db.Hashtag, { through : 'PostHashtag'});
db.Hashtag.belongsToMany(db.Post, { through : 'PostHashtag'});

db.Member.belongsToMany(db.Member, {
  foreignKey : 'followingId',
  as : 'Followers',
  through : 'Follow'
});
db.Member.belongsToMany(db.Member, {
  foreignKey : 'followerId',
  as : 'Followings',
  through : 'Follow'
});

module.exports = db;
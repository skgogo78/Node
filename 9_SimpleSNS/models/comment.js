module.exports = (sequelize, DataTypes) => sequelize.define('comment', {
    content : {
        type : DataTypes.TEXT('long'),
        allowNull : false
    }
},{
    timestamps : true,
    paranoid : true
});
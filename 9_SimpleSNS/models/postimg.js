module.exports = (sequelize, DataTypes)=>sequelize.define('postImg',{
    path : {
        type : DataTypes.STRING(200),
        allowNull : false
    }
},{
    timestamps : true,
    paranoid : true
});
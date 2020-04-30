module.exports = (sequelize, DataTypes)=>sequelize.define('post',{
        content : {
            type : DataTypes.TEXT('long'),
            allowNull : false
        }
    },{
        timestamps : true,
        paranoid : true
    });

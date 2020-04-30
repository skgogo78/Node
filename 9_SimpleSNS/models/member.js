module.exports = (sequelize, DataTypes)=>sequelize.define('member',{
        nickname : {
            type: DataTypes.STRING(20),
            allowNull : false,
        },
        password : {
            type: DataTypes.STRING(400),
            allowNull : true
        },
        email : {
            type : DataTypes.STRING(400),
            allowNull : false,
            unique : true
        },
        profileImg : {
            type: DataTypes.STRING(400),
            allowNull : true
        },
        provider : {
            type : DataTypes.STRING(20),
            allowNull : false,
            defaultValue : 'local'
        },
        snsId : {
            type : DataTypes.STRING(30),
            allowNull : true
        }
    }, {
        timestamps : true,
        paranoid : true
    });

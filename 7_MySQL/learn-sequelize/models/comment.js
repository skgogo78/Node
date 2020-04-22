module.exports = (seq, DataType)=>{
    return seq.define('comment', {
        comment : {
            type : DataType.STRING(100),
            allowNull : false,
        },
        created_at : {
            type : DataType.DATE,
            allowNull : true,
            defaultValue : DataType.NOW,
        },

    },{
        timestamps : false
    })
}
const Sequelize = require('sequelize')
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite',
    logging: false // 기본값은 console.log 랑 binding
});

const User = sequelize.define('User', {
    name :{
        type: Sequelize.STRING ,//varchar 255
        unique: true
    } 
});

module.exports = {Sequelize, sequelize, User} 
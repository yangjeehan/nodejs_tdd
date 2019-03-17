const models = require('../models');

// models.sequelize.sync은 내부적으로 async promise을 반환
module.exports = () => {
    // force을 true로 지면 다 지우고 sync하게됌(test용)
    const options = {
        force: process.env.NODE_ENV === 'test' ? true : false 
    };
    return models.sequelize.sync({force: options});
}

const sequelize = require('sequelize');
const conexao = require('./conexao');


const fazeres = conexao.define('fazeres', {
    agenda_id: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    fazer: {
        type: sequelize.TEXT,
        allowNull: false
    },
    hora:{
        type: sequelize.STRING,
        allowNull: false
    }
});

fazeres.sync({force:true});
module.exports = fazeres;
const sequelize = require('sequelize');
const conexao = require('./conexao');


const agenda = conexao.define('agenda',{
    
    nome:{
        type: sequelize.STRING,
        allownull: false
    },
    hora:{
        type: sequelize.STRING,
        allownull: false
    }
});

agenda.sync({force:false});
module.exports = agenda;
const sequelize = require('sequelize');


const conexao = new sequelize('afazer','root','9807531_jo',{
    host: 'localhost',
    dialect:'mysql'
});

module.exports = conexao;
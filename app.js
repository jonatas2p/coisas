const express = require('express');
const app = express();
const porta = '8080';
const bodyparser = require('body-parser');


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());


// inicia a aplicacao !!
app.listen(porta, () => {
    console.log('aplicacao rodando na porta: ' + porta);
}); // OK

//conexao
const conexao = require('./database/conexao');
conexao.authenticate()
    .then(() => {
        console.log('Banco conectado!')
    }).catch(() => {
        console.log('erro ao conectar ao banco !')
    });

// tabelas
const tb_agenda = require('./database/agenda');
const tb_fazeres = require('./database/fazeres');





// >> Rotas <<<

// Agenda!
app.get('/agenda', (req, res) => {
    res.render('agenda')
    // OK
})

//gerenciar
app.get("/gerenciar", (req, res) => {
    res.render('gerenciar')
});




// >>> Inserir dados

//recebendo dados pergunta 
app.post('/fazerhoje', (req, res) => {
    var id = req.body.id;
    var resposta = req.body.corpo;
    var hora = req.body.time;
    // realizar condicao pra checkar se os dados ja tem no banco aq



    tb_fazeres.create({
        fazer: resposta,
        agenda_id: id,
        hora: hora
    }).then(() => {
        res.redirect('/gerenciar/' + id); //OK
    });
});
// recebendo dados da nova agenda !!
app.post('/save', (req, res) => {
    var tarefa = req.body.tarefa;
    var hora = req.body.hora;

    // realizar condicao pra checkar se os dados ja tem no banco aq


    tb_agenda.create({
        nome: tarefa,
        hora: hora
    }).then(
        res.redirect('/')
    ); // OK
});




// >>> Leitura

//index
app.get('/', (req, res) => {
    tb_agenda.findAll({
        raw: true, order: [
            ['id', 'DESC']
        ]
    }).then(resposta => {
        res.render('index', {
            dados: resposta
        }); // OK
    });
});

// Agenda
app.get('/gerenciar/:id', (req, res) => {
    var id = req.params.id;
    //puxa apenas um do banco quando o id inserido pelo usuario foi ex(01)... !!
    tb_agenda.findOne({
        where: { id: id }
    }).then(agenda => {
        if (agenda != undefined) {

            //puxa todos os valores ta tabela fazeres !!
            tb_fazeres.findAll({
                where: { agenda_Id: agenda.id },
                order: [
                    ['id', 'DESC']
                ]
            }).then((respostas) => {
                res.render("gerenciar", {
                    agenda: agenda,
                    fazeres: respostas

                });
            });

        } else {
            res.redirect("/"); // OK
        }
    });
});






// >>> DELETE

//deletar dados agenda !
app.post('/delet_agenda', (req, res) => {
    var id = req.body.id;
    if (id != undefined) {

        tb_fazeres.destroy({
            where: {
                agenda_id: id
            }
        });
        tb_agenda.destroy({
            where: {
                id: id
            }
        });

        res.redirect("/");
    } else {
        res.redirect("agenda");

    }
    // OK
});

//deletar dados fazeres !
app.post('/delet_fazeres', (req, res) => {
    var campo = req.body.campo;
    var id = req.body.id;

    tb_fazeres.destroy({
        where: {
            fazer: campo
        }

    });
    res.redirect("gerenciar/" + id);
    // OK
});




// >>> ALTERACAO

// campo fazeres
app.post('/alter-fazeres',(req,res)=>{
    var atividade_fazer = req.body.atv;
    var hora_fazer = req.body.hora;
    var id = req.body.id;
    var campo = req.body.campo;


    tb_fazeres.update({fazer: atividade_fazer,hora:hora_fazer},{
        where:{
            fazer: campo
        }
    }).then(()=>{
        res.redirect('gerenciar/'+id);
    })
    // OK !!

});






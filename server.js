// Importação de módulos necessários para o servidor
const express = require("express");            // Framework para criação de aplicações web (servidor HTTP)
const sqlite3 = require("sqlite3").verbose();  // Módulo para utilizar banco de dados SQLite com suporte a mensagens de erro
const cors = require("cors");                  // Middleware para permitir requisições entre diferentes origens (frontend/backend)
const bodyParser = require("body-parser");     // Middleware para interpretar JSON enviado no corpo das requisições

// Inicializa a aplicação Express
const app = express();

// Aplica middlewares ao servidor
app.use(cors());               // Permite que o frontend se comunique com o backend mesmo estando em domínios diferentes
app.use(bodyParser.json());    // Permite que o servidor entenda requisições com conteúdo JSON no corpo

// Conecta ao banco de dados SQLite (arquivo "meusite")
// Se o arquivo não existir, ele será criado automaticamente
const db = new sqlite3.Database("meusite", err => {
    if (err) {
        console.error("Erro ao conectar ao SQLite:", err); // Exibe erro, caso ocorra ao tentar conectar
    } else {
        console.log("Banco de dados SQLite conectado com sucesso.");
    }
});

// Cria a tabela "usuarios" caso ela ainda não exista
// Isso é importante para garantir que o banco esteja pronto para uso
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            nome TEXT
        )
    `);
    console.log("Tabela 'usuarios' verificada/criada com sucesso.");
});

// Rota POST para salvar um novo usuário no banco de dados
app.post("/salvar", (req, res) => {
    const { nome } = req.body;  // Extrai o campo "nome" do corpo da requisição JSON

    // Verifica se o nome foi enviado
    if (!nome) {
        return res.status(400).json({ mensagem: "Nome é obrigatório!" }); // Responde com erro 400 se o campo for vazio
    }

    // Comando SQL para inserir o novo usuário na tabela
    const sql = "INSERT INTO usuarios (nome) VALUES (?)";

    // Executa o comando de inserção no banco de dados
    db.run(sql, [nome], function (err) {
        if (err) {
            console.error("Erro ao inserir:", err);
            return res.status(500).json({ mensagem: "Erro ao salvar no banco." }); // Retorna erro 500 em caso de falha
        }

        // Retorna mensagem de sucesso e o ID do usuário inserido
        res.json({ mensagem: "Nome salvo com sucesso!", id: this.lastID });
    });
});

// Rota GET para listar todos os usuários do banco
app.get("/usuarios", (req, res) => {
    const sql = "SELECT * FROM usuarios"; // Comando SQL para buscar todos os registros

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("Erro ao buscar usuários:", err);
            return res.status(500).json({ mensagem: "Erro ao buscar usuários." }); // Retorna erro 500 em caso de falha
        }

        res.json(rows); // Retorna os dados em formato JSON
    });
});

// Rota PUT para atualizar o nome de um usuário com base no ID
app.put("/editar/:id", (req, res) => {
    const { id } = req.params;    // Extrai o parâmetro de rota (id)
    const { nome } = req.body;    // Extrai o novo nome do corpo da requisição

    // Verifica se o nome foi fornecido
    if (!nome) {
        return res.status(400).json({ mensagem: "Nome é obrigatório!" });
    }

    const sql = "UPDATE usuarios SET nome = ? WHERE id = ?"; // Comando SQL de atualização

    // Executa o comando SQL de atualização
    db.run(sql, [nome, id], function (err) {
        if (err) {
            console.error("Erro ao atualizar usuário:", err);
            return res.status(500).json({ mensagem: "Erro ao atualizar usuário." }); // Retorna erro 500 em caso de falha
        }

        // Retorna mensagem de sucesso
        res.json({ mensagem: "Usuário atualizado com sucesso!" });
    });
});

// Rota DELETE para remover um usuário com base no ID
app.delete("/deletar/:id", (req, res) => {
    const { id } = req.params;  // Extrai o ID da URL

    const sql = "DELETE FROM usuarios WHERE id = ?"; // Comando SQL de exclusão

    // Executa o comando SQL para remover o usuário
    db.run(sql, [id], function (err) {
        if (err) {
            console.error("Erro ao excluir usuário:", err);
            return res.status(500).json({ mensagem: "Erro ao excluir usuário." }); // Retorna erro 500 em caso de falha
        }

        // Retorna mensagem de sucesso
        res.json({ mensagem: "Usuário excluído com sucesso!" });
    });
});

// Inicia o servidor na porta 3000 e exibe mensagem no terminal
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});

Este projeto implementa um CRUD de usuários utilizando Node.js com os módulos Express, SQLite3, Cors e Body-Parser.

O backend do sistema é desenvolvido em Node.js, com a utilização do framework Express para facilitar a criação das rotas e a organização do servidor. O banco de dados utilizado é o SQLite, por sua leveza, simplicidade e independência de servidor externo. Para garantir que o frontend consiga se comunicar com o backend, o middleware CORS é aplicado, além do Body-Parser, que permite o tratamento de requisições com corpo em formato JSON.

Ao iniciar o servidor, é estabelecida uma conexão com o banco de dados e verificada a existência da tabela usuarios. Caso ela ainda não exista, é automaticamente criada com duas colunas: id (chave primária com incremento automático) e nome (do tipo texto). Em seguida, são configuradas as principais rotas que compõem a API REST:

POST /salvar: permite cadastrar um novo usuário.

GET /usuarios: retorna todos os usuários armazenados no banco.

PUT /editar/:id: atualiza o nome de um usuário com base no seu ID.

DELETE /deletar/:id: remove um usuário da base de dados pelo ID.

Essas rotas garantem a funcionalidade completa de um CRUD, possibilitando a manipulação dos dados de forma simples e eficaz. O servidor é iniciado na porta 3000, ficando disponível para atender requisições provenientes do frontend ou de outros sistemas.

Estrutura do Frontend
A interface do usuário foi projetada com foco na simplicidade e responsividade, utilizando HTML, CSS e JavaScript puro. O estilo da página é aprimorado com o uso do Bootstrap, que fornece classes para formatação visual moderna, e ícones do Font Awesome e Bootstrap Icons, que enriquecem a interface com elementos visuais intuitivos.

O HTML é dividido em três partes principais:

Formulário de cadastro – permite ao usuário inserir seu nome. O campo de ID é oculto, sendo utilizado internamente para identificar registros a serem editados.

Lista de usuários – exibe os usuários cadastrados dinamicamente, com botões de edição e exclusão.

Mensagens de feedback – informam o resultado das ações, como sucesso ao salvar ou erro ao deletar.

No JavaScript (arquivo script.js), funções específicas são responsáveis por interagir com o backend. A função salvarUsuario() envia um nome via requisição POST para ser salvo. listarUsuarios() e carregarUsuarios() obtêm todos os usuários e os exibem na lista, enquanto editarUsuario() e deletarUsuario() permitem a modificação e remoção dos dados.

Além disso, um listener no formulário detecta o envio, verificando se um nome foi informado. Dependendo do contexto (criação ou edição), a requisição apropriada (POST ou PUT) é realizada. Após qualquer ação, a lista é atualizada automaticamente para refletir os dados mais recentes.

Estilo CSS
O visual da aplicação é refinado por um arquivo CSS personalizado, que utiliza uma paleta de cores suaves e agradáveis. O foco está na legibilidade e na estética limpa, com destaque para elementos interativos como botões e inputs. Utilizam-se variáveis CSS para facilitar a manutenção da paleta de cores e tornar o código mais organizado.

// Função pra salvar um novo usuário no banco (ou editar, se tiver ID)
function salvarUsuario() {
  const nome = document.getElementById("nome").value; // pega o valor do input

  fetch("http://localhost:3000/salvar", {
    method: "POST", // método POST = salvar novo
    headers: { "Content-Type": "application/json" }, // diz que vai mandar JSON
    body: JSON.stringify({ nome }) // manda só o nome pro back
  })
  .then(res => res.json())
  .then(() => listarUsuarios()); // atualiza a lista depois de salvar
}

// Essa função puxa a lista de usuários cadastrados e mostra no HTML (simples)
function listarUsuarios() {
  fetch("http://localhost:3000/usuarios") // pega os dados da API
    .then(res => res.json())
    .then(usuarios => {
      const lista = document.getElementById("listaUsuarios"); // pega o elemento da lista
      lista.innerHTML = ""; // limpa a lista

      usuarios.forEach(user => {
        const li = document.createElement("li"); // cria um item novo
        li.textContent = user.nome; // coloca o nome do user
        lista.appendChild(li); // adiciona na lista
      });
    });
}

// Essa aqui é mais completa: carrega a lista e já monta com botões de editar e deletar
function carregarUsuarios() {
  fetch("http://localhost:3000/usuarios")
    .then((response) => response.json())
    .then((usuarios) => {
      const lista = document.getElementById("lista"); // lista no HTML
      lista.innerHTML = ""; // limpa a lista antes de mostrar os novos

      usuarios.forEach((usuario) => {
        const li = document.createElement("li"); // cria o <li>
        li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center"); // classes do Bootstrap
        li.innerHTML = `
          ${usuario.nome}
          <div class="list-group-div">
            <button class="btn btn-outline-warning btn-sm me-2" onclick="editarUsuario(${usuario.id}, '${usuario.nome}')">
              <i class="bi bi-pencil-square fs-6"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm" onclick="deletarUsuario(${usuario.id})">
              <i class="bi bi-trash fs-6"></i>
            </button>
          </div>`; // botão de editar e deletar com ícones
        lista.appendChild(li); // adiciona na lista
      });
    })
    .catch((error) => console.error("Erro ao carregar usuários:", error)); // caso dê erro
}

// Quando o formulário é enviado...
document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault(); // cancela o comportamento padrão do formulário (que é recarregar a página)

  const id = document.getElementById("id").value; // pega o ID (se existir)
  const nome = document.getElementById("nome").value; // pega o nome
  const mensagem = document.getElementById("mensagem"); // pega o elemento da mensagem

  if (!nome) {
    // se o nome estiver vazio, mostra aviso e para tudo
    mensagem.textContent = "Por favor, digite um nome!";
    mensagem.style.color = "red";
    mensagem.style.display = "block";
    setTimeout(() => (mensagem.style.display = "none"), 3000); // esconde depois de 3s
    return;
  }

  // decide se vai salvar (POST) ou editar (PUT), dependendo se tem ID
  const url = id ? `http://localhost:3000/editar/${id}` : "http://localhost:3000/salvar";
  const metodo = id ? "PUT" : "POST";

  // manda os dados pro servidor
  fetch(url, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome }),
  })
    .then((response) => response.json())
    .then((data) => {
      // mostra a mensagem de sucesso
      mensagem.textContent = data.mensagem;
      mensagem.style.color = "green";
      mensagem.style.display = "block";
      setTimeout(() => (mensagem.style.display = "none"), 3000); // esconde depois de 3s

      // limpa os campos
      document.getElementById("id").value = "";
      document.getElementById("nome").value = "";
      carregarUsuarios(); // atualiza a lista
    })
    .catch((error) => console.error("Erro ao salvar:", error)); // erro no fetch
});

// Quando clica em editar: preenche os campos com os dados do usuário clicado
function editarUsuario(id, nome) {
  document.getElementById("id").value = id;
  document.getElementById("nome").value = nome;
}

// Quando clica em deletar: pergunta se quer mesmo, e manda DELETE pro back
function deletarUsuario(id) {
  if (confirm("Tem certeza que deseja remover este usuário?")) {
    fetch(`http://localhost:3000/deletar/${id}`, { method: "DELETE" })
      .then((response) => response.json())
      .then((data) => {
        alert(data.mensagem); // mostra aviso
        carregarUsuarios(); // atualiza a lista
      })
      .catch((error) => console.error("Erro ao remover usuário:", error));
  }
}

// Carrega os usuários automaticamente quando a página abre
carregarUsuarios();

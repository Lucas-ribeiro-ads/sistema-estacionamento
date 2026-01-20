const cabeçalho = document.getElementById('header');
const titulo = document.getElementById('titulo');
const formulario = document.getElementById('formulario');
const botaoEntrada = document.getElementById('btnEntrada');
const tabela = document.getElementById('listaVeiculos');
const corpoTabela = document.getElementById('corpoTabela');

// funçao para registro do horário de forma automática
function horaAtual() {
    const agora = new Date();

    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const ano = agora.getFullYear();

    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}


// evento do registro de entrada
botaoEntrada.addEventListener('click', function(event){
event.preventDefault()


const placa = document.getElementById('placa').value.trim();
const modelo = document.getElementById('modelo').value.trim();
const condutor = document.getElementById('condutor').value.trim();
const entrada = horaAtual();


//validação 
if (!placa || !modelo || !condutor || !entrada ) {
    alert ("Preencha todos os campos")
    return
}
// impede placa duplicada
const placasExistentes = [...corpoTabela.querySelectorAll("tr td:first-child")]
  .map(td => td.innerText);

if (placasExistentes.includes(placa)) {
  alert("Esta placa já está registrada!");
  return;
}
const linha = document.createElement('tr')


linha.innerHTML = `
<td>${placa}</td>
<td>${modelo}</td>
<td>${condutor}</td>
<td>${entrada}</td>
<td></td>`
// evento saída
const botaoSaida = document.createElement('button')
botaoSaida.innerText = "Registrar saida"
botaoSaida.className = "btnSaida";

botaoSaida.addEventListener('click', function(){
   linha.remove();
atualizarContador();

});

linha.lastElementChild.appendChild(botaoSaida)
corpoTabela.appendChild(linha);

formulario.reset();

});

function atualizarContador() {
  document.getElementById("contador").innerText =
    "Vagas ocupadas: " + corpoTabela.children.length;
}

atualizarContador(); 

// Atualiza o contador sempre que clicar em Registrar Entrada
botaoEntrada.addEventListener('click', function () {
  atualizarContador();
});

// Garante que o contador esteja correto ao carregar a página
document.addEventListener("DOMContentLoaded", function () {
  atualizarContador();
});

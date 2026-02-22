
// CONECTAR COM SUPABASE


const supabaseClient = window.supabaseClient;



// ELEMENTOS HTML


const formulario = document.getElementById('formEntrada');
const botaoEntrada = document.getElementById('btnEntrada');
const corpoTabela = document.getElementById('corpoTabela');



// FUNÇÃO HORA ATUAL


function horaAtual(){
  const agora = new Date();

  const dia = String(agora.getDate()).padStart(2,'0');
  const mes = String(agora.getMonth()+1).padStart(2,'0');
  const ano = agora.getFullYear();

  const horas = String(agora.getHours()).padStart(2,'0');
  const minutos = String(agora.getMinutes()).padStart(2,'0');

  return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}



// CONTADOR


function atualizarContador(){
  document.getElementById("contador").innerText =
  "Vagas ocupadas: " + corpoTabela.children.length;
}



// CREATE (INSERT)


botaoEntrada.addEventListener("click", async function(event){

  event.preventDefault();

  const placa = document.getElementById("placa").value.trim();
  const modelo = document.getElementById("modelo").value.trim();
  const condutor = document.getElementById("condutor").value.trim();
  const entrada = horaAtual();

  if(!placa || !modelo || !condutor){
    alert("Preencha todos os campos");
    return;
  }

  const { error } = await supabaseClient
    .from("garagem")
    .insert([{ placa, modelo, condutor, entrada }]);

  if(error){
    console.log("❌ registro no supabase mal sucedido", error);
    alert("Erro ao salvar no banco");
    return;
  }

  console.log("✅ registro no supabase bem sucedido");

  carregarSupabase();
  formulario.reset();
});



// READ


async function carregarSupabase(){

  const { data, error } = await supabaseClient
    .from("garagem")
    .select("*")
    .order("created_at", { ascending:false });

  if(error){
    console.log("❌ falha ao buscar dados", error);
    return;
  }

  corpoTabela.innerHTML = "";

  data.forEach(registro => {
    criarLinha(registro);
  });

  atualizarContador();
}


 
// CRIAR LINHA

function criarLinha(registro){

  const linha = document.createElement("tr");

  linha.innerHTML = `
    <td>${registro.placa}</td>
    <td>${registro.modelo}</td>
    <td>${registro.condutor}</td>
    <td>${registro.entrada}</td>
    <td></td>
  `;

  // BOTÃO SAÍDA (DELETE)
  const botaoSaida = document.createElement("button");
  botaoSaida.innerText = "Registrar saída";
  botaoSaida.className = "btnSaida";

  botaoSaida.addEventListener("click", async function(){

    const { error } = await supabaseClient
      .from("garagem")
      .delete()
      .eq("placa", registro.placa);

    if(error){
      console.log("❌ falha ao deletar", error);
      alert("Erro ao deletar");
      return;
    }

    console.log("✅ deletado com sucesso");

    carregarSupabase();
  });

  // BOTÃO EDITAR (UPDATE)
  const botaoEditar = document.createElement("button");
  botaoEditar.innerText = "Editar";
  botaoEditar.style.marginTop = "5px";

  botaoEditar.addEventListener("click", async function(){

    const novoModelo = prompt("Novo modelo:", registro.modelo);

    if(!novoModelo) return;

    const { error } = await supabaseClient
      .from("garagem")
      .update({ modelo: novoModelo })
      .eq("placa", registro.placa);

    if(error){
      console.log("❌ falha em alterar", error);
      alert("Erro ao alterar");
      return;
    }

    console.log("✅ alterado com sucesso");

    carregarSupabase();
  });

  linha.lastElementChild.appendChild(botaoSaida);
  linha.lastElementChild.appendChild(botaoEditar);

  corpoTabela.appendChild(linha);
}



// CARREGAR AO INICIAR


document.addEventListener("DOMContentLoaded", function(){
  carregarSupabase();
});
var btnTema = document.getElementById("btn-tema");
var raiz = document.documentElement;

function aplicarTema(tema) {
  raiz.setAttribute("data-theme", tema);
  btnTema.textContent = tema === "dark" ? "Claro" : "Escuro";
}

var temaSalvo = null;
try { temaSalvo = localStorage.getItem("tema"); } catch (e) {}
if (!temaSalvo) {
  temaSalvo = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
aplicarTema(temaSalvo);

btnTema.addEventListener("click", function () {
  var novo = raiz.getAttribute("data-theme") === "dark" ? "light" : "dark";
  aplicarTema(novo);
  try { localStorage.setItem("tema", novo); } catch (e) {}
});

var frases = ["Estudante de Informática", "Futuro desenvolvedor", "Apaixonado por tecnologia"];
var fraseAtual = 0;
var letra = 0;
var apagando = false;
var campo = document.getElementById("texto-digitado");

function digitar() {
  var frase = frases[fraseAtual];
  if (!apagando) {
    letra++;
    if (letra === frase.length) {
      apagando = true;
      campo.textContent = frase;
      return setTimeout(digitar, 1500);
    }
  } else {
    letra--;
    if (letra === 0) {
      apagando = false;
      fraseAtual = (fraseAtual + 1) % frases.length;
    }
  }
  campo.textContent = frase.substring(0, letra);
  setTimeout(digitar, apagando ? 40 : 90);
}
digitar();

var observador = new IntersectionObserver(function (itens) {
  itens.forEach(function (item) {
    if (item.isIntersecting) { item.target.classList.add("mostrar"); }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".aparecer").forEach(function (el) { observador.observe(el); });

var modal = document.getElementById("modal");

function abrirModal(titulo, texto) {
  document.getElementById("modal-titulo").textContent = titulo;
  document.getElementById("modal-texto").textContent = texto;
  modal.classList.add("aberto");
}

function fecharModal() {
  modal.classList.remove("aberto");
}

document.querySelectorAll("#projetos .card button").forEach(function (b) {
  b.addEventListener("click", function () { abrirModal(b.dataset.titulo, b.dataset.desc); });
});
document.getElementById("modal-fechar").addEventListener("click", fecharModal);
modal.addEventListener("click", function (e) { if (e.target === modal) fecharModal(); });
document.addEventListener("keydown", function (e) { if (e.key === "Escape") fecharModal(); });

var nome = document.getElementById("nome");
var telefone = document.getElementById("telefone");
var email = document.getElementById("email");
var mensagem = document.getElementById("mensagem");

nome.addEventListener("input", function () {
  nome.value = nome.value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
});

telefone.addEventListener("input", function () {
  var n = telefone.value.replace(/\D/g, "").substring(0, 11);
  if (n.length > 10) n = n.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  else if (n.length > 6) n = n.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
  else if (n.length > 2) n = n.replace(/^(\d{2})(\d{0,5})$/, "($1) $2");
  else if (n.length > 0) n = n.replace(/^(\d*)$/, "($1");
  telefone.value = n;
});

email.addEventListener("input", function () {
  email.value = email.value.replace(/\s/g, "").toLowerCase();
});

mensagem.addEventListener("input", function () {
  document.getElementById("contador").textContent = mensagem.value.length;
});

document.getElementById("form-contato").addEventListener("submit", function (e) {
  e.preventDefault();
  var ok = true;

  function checar(condicao, idErro, texto) {
    document.getElementById(idErro).textContent = condicao ? "" : texto;
    if (!condicao) ok = false;
  }

  checar(nome.value.trim().length >= 3, "erro-nome", "Digite seu nome completo.");
  checar(telefone.value.length >= 14, "erro-telefone", "Digite o telefone com DDD.");
  checar(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value), "erro-email", "Digite um e-mail válido.");
  checar(mensagem.value.trim().length >= 10, "erro-mensagem", "Escreva pelo menos 10 caracteres.");

  if (ok) {
    abrirModal("Mensagem enviada!", "Obrigado pelo contato, " + nome.value.trim().split(" ")[0] + ". Responderei em breve.");
    e.target.reset();
    document.getElementById("contador").textContent = 0;
  }
});

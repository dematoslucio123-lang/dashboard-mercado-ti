const dados = {
  all: {
    vagas: "18.400", junior: "R$ 3.200", pleno: "R$ 6.800", senior: "R$ 12.500", remoto: "61%",
    skills: [
      { nome: "Windows", pct: 78 }, { nome: "SQL", pct: 71 }, { nome: "Linux", pct: 64 },
      { nome: "Excel", pct: 58 }, { nome: "Redes", pct: 53 }, { nome: "Python", pct: 47 }
    ]
  },
  suporte: {
    vagas: "5.200", junior: "R$ 2.200", pleno: "R$ 3.800", senior: "R$ 6.500", remoto: "48%",
    skills: [
      { nome: "Windows", pct: 92 }, { nome: "ITIL", pct: 74 }, { nome: "Active Dir.", pct: 68 },
      { nome: "Office 365", pct: 65 }, { nome: "Redes", pct: 61 }, { nome: "SQL", pct: 45 }
    ]
  },
  dev: {
    vagas: "6.100", junior: "R$ 4.000", pleno: "R$ 8.500", senior: "R$ 16.000", remoto: "79%",
    skills: [
      { nome: "JavaScript", pct: 85 }, { nome: "Git", pct: 91 }, { nome: "React", pct: 72 },
      { nome: "Python", pct: 68 }, { nome: "SQL", pct: 63 }, { nome: "Docker", pct: 55 }
    ]
  },
  dados: {
    vagas: "3.800", junior: "R$ 4.500", pleno: "R$ 9.000", senior: "R$ 17.000", remoto: "72%",
    skills: [
      { nome: "SQL", pct: 95 }, { nome: "Python", pct: 88 }, { nome: "Power BI", pct: 76 },
      { nome: "Excel", pct: 70 }, { nome: "Spark", pct: 52 }, { nome: "Tableau", pct: 44 }
    ]
  },
  infra: {
    vagas: "2.400", junior: "R$ 3.000", pleno: "R$ 6.200", senior: "R$ 11.500", remoto: "55%",
    skills: [
      { nome: "Linux", pct: 89 }, { nome: "Redes", pct: 85 }, { nome: "AWS/Azure", pct: 71 },
      { nome: "Docker", pct: 66 }, { nome: "Bash", pct: 60 }, { nome: "VMware", pct: 54 }
    ]
  },
  seguranca: {
    vagas: "900", junior: "R$ 4.800", pleno: "R$ 9.500", senior: "R$ 18.000", remoto: "64%",
    skills: [
      { nome: "Linux", pct: 88 }, { nome: "Redes", pct: 82 }, { nome: "Pentest", pct: 78 },
      { nome: "SIEM", pct: 65 }, { nome: "Python", pct: 60 }, { nome: "Cloud Sec", pct: 55 }
    ]
  }
}

const cidades = [
  { nome: "São Paulo, SP", vagas: 6800, salario: "R$ 9.500", remoto: "72%" },
  { nome: "Rio de Janeiro, RJ", vagas: 2400, salario: "R$ 7.800", remoto: "65%" },
  { nome: "Brasília, DF", vagas: 1900, salario: "R$ 8.200", remoto: "60%" },
  { nome: "Curitiba, PR", vagas: 1400, salario: "R$ 7.200", remoto: "68%" },
  { nome: "Belo Horizonte, MG", vagas: 1200, salario: "R$ 6.900", remoto: "61%" },
  { nome: "Porto Alegre, RS", vagas: 980, salario: "R$ 6.700", remoto: "70%" },
  { nome: "Florianópolis, SC", vagas: 760, salario: "R$ 7.100", remoto: "74%" },
  { nome: "Recife, PE", vagas: 620, salario: "R$ 5.800", remoto: "66%" },
]

let skillsAtuais = []

function animarContador(elemento, valorFinal, prefixo, sufixo) {
  const duracao = 600
  const incremento = valorFinal / (duracao / 16)
  let atual = 0
  const timer = setInterval(function() {
    atual += incremento
    if (atual >= valorFinal) {
      atual = valorFinal
      clearInterval(timer)
    }
    elemento.textContent = prefixo + Math.round(atual).toLocaleString('pt-BR') + sufixo
  }, 16)
}

function atualizarDashboard(area) {
  const info = dados[area]

  animarContador(document.querySelector('#metricas .card:nth-child(1) .valor'), parseInt(info.vagas.replace(/\D/g, '')), '', '')
  animarContador(document.querySelector('#metricas .card:nth-child(2) .valor'), parseInt(info.junior.replace(/\D/g, '')), 'R$ ', '')
  animarContador(document.querySelector('#metricas .card:nth-child(3) .valor'), parseInt(info.senior.replace(/\D/g, '')), 'R$ ', '')
  animarContador(document.querySelector('#metricas .card:nth-child(4) .valor'), parseInt(info.remoto.replace(/\D/g, '')), '', '%')

  skillsAtuais = info.skills
  renderizarSkills(skillsAtuais)
  atualizarGrafico(area)
}

function renderizarSkills(lista) {
  const container = document.getElementById('lista-skills')
  container.innerHTML = ''
  lista.forEach(function(skill) {
    container.innerHTML += `
      <div class="skill-item">
        <span class="skill-nome">${skill.nome}</span>
        <div class="skill-barra-fundo">
          <div class="skill-barra" style="width: ${skill.pct}%"></div>
        </div>
        <span class="skill-pct">${skill.pct}%</span>
      </div>
    `
  })
}

function filtrarSkills() {
  const busca = document.getElementById('buscaSkill').value.toLowerCase()
  const filtradas = skillsAtuais.filter(function(skill) {
    return skill.nome.toLowerCase().includes(busca)
  })
  renderizarSkills(filtradas)
}

function renderizarCidades() {
  const corpo = document.getElementById('corpoTabela')
  corpo.innerHTML = ''
  cidades.forEach(function(cidade, index) {
    corpo.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${cidade.nome}</td>
        <td>${cidade.vagas.toLocaleString('pt-BR')}</td>
        <td>${cidade.salario}</td>
        <td>${cidade.remoto}</td>
      </tr>
    `
  })
}

let meuGrafico = null
let graficoPizza = null

function atualizarGrafico(area) {
  const info = dados[area]
  const ctx = document.getElementById('meuGrafico').getContext('2d')
  if (meuGrafico) meuGrafico.destroy()
  meuGrafico = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Júnior', 'Pleno', 'Sênior'],
      datasets: [{
        data: [
          parseInt(info.junior.replace(/\D/g, '')),
          parseInt(info.pleno.replace(/\D/g, '')),
          parseInt(info.senior.replace(/\D/g, ''))
        ],
        backgroundColor: ['#B5D4F4', '#378ADD', '#185FA5'],
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          ticks: {
            callback: function(value) {
              return 'R$ ' + value.toLocaleString('pt-BR')
            }
          }
        }
      }
    }
  })
}

function criarGraficoPizza() {
  const ctx = document.getElementById('graficoPizza').getContext('2d')
  if (graficoPizza) graficoPizza.destroy()
  graficoPizza = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Suporte', 'Dev', 'Dados', 'Infra', 'Segurança'],
      datasets: [{
        data: [5200, 6100, 3800, 2400, 900],
        backgroundColor: ['#B5D4F4', '#185FA5', '#378ADD', '#0C447C', '#7eb8f7'],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 12 }, padding: 12 }
        }
      }
    }
  })
}

let graficoIBGE = null

function carregarDadosIBGE() {
  fetch('https://servicodados.ibge.gov.br/api/v1/pesquisas/indicadores/29765/resultados/0')
    .then(function(resposta) { return resposta.json() })
    .then(function(json) {
      const resultados = json[0].res[0].res
      const anos = Object.keys(resultados)
      const valores = anos.map(function(ano) {
        return parseFloat(parseFloat(resultados[ano]).toFixed(1))
      })
      const ctx = document.getElementById('graficoIBGE').getContext('2d')
      if (graficoIBGE) graficoIBGE.destroy()
      graficoIBGE = new Chart(ctx, {
        type: 'line',
        data: {
          labels: anos,
          datasets: [{
            data: valores,
            borderColor: '#185FA5',
            backgroundColor: 'rgba(24, 95, 165, 0.1)',
            borderWidth: 2,
            pointRadius: 4,
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              ticks: {
                callback: function(value) {
                  return parseFloat(value.toFixed(1)) + ' sal. mín.'
                }
              }
            }
          }
        }
      })
    })
}

function alternarTema() {
  document.body.classList.toggle('escuro')
  const btn = document.getElementById('btnTema')
  btn.textContent = document.body.classList.contains('escuro') ? '☀️ Modo claro' : '🌙 Modo escuro'
}

const botoes = document.querySelectorAll('.filtro')
botoes.forEach(function(botao) {
  botao.addEventListener('click', function() {
    botoes.forEach(function(b) { b.classList.remove('ativo') })
    botao.classList.add('ativo')
    atualizarDashboard(botao.dataset.area)
  })
})

atualizarDashboard('all')
criarGraficoPizza()
renderizarCidades()
carregarDadosIBGE()
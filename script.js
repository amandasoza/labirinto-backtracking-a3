const CAMINHO = 1; // caminho livre para andar
const SAIDA = 2; // célula da saída do labirinto
const VISITADO = -1; // marca células visitadas durante busca

const labirinto = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,0,1,0,1,1,1,1,0,1,1,1,0,1,1,1,0],
  [0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1,0,1,0],
  [0,1,0,1,1,1,1,1,0,0,1,1,1,0,1,1,1,0,1,0],
  [0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,1,0],
  [0,1,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,0],
  [0,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0],
  [0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,0],
  [0,1,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0],
  [0,1,0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0],
  [0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0],
  [0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,0],
  [0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0],
  [0,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,0],
  [0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,1,0],
  [0,1,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0],
  [0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,2,0],
  [0,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

const linhas = labirinto.length; // total de linhas do labirinto
const colunas = labirinto[0].length; // total de colunas do labirinto
const labirintoDiv = document.getElementById('labirinto'); // container HTML para o labirinto

// Função para desenhar o labirinto no HTML usando divs
function renderizarLabirinto() {
  labirintoDiv.style.gridTemplateColumns = `repeat(${colunas}, 25px)`; // cria colunas em grid CSS
  labirintoDiv.innerHTML = ''; // limpa conteúdo anterior
  for(let i=0; i < linhas; i++) {
    for(let j=0; j < colunas; j++) {
      const div = document.createElement('div'); // cria uma célula
      div.classList.add('cell'); // classe base
      if(labirinto[i][j] === 0) div.classList.add('parede'); // parede
      else if(labirinto[i][j] === 1) div.classList.add('caminho'); // caminho livre
      else if(labirinto[i][j] === 2) div.classList.add('saida'); // saída
      div.id = `cell-${i}-${j}`; // id único
      labirintoDiv.appendChild(div); // adiciona ao container
    }
  }
}

// Marca a célula como visitada visualmente
function marcarVisitado(x,y) {
  const celula = document.getElementById(`cell-${x}-${y}`);
  if(celula) {
    celula.classList.add('visitado');
    celula.classList.remove('backtrack');
  }
}

// Marca a célula como backtrack (retrocesso) visualmente
function marcarBacktrack(x,y) {
  const celula = document.getElementById(`cell-${x}-${y}`);
  if(celula) {
    celula.classList.add('backtrack');
    celula.classList.remove('visitado');
  }
}

// Remove marcações visuais da célula
function desmarcarVisitado(x,y) {
  const celula = document.getElementById(`cell-${x}-${y}`);
  if(celula) {
    celula.classList.remove('visitado');
    celula.classList.remove('backtrack');
  }
}

// Pausa a execução assíncrona por "ms" milissegundos (usada para animação)
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Embaralha os elementos do array (para variar a ordem das direções exploradas)
function shuffle(array) {
  for(let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Função recursiva que explora o labirinto buscando caminhos até a saída
async function explorarLabirinto(x, y, caminhoAtual, caminhosEncontrados) {
  if(x < 0 || y < 0 || x >= linhas || y >= colunas) return; // verifica limites

  if(labirinto[x][y] === SAIDA) { // encontrou saída
    caminhoAtual.push([x,y]);
    caminhosEncontrados.push([...caminhoAtual]); // salva cópia do caminho atual
    caminhoAtual.pop();
    return;
  }

  if(labirinto[x][y] === CAMINHO) { // se caminho livre, pode explorar
    labirinto[x][y] = VISITADO; // marca como visitado no labirinto
    caminhoAtual.push([x,y]); // adiciona posição atual ao caminho
    marcarVisitado(x,y); // marca visualmente
    await delay(50); // pausa para animação

    let direcoes = [ [x+1,y], [x,y+1], [x-1,y], [x,y-1] ]; // baixo, direita, cima, esquerda
    shuffle(direcoes); // embaralha para variar ordem de exploração

    for(let [nx, ny] of direcoes) {
      await explorarLabirinto(nx, ny, caminhoAtual, caminhosEncontrados);
    }

    caminhoAtual.pop(); // retrocede no caminho
    labirinto[x][y] = CAMINHO; // volta a marcar como caminho livre
    marcarBacktrack(x,y); // marca retrocesso visualmente
    await delay(100); // pausa para animação
    desmarcarVisitado(x,y); // limpa marcações visuais
  }
}

// Anima o caminho final encontrado
async function animarCaminhoFinal(caminho) {
  for(let [x,y] of caminho) {
    const celula = document.getElementById(`cell-${x}-${y}`);
    if(celula) {
      celula.classList.remove('visitado', 'backtrack');
      celula.classList.add('caminho-final');
      await delay(150);
    }
  }
}

renderizarLabirinto(); // desenha labirinto na tela

(async () => {
  const caminhos = [];
  await explorarLabirinto(1,1, [], caminhos); // inicia exploração na posição (1,1)

  if(caminhos.length > 0) {
    // seleciona o menor caminho encontrado (mais curto)
    let menorCaminho = caminhos.reduce((a,b) => a.length <= b.length ? a : b);
    await animarCaminhoFinal(menorCaminho); // anima o caminho final
  } else {
    console.log("Nenhum caminho encontrado"); // não achou saída
  }
})();



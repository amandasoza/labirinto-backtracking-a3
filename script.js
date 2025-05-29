const CAMINHO = 1; // caminho livre para andar  
const SAIDA = 2; // célula da saída do labirinto  
const VISITADO = -1; // marca células visitadas durante busca  

const labirinto = [  // matriz que representa o labirinto (0=parede, 1=caminho, 2=saída)
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

function renderizarLabirinto() {  // cria visualmente o labirinto com divs  
  labirintoDiv.style.gridTemplateColumns = `repeat(${colunas}, 25px)`; // configura colunas no grid CSS  
  labirintoDiv.innerHTML = ''; // limpa conteúdo anterior  
  for(let i=0; i < linhas; i++) {  
    for(let j=0; j < colunas; j++) {  
      const div = document.createElement('div'); // cria célula  
      div.classList.add('cell'); // classe base  
      if(labirinto[i][j] === 0) div.classList.add('parede'); // adiciona estilo parede  
      else if(labirinto[i][j] === 1) div.classList.add('caminho'); // estilo caminho livre  
      else if(labirinto[i][j] === 2) div.classList.add('saida'); // estilo saída  
      div.id = `cell-${i}-${j}`; // id único para depois manipular  
      labirintoDiv.appendChild(div); // adiciona à página  
    }  
  }  
}  

function marcarVisitado(x,y) {  // marca célula visualmente como visitada  
  const celula = document.getElementById(`cell-${x}-${y}`);  
  if(celula) {  
    celula.classList.add('visitado');  
    celula.classList.remove('backtrack');  
  }  
}  

function marcarBacktrack(x,y) {  // marca célula visualmente como backtrack (retrocesso)  
  const celula = document.getElementById(`cell-${x}-${y}`);  
  if(celula) {  
    celula.classList.add('backtrack');  
    celula.classList.remove('visitado');  
  }  
}  

function desmarcarVisitado(x,y) {  // remove marcações visuais da célula  
  const celula = document.getElementById(`cell-${x}-${y}`);  
  if(celula) {  
    celula.classList.remove('visitado');  
    celula.classList.remove('backtrack');  
  }  
}  

function delay(ms) {  // pausa execução assíncrona para animação  
  return new Promise(resolve => setTimeout(resolve, ms));  
}  

function shuffle(array) {  // embaralha elementos do array (para variar ordem de exploração)  
  for(let i = array.length - 1; i > 0; i--) {  
    const j = Math.floor(Math.random() * (i + 1));  
    [array[i], array[j]] = [array[j], array[i]];  
  }  
  return array;  
}  

async function explorarLabirinto(x, y, caminhoAtual, caminhosEncontrados) {  // busca recursiva por caminhos até a saída  
  if(x < 0 || y < 0 || x >= linhas || y >= colunas) return;  // se fora dos limites, para  

  if(labirinto[x][y] === SAIDA) {  // achou saída  
    caminhoAtual.push([x,y]);  
    caminhosEncontrados.push([...caminhoAtual]);  // salva cópia do caminho  
    caminhoAtual.pop();  
    return;  
  }  

  if(labirinto[x][y] === CAMINHO) {  // se caminho livre, continua busca  
    labirinto[x][y] = VISITADO;  // marca como visitado para não voltar  
    caminhoAtual.push([x,y]);  // adiciona posição atual ao caminho  
    marcarVisitado(x,y);  // marca visualmente  
    await delay(50);  // pausa para animação  

    let direcoes = [ [x+1,y], [x,y+1], [x-1,y], [x,y-1] ];  // direções para explorar (baixo, direita, cima, esquerda)  
    shuffle(direcoes);  // embaralha ordem para variar exploração  

    for(let [nx, ny] of direcoes) {  // explora cada direção  
      await explorarLabirinto(nx, ny, caminhoAtual, caminhosEncontrados);  
    }  

    caminhoAtual.pop();  // remove posição atual do caminho (retrocesso)  
    marcarBacktrack(x,y);  // marca visualmente retrocesso  
    await delay(100);  // pausa para animação  
    desmarcarVisitado(x,y);  // remove marcações visuais  
  }  
}  

async function animarCaminhoFinal(caminho) {  // anima visualmente o caminho final encontrado  
  for(let [x,y] of caminho) {  
    const celula = document.getElementById(`cell-${x}-${y}`);  
    if(celula) {  
      celula.classList.remove('visitado', 'backtrack');  
      celula.classList.add('caminho-final');  
      await delay(150);  // pausa para animação passo a passo  
    }  
  }  
}  

renderizarLabirinto();  // desenha o labirinto na tela  

(async () => {  
  const caminhos = [];  
  await explorarLabirinto(1,1, [], caminhos);  // começa busca na posição inicial (1,1)  

  if(caminhos.length > 0) {  
    let menorCaminho = caminhos.reduce((a,b) => a.length <= b.length ? a : b);  // escolhe o menor caminho  
    await animarCaminhoFinal(menorCaminho);  // anima o caminho final na tela  
  } else {  
    console.log("Nenhum caminho encontrado");  // não achou saída  
  }  
})();  




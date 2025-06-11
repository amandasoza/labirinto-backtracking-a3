const CAMINHO = 1; //Caminho livre para andar  
const SAIDA = 2; //Célula da saída do labirinto  
const VISITADO = -1; //Marca células visitadas durante busca  

const labirinto = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,0,1,1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0],
  [0,1,0,1,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,0],
  [0,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1,1,0],
  [0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,0,1,0],
  [0,1,1,1,0,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,0],
  [0,0,0,1,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,0],
  [0,1,1,1,0,1,1,1,0,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,0],
  [0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1,0],
  [0,1,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,0],
  [0,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0],
  [0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,0],
  [0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,0],
  [0,1,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,0],
  [0,1,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,0,0],
  [0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0],
  [0,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,2,0,0],
  [0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,0],
  [0,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,0],
  [0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,0],
  [0,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,0,0],
  [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];



const linhas = labirinto.length;
const colunas = labirinto[0].length;
const labirintoDiv = document.getElementById('labirinto');

function renderizarLabirinto() {
  labirintoDiv.style.gridTemplateColumns = `repeat(${colunas}, 25px)`;
  labirintoDiv.innerHTML = '';
  for(let i = 0; i < linhas; i++) {
    for(let j = 0; j < colunas; j++) {
      const div = document.createElement('div');
      div.classList.add('cell');
      if(labirinto[i][j] === 0) div.classList.add('parede');
      else if(labirinto[i][j] === 1) div.classList.add('caminho');
      else if(labirinto[i][j] === 2) div.classList.add('saida');
      div.id = `cell-${i}-${j}`;
      labirintoDiv.appendChild(div);
    }
  }
}

function marcarVisitado(x,y) {
  const celula = document.getElementById(`cell-${x}-${y}`);
  if(celula) {
    celula.classList.add('visitado');
    celula.classList.remove('backtrack');
  }
}

function marcarBacktrack(x,y) {
  const celula = document.getElementById(`cell-${x}-${y}`);
  if(celula) {
    celula.classList.add('backtrack');
    celula.classList.remove('visitado');
  }
}

function desmarcarVisitado(x,y) {
  const celula = document.getElementById(`cell-${x}-${y}`);
  if(celula) {
    celula.classList.remove('visitado');
    celula.classList.remove('backtrack');
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function shuffle(array) {
  for(let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let saiu = false; //Para a busca quando achar a saida.

async function explorarLabirinto(x, y, caminhoAtual) {
  if(saiu) return; 

  if(x < 0 || y < 0 || x >= linhas || y >= colunas) return;
  
  if(labirinto[x][y] === SAIDA) {
    caminhoAtual.push([x,y]);
    marcarVisitado(x,y);
    await delay(50);
    saiu = true;
    return;
  }

  if(labirinto[x][y] === CAMINHO) {
    labirinto[x][y] = VISITADO;
    caminhoAtual.push([x,y]);
    marcarVisitado(x,y);
    await delay(50);

    let direcoes = [ [x+1,y], [x,y+1], [x-1,y], [x,y-1] ];
    shuffle(direcoes);

    for(let [nx, ny] of direcoes) {
      await explorarLabirinto(nx, ny, caminhoAtual);
      if(saiu) break;
    }

    if(!saiu) { //Backtracking, se não achou a saida, ele volta.
      caminhoAtual.pop();
      marcarBacktrack(x,y);
      await delay(100);
      desmarcarVisitado(x,y);
    }
  }
}

renderizarLabirinto();

(async () => {
  await explorarLabirinto(1,1, []);
  if(!saiu) {
    console.log("Nenhum caminho encontrado");
  }
})();

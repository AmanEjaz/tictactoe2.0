const boxesChecked = {};
const boxIds = [];
const diagonal = [];

const getResult = () => {
  let winnerSymbol = null;
  let rows = [];
  let columns = [];
  let diagonal1 = [];
  let diagonal2 = [];
  for (let i = 1; i <= PLAYGROUND_SIZE; i++) {
    let row = [];
    let column = [];
    for (let j = 1; j <= PLAYGROUND_SIZE; j++) {
      if (
        document.getElementById(`box${i}${j}`).innerHTML ||
        document.getElementById(`box${i}${j}`).innerHTML != ""
      ) {
        row.push(document.getElementById(`box${i}${j}`).innerHTML);
      }
      if (
        document.getElementById(`box${j}${i}`).innerHTML ||
        document.getElementById(`box${j}${i}`).innerHTML != ""
      ) {
        column.push(document.getElementById(`box${j}${i}`).innerHTML);
      }
      if (i == j) {
        if (
          document.getElementById(`box${j}${i}`).innerHTML ||
          document.getElementById(`box${j}${i}`).innerHTML != ""
        ) {
          diagonal1.push(document.getElementById(`box${j}${i}`).innerHTML);
        }
      }
      if (i + j === PLAYGROUND_SIZE + 1) {
        if (
          document.getElementById(`box${i}${j}`).innerHTML ||
          document.getElementById(`box${i}${j}`).innerHTML != ""
        ) {
          diagonal2.push(document.getElementById(`box${i}${j}`).innerHTML);
        }
      }
    }
    rows.push(row);
    columns.push(column);
  }

  rows.forEach((row) => {
    if (row.length == PLAYGROUND_SIZE) {
      let symbol = row[0];
      if (row.every((el) => el === symbol)) {
        winnerSymbol = symbol;
      }
    }
  });

  columns.forEach((column) => {
    if (column.length == PLAYGROUND_SIZE) {
      let symbol = column[0];
      if (column.every((el) => el === symbol)) {
        winnerSymbol = symbol;
      }
    }
  });

  if (diagonal1.length == PLAYGROUND_SIZE) {
    let symbol = diagonal1[0];
    if (diagonal1.every((el) => el === symbol)) {
      winnerSymbol = symbol;
    }
  }
  if (diagonal2.length == PLAYGROUND_SIZE) {
    let symbol = diagonal2[0];
    if (diagonal2.every((el) => el === symbol)) {
      winnerSymbol = symbol;
    }
  }
  if (winnerSymbol) {
    document.getElementById("currentPlayer").innerHTML = `${
      players.find((player) => player.selectedSymbol === winnerSymbol).name
    } Won`;
    boxIds.forEach((id) => {
      document.getElementById(id).removeEventListener("click", boxClickHandler);
    });
    const footerText = document.getElementById("started");
    footerText.style.display = "none";
    startButton.innerHTML = "Reset Game";
    startButton.style.display = "block";
    startButton.addEventListener("click", () => {
      location.reload();
    });
  } else {
    if (boxIds.length === Object.values(boxesChecked).flat().length) {
      document.getElementById("currentPlayer").innerHTML = "Draw";
      boxIds.forEach((id) => {
        document
          .getElementById(id)
          .removeEventListener("click", boxClickHandler);
      });
      const footerText = document.getElementById("started");
      footerText.style.display = "none";
      startButton.innerHTML = "Reset Game";
      startButton.style.display = "block";
      startButton.addEventListener("click", () => {
        location.reload();
      });
    }
  }
};

const moveForAI = (isFirstTime = false) => {
  const playerInfo = players.find((player) => player.id === 1);
  if (isFirstTime) {
    const random1 = Math.floor(Math.random() * PLAYGROUND_SIZE + 1);
    const random2 = Math.floor(Math.random() * PLAYGROUND_SIZE + 1);
    const position = document.getElementById(`box${random1}${random2}`);
    position.innerHTML = playerInfo.selectedSymbol;
    position.removeEventListener("click", boxClickHandler);
    boxesChecked[playerInfo.name] = [`box${random1}${random2}`];
  } else {
    const checked = Object.values(boxesChecked).flat();
    const remaining = boxIds.filter((box) => !checked.includes(box));
    if (remaining && remaining.length > 0) {
      const position = document.getElementById(remaining[0]);
      position.innerHTML = playerInfo.selectedSymbol;
      position.removeEventListener("click", boxClickHandler);
      if (!boxesChecked[playerInfo.name]) {
        boxesChecked[playerInfo.name] = [];
      }
      boxesChecked[playerInfo.name].push(remaining[0]);
    }
    getResult();
  }

  const headerText = document.getElementById("currentPlayer");
  headerText.innerHTML = `Next Turn: ${
    players.find((player) => player.id === 2).name
  }`;
};

const boxClickHandler = (event) => {
  const boxId = event.target.id;
  const currentPlayer = document
    .getElementById("currentPlayer")
    .innerHTML.split(":")[1]
    .trim();
  let position = document.getElementById(boxId);
  position.removeEventListener("click", boxClickHandler);
  const headerText = document.getElementById("currentPlayer");

  if (currentPlayer === players.find((player) => player.id === 2).name) {
    const playerInfo = players.find((player) => player.id === 2);
    position.innerHTML = playerInfo.selectedSymbol;
    if (!boxesChecked[playerInfo.name]) {
      boxesChecked[playerInfo.name] = [];
    }
    boxesChecked[playerInfo.name].push(boxId);
    headerText.innerHTML = `Next Turn: ${
      players.find((player) => player.id === 3).name
    }`;
  } else {
    const playerInfo = players.find((player) => player.id === 3);
    position.innerHTML = playerInfo.selectedSymbol;
    if (!boxesChecked[playerInfo.name]) {
      boxesChecked[playerInfo.name] = [];
    }
    boxesChecked[playerInfo.name].push(boxId);
    headerText.innerHTML = `Next Turn: ${
      players.find((player) => player.id === 1).name
    }`;
    moveForAI();
  }
  getResult();
};

const startGame = () => {
  startButton.style.display = "none";
  const footerText = document.getElementById("started");
  footerText.innerHTML = "Game Started";
  for (let i = 1; i <= PLAYGROUND_SIZE; i++) {
    let div = document.createElement("div");
    div.setAttribute("id", `div${i}`);
    for (let j = 1; j <= PLAYGROUND_SIZE; j++) {
      let box = document.createElement("div");
      box.setAttribute("id", `box${j}${i}`);
      boxIds.push(`box${j}${i}`);
      box.setAttribute("class", "box");
      box.addEventListener("click", boxClickHandler);
      div.appendChild(box);
    }
    content.appendChild(div);
  }
  moveForAI(true);
};

if (PLAYGROUND_SIZE < 3 || PLAYGROUND_SIZE > 10) {
  alert(
    "Invalid playground size , minimum 3 and maximum 10 is allowed in which one player will be me."
  );
}
if (
  players.filter(
    (player) =>
      player.selectedSymbol !== null &&
      !AVAILABLE_SYMBOL.includes(player.selectedSymbol)
  ).length > 0
) {
  alert(
    "Invalid symbol selected , please select a capital English alphabet as symbol to continue."
  );
}

const defaultSymbolsPlayers = players.filter(
  (item) => item.selectedSymbol === null
);
if (defaultSymbolsPlayers.length > 0) {
  defaultSymbolsPlayers.forEach((player, index) => {
    if (index === 0) {
      player.selectedSymbol = "O";
    } else {
      player.selectedSymbol = "X";
    }
  });
}

const content = document.getElementById("main");
const startButton = document.getElementById("startBtn");
startButton.addEventListener("click", startGame, { once: true });
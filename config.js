const PLAYGROUND_SIZE = 5;
const AVAILABLE_SYMBOL = Array.from(Array(26))
  .map((e, i) => i + 65)
  .map((x) => String.fromCharCode(x));
const players = [
  {
    id: 1, // fixed
    name: "AI",
    selectedSymbol: "A",
  },
  {
    id: 2, //fixed
    name: "Player 1",
    selectedSymbol: null,
  },
  {
    id: 3, //fixed
    name: "Player 2",
    selectedSymbol: null,
  },
];

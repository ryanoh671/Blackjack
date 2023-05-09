/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

const MSG_LOOKUP = {
  null: 'Good Luck!',
  'P': 'Player Wins!',
  'D': 'Dealer Wins!',
  'PBJ': 'Player Has Blackjack',
  'DBJ': 'Dealer Has Blackjack'
}

const mainDeck = buildMainDeck();




/*----- state variables -----*/
let deck; // shuffled deck
let pHand, dHand; // player and dealer hands (arrays)
let pTotal, dTotal; // best point value of hand
let bank, bet; // bank how much money we have & bet is the amount of the bet
let outcome; // result of the hand (see MSG_LOOKUP)

/*----- cached elements  -----*/
const dealBtn = document.getElementById('deal-btn');
const dealerHandEl = document.getElementById('dealer-hand');
const playerHandEl = document.getElementById('player-hand');
const msgEl = document.getElementById('msg');
const dealerTotalEl = document.getElementById('dealer-sum');
const playerTotalEl = document.getElementById('player-sum');
// const betEl = document.getElementById('bet');
// const bankEl = document.getElementById('bank');


// const dealBtn = document.getElementById('deal-btn') 
// const betBtns = document.querySelectorAll('#bet-controls > button');
// const hitBtn = document.getElementById('hit-btn');
// const standBtn = document.getElementById('stand-btn');

  /*----- event listeners -----*/

  dealBtn.addEventListener('click', handleDeal);
  // hitBtn.addEventListener('click', handleHit);
  // betBtns.addEventListener('click', handleBet);
  // standBtn.addEventListener('click', handleStand);

  // dealbtn.addEventListener('click', handleDeal)
  
  /*----- functions -----*/
  init() 

// function handleStand() {
//   if (pTotal === dTotal) {
//     outcome = 'T';
//   } else if (dTotal > pTotal) {
//     outcome = 'D';
//   } else {
//     outcome = 'P';
//   }
//   settleBet();
//   render();
// }

function init() {
  outcome = null;
  dHand = [];
  pHand = [];
  pTotal = dTotal = 0;
  bank = 1000;
  bet = 0;
  render();
};



function render() {
  renderHands();
  bankEl.innerHTML = bank;
  betEl.innerHTML = bet;
  // renderControls();
  // renderBetBtns();
  msgEl.innerHTML = MSG_LOOPUP[outcome];
};

function renderHands() {
  playerTotalEl.innerHTML = pTotal;
  dealerTotalEl.innerHTML = outcome ? dTotal : '??';
  playerHandEl.innerHTML = pHand.map(card => `<div class="card ${card.face}"><;div>`).join('');
  dealerHandEl.innerHTML = dHand.map((card, idx) => `<div class="card ${idx === 1 && !outcome ? 'back' : card.face}"></div>`).join('');
}

function handleDeal() {
  shuffledDeck = getNewShuffledDeck();
  dHand.push(shuffledDeck.pop(), shuffledDeck.pop())
  pHand.push(shuffledDeck.pop(), shuffledDeck.pop())
  dTotal = getHandTotal(dHand);
  pTotal = getHandTotal(pHand);
  bank -= bet
  if (dTotal === 21 && pTotal === 21) {
    outcome = 'T';
  } else if (dTotal === 21) {
    outcome = 'DBJ';
  } else if (pTotal === 21) {
    outcome = 'PBJ';
  }
  if (outcome) settleBet();
  render();
  };

  function settleBet() {
    if (outcome === 'PBJ') {
    bank += bet + (bet * 1.5);
  } else if (outcome === 'P') {
    bank += bet * 2;
  }
  bet = 0;
}


function getHandTotal(hand) {
  hand.forEach()
    total = 0
    aces = 0
    while (total > 21 && aces) {
      total -= 10 
      aces--
  }

  return total;
}







function buildMainDeck() {
  const deck = [];
  // Use nested forEach to generate card objects
  suits.forEach(function(suit) {
    ranks.forEach(function(rank) {
      deck.push({
        // The 'face' property maps to the library's CSS classes for cards
        face: `${suit}${rank}`,
        // Setting the 'value' property for game of blackjack, not war
        value: Number(rank) || (rank === 'A' ? 11 : 10)
      });
    });
  });
  return deck;
};

function getNewShuffledDeck() {
  //Create a copy of the mainDeck
  const tempDeck = [...mainDeck];
  const newShuffledDeck = [];
  while (tempDeck.length) {
    //Get a random index for a card still in the tempDeck
    const rndIdx = Math.floor(Math.random() * tempDeck.length);
    // Note the [0] after splice - this is because splice always returns an array and we just want the card object in that array
    newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]); 
  }
  return newShuffledDeck;
}

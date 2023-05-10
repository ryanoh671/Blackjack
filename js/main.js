/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

const MSG_LOOKUP = {
  null: 'Good Luck!',
  'P': 'Player Wins!',
  'D': 'Dealer Wins!',
  'PBJ': 'Player Has Blackjack',
  'DBJ': 'Dealer Has Blackjack',
  'T': "It's a Push"
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
const betEl = document.getElementById('bet');
const bankEl = document.getElementById('bank');
const hitBtn = document.getElementById('hit-btn');
const standBtn = document.getElementById('stand-btn');
const betBtns = document.querySelectorAll('#bet-controls > button');
const betControlsEl = document.getElementById('bet-controls');
const bettingControlsEl = document.getElementById('betting-controls');

  /*----- event listeners -----*/

  dealBtn.addEventListener('click', handleDeal);
  document.getElementById('bet-controls').addEventListener('click', handleBet);
  hitBtn.addEventListener('click', handleHit);
  standBtn.addEventListener('click', handleStand);
  
  
  /*----- functions -----*/
  init() 



function init() {
  outcome = null;
  dHand = [];
  pHand = [];
  pTotal = dTotal = 0;
  bank = 1000;
  bet = 0;
  render();
}

function handleBet(evt) {
   const btn = evt.target;
   if (btn.tagName !== 'BUTTON') return;
   const betAmt = parseInt(btn.innerText.replace('$', ''));
   bet += betAmt;
   bank -= betAmt;
   render();
}

function handleDeal() {
  outcome = null;
  shuffledDeck = getNewShuffledDeck();
  dHand = [];
  pHand = [];
  dHand.push(shuffledDeck.pop(), shuffledDeck.pop())
  pHand.push(shuffledDeck.pop(), shuffledDeck.pop())
  dTotal = getHandTotal(dHand);
  pTotal = getHandTotal(pHand);
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
  } else if (outcome === 'T') {
    bank += bet;
  }
  bet = 0;
}

function handleHit() {
  pHand.push(shuffledDeck.pop());
  pTotal = getHandTotal(pHand);
  if (pTotal > 21) {
    outcome = 'D';
    settleBet();
  }
  render();
}


function handleStand() {
    if (pTotal === dTotal) {
      outcome = 'T';
    } else if (dTotal > pTotal) {
      outcome = 'D';
    } else {
      outcome = 'P';
    }
    settleBet();
    render();
  };


function render() {
  renderHands();
  bankEl.innerHTML = bank;
  betEl.innerHTML = bet;
  renderControls();
  renderBetBtns();
  msgEl.innerHTML = MSG_LOOKUP[outcome];
};

function renderBetBtns() {
  betBtns.forEach(function(btn) {
    const btnAmt = parseInt(btn.innerText.replace('$', ''));
    btn.disabled = btnAmt > bank;  
  });
  // bettingControlsEl.style.backgroundColor = "lightgreen";
  bettingControlsEl.style.backgroundColor = !handInPlay() ? 'white' : '';
}
function handInPlay() {
  return pHand.length && !outcome;
}

function renderControls() {
 betControlsEl.style.visibility = handInPlay() ? 'hidden' : 'visible';
 dealBtn.style.visibility = bet >= 50 && !handInPlay() ? 'visible' : 'hidden';
}

function renderHands() {
  playerTotalEl.innerHTML = pTotal;
  dealerTotalEl.innerHTML = outcome ? dTotal : '??';
  playerHandEl.innerHTML = pHand.map(card => `<div class="card large ${card.face}"></div>`).join('');
  dealerHandEl.innerHTML = dHand.map((card, idx) => `<div class="card large ${idx === 1 && !outcome ? 'back' : card.face}"></div>`).join('');
}

function getHandTotal(hand) {
    let total = 0;
    let aces = 0;
    hand.forEach(function(card) {
      total += card.value;
      if (card.value === 11) aces++;
    });
    while (total > 21 && aces) {
      total -= 10;
      aces--;
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

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
const audio1 = new Audio("css/sound-effects/cash.mp3");
audio1.volume=.1;
const cashButtons = document.querySelectorAll("#bet-controls > button");
const audio2 = new Audio("css/sound-effects/deal.mp3");
const dealBtnAudio = document.getElementById('deal-btn');
const audio3 = new Audio("css/sound-effects/hit.mp3");
const hitBtnAudio = document.getElementById('hit-btn');
const audio4 = new Audio("css/sound-effects/stand.wav");
audio4.volume=.1;
const standBtnAudio = document.getElementById('stand-btn');

/*----- state variables -----*/
let deck; // shuffled deck
let pHand, dHand; // player and dealer hands (arrays)
let pTotal, dTotal; // best point value of hand
let bank, bet; // bank how much money we have & bet is the amount of the bet
let outcome; // result of the hand (see MSG_LOOKUP)
let dealersTurn;

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
const playBtns = document.querySelectorAll("#play-btns > button");
const finalMsgEl = document.getElementById('final-msg');

/*----- event listeners -----*/
  dealBtn.addEventListener('click', handleDeal);
  document.getElementById('bet-controls').addEventListener('click', handleBet);
  hitBtn.addEventListener('click', handleHit);
  standBtn.addEventListener('click', handleStand);
  
  /*----- functions -----*/
init() 

function init() {
  outcome = null;
  dealersTurn = false;
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
  dealersTurn = false;
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
    dealersTurn = true;
  } else if (pTotal === 21) {
    outcome = 'PBJ';
  }
  if (outcome) settleBet();
  render();
  };
  
  function settleBet() {
    if (outcome === 'PBJ') {
    bank += bet + (bet * 1.5);
    bet = 0;
  } else if (outcome === 'P') {
    bank += (bet * 2);
    bet = 0;
  } else if (outcome === 'T') {
    bank += bet;
    bet = 0;
  } else if (outcome === 'D') {
    bet = 0;
  } else if (outcome === 'DBJ') {
    bet = 0;
  }
}

function handleHit() {
  pHand.push(shuffledDeck.pop());
  pTotal = getHandTotal(pHand);
  if (pTotal > 21) {
    dealersTurn = 'true';
    outcome = 'D';
    bet = 0;
  } else if (pTotal === 21) {
    outcome = 'PBJ';
    bet = 0;
  };

  settleBet();
  render();
}

function handleStand() {
  dealerPlay(function () {
    if (pTotal === dTotal) {
      outcome = 'T';
    } else if (dTotal === 21) {
      outcome = 'DBJ'
    } else if (dTotal > 21) {
      outcome = 'P'
    } else if (dTotal < pTotal) {
      outcome = 'P'
    } else {
      outcome = 'D';
    }
    settleBet();
    render();
  });
  }

function dealerPlay(cb) {
  dealersTurn = true;
  renderHands();
    setTimeout(function() {
      if (dTotal < 17) {
        dHand.push(shuffledDeck.pop());
        dTotal = getHandTotal(dHand);
        dealerPlay(cb);
      } else {
        cb();
      }
    }, 1000);
}

function render() {
  renderHands();
  bankEl.innerHTML = bank;
  betEl.innerHTML = bet;
  renderControls();
  renderBetBtns();
  msgEl.innerHTML = MSG_LOOKUP[outcome];
  renderFinalMsg();
};

function renderBetBtns() {
  betBtns.forEach(function(btn) {
    const btnAmt = parseInt(btn.innerText.replace('$', ''));
    btn.disabled = btnAmt > bank;  
  });
}
function handInPlay() {
  return pHand.length && !outcome;
}

function renderControls() {
  betControlsEl.style.visibility = handInPlay() ? 'hidden' : 'visible';
  dealBtn.style.visibility = bet >= 50 && !handInPlay() ? 'visible' : 'hidden';
  msgEl.style.visibility = handInPlay() ? 'hidden' : 'visible';
  if (outcome) {
    hitBtn.disabled = true;
    standBtn.disabled = true;
  } else {
    hitBtn.disabled = false;
    standBtn.disabled = false;
  }
}

function renderHands() {
  playerTotalEl.innerHTML = pTotal;
  dealerTotalEl.innerHTML = outcome ? dTotal : '??';
  playerHandEl.innerHTML = pHand.map(card => `<div class="card large ${card.face}"></div>`).join('');
  dealerHandEl.innerHTML = dHand.map((card, idx) => `<div class="card large ${idx === 1 && !dealersTurn ? 'back' : card.face}"></div>`).join('');
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
  suits.forEach(function(suit) {
    ranks.forEach(function(rank) {
      deck.push({
        face: `${suit}${rank}`,
        value: Number(rank) || (rank === 'A' ? 11 : 10)
      });
    });
  });
  return deck;
};

function getNewShuffledDeck() {
  const tempDeck = [...mainDeck];
  const newShuffledDeck = [];
  while (tempDeck.length) {
    const rndIdx = Math.floor(Math.random() * tempDeck.length);
    newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]); 
  }
  return newShuffledDeck;
}

cashButtons.forEach(cashButton => {
  cashButton.addEventListener('click', () => {
      audio1.play(); 
      audio1.currentTime = 0
    });
  });

dealBtnAudio.addEventListener('click', () => {
  audio2.play();
  audio2.currentTime = 0
});

hitBtnAudio.addEventListener('click', () => {
  audio3.play();
  audio3.currentTime = 0
});

standBtnAudio.addEventListener('click', () => {
  audio4.play();
  audio4.currentTime = 0
});

function renderFinalMsg() {
  if ((bet === 0) && (bank === 0)) {
    finalMsgEl.innerHTML = "GAMEOVER - Player Is Out of $$";
    finalMsgEl.style.color = 'RED';
  }
}

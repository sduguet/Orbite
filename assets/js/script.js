const body = document.querySelector('body');
const tuiles = document.querySelectorAll('.terrain .tuile');
const btnNextTurn = document.querySelector('.nextTurn');
const manaNode = document.querySelector('.br .mana');
const infoOvered = document.querySelector('.infoOvered');
const popupStart = document.querySelector('.start');
const bntStart = popupStart.querySelector('.start__btn');
const popupOffrande = document.querySelector('.offrande');
const popupOffrandeBtn = popupOffrande.querySelector('.offrande__btn');
const popupRecap = document.querySelector('.recap');
const popupRecapBtn = popupRecap.querySelector('.recap__btn');
const popupRecapNbManche = popupRecap.querySelector('.nbManche');
const popupRecapObjectif = popupRecap.querySelector('.objectif');
const popupEnd = document.querySelector('.end');
const popupEndBtnNext = popupEnd.querySelector('.end__btn--next');
const popupEndBtnHome = popupEnd.querySelector('.end__btn--home');
const nbCardsInHandNode = document.querySelector('.data__handNb');
const nbCardsInDeckNode = document.querySelector('.data__deckNb');

let history;
let playerHand;
let playerDeck;
let playerMana;
let selectedCardNode;
let currentTurn;
let nbTurnMax;
let startingCardsChosen;
let manaBonus;
let manaMaxBonus;
let tuilesDestroyToReset;
let btnCd;
let spaceCd;
let offrandeChoiceAdd;
let offrandeChoiceDelete;
let nbManche;
let currentStar;
let pointsToScore;
let deckAdd;
let deckRemove;
let maxCardsInHand;
let listPwrDestroyInRound;
let wasShivaDestroyedLastTurn;
let wasCerbereDestroyedLastTurn;
let youLose;

Init();
function Init() {
    document.querySelector('.home__version').innerHTML = `v ${VERSION}`;

    tuiles.forEach(tuile => {
        tuile.addEventListener('click', SelectTuile);
        tuile.addEventListener('mouseover', OverTuile);
        tuile.addEventListener('mouseleave', LeaveTuile);
    });

    window.addEventListener('keypress', Keypress);
    btnNextTurn.addEventListener('click', NextTurn);
    bntStart.addEventListener('click', InitializationGame);
    popupOffrandeBtn.addEventListener('click', OffrandeAction);
    popupRecapBtn.addEventListener('click', ShowDeck);
    popupEndBtnNext.addEventListener('click', NextManche);
    popupEndBtnHome.addEventListener('click', GoHome);

    InitLocalStorage();
    UpdateCollection();
    InitChangeDeck();
    InitFilters();
    InitNavigation();
    UpdateHomeStats();
}


function ClearTuiles() {
    tuiles.forEach(tuile => ClearOneTuile(tuile));
}


function ClearOneTuile(tuileNode) {
    tuileNode.innerHTML = `
        <svg class="tuile__bg" viewBox="0 0 100 88" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.5571 3.19824C24.4503 1.65123 26.1009 0.698242 27.8872 0.698242L72.1137 0.698242C73.9001 0.698242 75.5507 1.65124 76.4439 3.19824L98.5571 41.4995C99.4503 43.0465 99.4503 44.9525 98.5571 46.4995L76.4439 84.8008C75.5507 86.3478 73.9001 87.3008 72.1137 87.3008L27.8872 87.3008C26.1009 87.3008 24.4503 86.3478 23.5571 84.8008L1.44386 46.4995C0.5507 44.9525 0.550701 43.0465 1.44386 41.4995L23.5571 3.19824Z" fill="rgba(255, 255, 255, .2)"/>
        </svg>
        <div class="tuile__content"></div>
    `;
}


function GetAllNeighbors(currentTuileNode) {
    const allNeighborsNode = [];
    const allNeighborsId = currentTuileNode.dataset.neighbors.split('');

    allNeighborsId.forEach(neighborId => {
        const neighborNode = document.querySelector(`.tuile[data-id="${neighborId}"] .tuile__content`);
        allNeighborsNode.push(neighborNode);
    })

    return allNeighborsNode;
}


function clearNeighborClass() {
    document.querySelectorAll('.tuile--neighbor').forEach(t => t.classList.remove('tuile--neighbor'));
}


function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function SetPlayerDeck() {
    startingCardsChosen.forEach(cardId => {
        const originalCard = ALL_CARDS.find(card => card.id === cardId);
        playerDeck.push(deepClone(originalCard));
    });

    if (playerDeck.find(c => c.id === '072')) {
        ['073', '074', '075', '076'].forEach(id => {
            playerDeck.push(deepClone(ALL_CARDS.find(c => c.id === id)));
        });
    }

    if (playerDeck.find(c => c.id === '077')) {
        ['078', '079', '080', '081', '082', '083'].forEach(id => {
            playerDeck.push(deepClone(ALL_CARDS.find(c => c.id === id)));
        });
    }
}


function SetPlayerHand() {
    playerHand = [];

    const proximaB = playerDeck.find(card => card.id === '029');
    if (proximaB) {
        playerDeck = playerDeck.filter(card => card.id !== '029');
        playerHand.push(deepClone(proximaB));
    }

    while (playerHand.length < 3) {
        DrawCard();
    }
}


function DrawCard() {
    if (playerDeck.length > 0 && playerHand.length < maxCardsInHand) {
        let randomIndex = randomBetween(0, playerDeck.length - 1);

        let infinity = 0;
        while ((playerDeck[randomIndex].id === '030' || playerDeck[randomIndex].id === '031') && infinity <= 100) {
            randomIndex = randomBetween(0, playerDeck.length - 1);
            infinity += 1;
        }

        const [drawnCard] = playerDeck.splice(randomIndex, 1);
        playerHand.push(deepClone(drawnCard));

        HtmlCards();
    }
}


function HtmlCards() {
    const handNode = document.querySelector('.hand');

    const wasWavePlayedLastTurn = history[currentTurn - 1]?.includes('040') ?? false;
    const muaraeE = document.querySelector('.tuile__content[data-card="042"]');

    playerHand.forEach(card => {
        const originalCard = ALL_CARDS.find(c => c.id === card.id);

        // Mana processing
        let finalMana = card.mana;
        if (muaraeE && !muaraeE.classList.contains('destroyed') && finalMana > 1) finalMana -= 1;
        if (wasWavePlayedLastTurn) finalMana = Math.min(finalMana, 4);

        const cardNode = handNode.querySelector(`.card[data-id="${card.id}`);
        if (cardNode) {
            const cardMana = cardNode.querySelector('.card__mana');
            cardMana.classList.remove('card__mana--up', 'card__mana--down');
            cardMana.classList.toggle('card__mana--up', finalMana > originalCard.mana);
            cardMana.classList.toggle('card__mana--down', finalMana < originalCard.mana);
            cardMana.innerHTML = finalMana;

            const cardPwr = cardNode.querySelector('.card__pwr');
            if (cardPwr) {
                cardPwr.classList.remove('card__pwr--up', 'card__pwr--down');
                cardPwr.classList.toggle('card__pwr--up', card.pwr > originalCard.pwr);
                cardPwr.classList.toggle('card__pwr--down', card.pwr < originalCard.pwr);
                cardPwr.innerHTML = card.pwr;
            }

            // 071 : Negative
            if (card.negative) cardNode.classList.add('card--negative', card.negative);
            else cardNode.classList.remove('card--negative', card.negative);
        } else {
            const div = document.createElement('div');
            div.classList.add('card');
            div.dataset.id = card.id;
            div.innerHTML = `
                <p class="card__mana ${finalMana > originalCard.mana ? 'card__mana--up' : finalMana < originalCard.mana ? 'card__mana--down' : ''}">${finalMana}</p>
                ${card.pwr || card.pwr === 0 ? `<p class="card__pwr ${card.pwr > originalCard.pwr ? 'card__pwr--up' : card.pwr < originalCard.pwr ? 'card__pwr--down' : ''}">${card.pwr}</p>` : ''}
                <img class="card__img" src="./assets/img/cards/${card.id}.png">
            `;
            // 071 : Negative
            if (card.negative) div.classList.add('card--negative');

            handNode.appendChild(div);
            div.addEventListener('click', SelectCard);
            div.addEventListener('mousedown', DragAnimation);

            if (document.querySelector('.start.hide')) {
                div.style.opacity = '0';
                div.style.transform = 'translate(100px, 100px)';

                setTimeout(() => {
                    div.style.opacity = '1';
                    div.style.transform = 'translate(0, 0)';
                }, 100);
            }
        }
    });

    const cardsNode = handNode.querySelectorAll('.card');
    cardsNode.forEach(card => {
        if (!playerHand.some(item => item.id === card.dataset.id)) {
            card.remove();
        }
    });

    nbCardsInHandNode.innerHTML = playerHand.length;
    nbCardsInDeckNode.innerHTML = playerDeck.length;
}


function DragAnimation(e) {
    const cardDragged = this;

    cardDragged.classList.add('dragged');
    cardDragged.dataset.oldX = e.clientX;
    cardDragged.dataset.originX = e.clientX;
    cardDragged.dataset.originY = e.clientY;
    cardDragged.dataset.scale = 1;
    cardDragged.dataset.rotate = 0;

    document.onmousemove = Drag;
    document.onmouseup = Drop;
}


function Drag(e) {
    const cardDragged = document.querySelector('.dragged');
    const currentScale = parseFloat(cardDragged.dataset.scale);
    const currentRotate = parseFloat(cardDragged.dataset.rotate);
    const scale = Math.max(currentScale - 0.02, .5);
    const rotate = e.clientX > parseInt(cardDragged.dataset.oldX)
        ? Math.min(currentRotate + 0.08, 6)
        : Math.max(currentRotate - 0.08, -6);

    cardDragged.dataset.oldX = e.clientX;
    cardDragged.dataset.scale = scale;
    cardDragged.dataset.rotate = rotate;
    cardDragged.setAttribute(
        'style',
        `
            transition: none;
            transform: translate(${e.clientX - parseInt(cardDragged.dataset.originX)}px, ${e.clientY - parseInt(cardDragged.dataset.originY) - 118}px) rotate(${rotate}deg) scale(${scale}) !important;
        `
    );

    document.querySelector('.tuile--hover')?.classList.remove('tuile--hover')

    tuiles.forEach(tuile => {
        const rect = tuile.getBoundingClientRect();

        if (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
        ) {
            tuile.classList.add('tuile--hover');
        }
    });
}


function Drop() {
    const cardDragged = document.querySelector('.dragged');

    const selectedTuile = document.querySelector('.tuile--hover');
    if (selectedTuile) {
        selectedCardNode = cardDragged;
        selectedTuile.classList.remove('tuile--hover');
        SelectTuile(selectedTuile);
    }

    cardDragged.classList.remove('dragged');
    cardDragged.setAttribute('style', '');

    setTimeout(() => {
        cardDragged.style.transform = `translate(0px, 0px) rotate(0deg)`;
    }, 10);

    document.onmousemove = null;
    document.onmouseup = null;
}


function SelectCard() {
    selectedCardNode = this;

    const oldSelectedCard = document.querySelector('.card--selected');
    oldSelectedCard?.classList.remove('card--selected');
    if (oldSelectedCard !== selectedCardNode) selectedCardNode.classList.add('card--selected');

    if (!selectedCardNode.classList.contains('card--selected')) selectedCardNode = null;
}


function NextTurn() {
    if ((Date.now() - btnCd) < 1000) return;

    if (youLose) End();

    if (currentTurn !== 0) PowerEndOfTurn();

    if (currentTurn === nbTurnMax) {
        End();
    } else {
        currentTurn += 1;
        playerMana = currentTurn + manaBonus + manaMaxBonus;
        manaBonus = 0;

        const proximaC = playerDeck.find(card => card.id === '030');
        const proximaD = playerDeck.find(card => card.id === '031');
        if (playerHand.length < maxCardsInHand) {
            if (currentTurn === 2 && proximaC) {
                playerDeck = playerDeck.filter(card => card.id !== proximaC.id);
                playerHand.push(deepClone(proximaC));
                HtmlCards();
            } else if (currentTurn === 6 && proximaD) {
                playerDeck = playerDeck.filter(card => card.id !== proximaD.id);
                playerHand.push(deepClone(proximaD));
                HtmlCards();
            } else {
                DrawCard();
            }
        }

        PowerBeginningTurn();

        btnNextTurn.dataset.front = `${currentTurn}/${nbTurnMax}`
        manaNode.innerHTML = playerMana;
    }

    btnCd = Date.now();
}


function SelectTuile(t) {
    const tuile = this?.classList?.contains('tuile')
        ? this
        : t;

    if (tuile.dataset.id === 'J' || tuile.querySelector('[data-card]')) return;

    if (selectedCardNode) {
        const selectedCard = playerHand.filter(card => card.id === selectedCardNode.dataset.id)[0];

        // Mana processing
        const wasWavePlayedLastTurn = history[currentTurn - 1]?.includes('040') ?? false;
        const muaraeE = document.querySelector('.tuile__content[data-card="042"]');
        let selectedCardMana = selectedCard.mana;
        if (muaraeE && !muaraeE.classList.contains('destroyed') && selectedCardMana > 1) selectedCardMana -= 1;
        if (wasWavePlayedLastTurn) selectedCardMana = Math.min(selectedCard.mana, 4);

        const blockByElectro = history[currentTurn] && history[currentTurn]?.length >= 1 && document.querySelector('.tuile__content[data-card="041"]');

        if (selectedCardMana <= playerMana) {
            if (
                (selectedCard.id === '020' && history[currentTurn - 1]) ||
                blockByElectro ||
                (selectedCard.id === '049' && currentTurn > 3) ||
                tuile.querySelector('.tuile__content').classList.contains('obstructed')
            ) {
                // Animation
                if (blockByElectro) {
                    const muaraeDHexa = document.querySelector('.tuile:has(.tuile__content[data-card="041"]) .tuile__hexa');
                    muaraeDHexa.style.filter = 'brightness(2)';
                    setTimeout(() => { muaraeDHexa.style.filter = 'brightness(.6)'; }, 200);
                    setTimeout(() => { muaraeDHexa.style.filter = 'brightness(1.5)'; }, 600);
                    setTimeout(() => { muaraeDHexa.style.removeProperty('filter'); }, 950);
                }
                return;
            } else {
                RevealCard(tuile);
            }
        }
    }
}


function OverTuile() {
    const tuileOverred = this;
    const tuileOverredContent = tuileOverred.querySelector('.tuile__content');
    const infoOveredPwr = infoOvered.querySelector('.infoOvered__pwr');
    const infoOveredMana = infoOvered.querySelector('.infoOvered__mana');

    if (tuileOverred.classList.contains('tuile--sun')) {
        const card = STARS.find(card => card.id === tuileOverredContent.dataset.card);
        const infoOveredImg = infoOvered.querySelector('.infoOvered__img');
        infoOveredImg.src = `./assets/img/cards/stars/${card.id}.png`;

        infoOveredPwr.classList.add('hide');
        infoOveredMana.classList.add('hide');

        infoOvered.style.opacity = 1;
    } else if (tuileOverredContent.dataset.card) {
        const card = ALL_CARDS.find(card => card.id === tuileOverredContent.dataset.card);
        const infoOveredImg = infoOvered.querySelector('.infoOvered__img');
        infoOveredImg.src = `./assets/img/cards/${card.id}.png`;

        infoOveredMana.innerHTML = card.mana;
        infoOveredMana.classList.remove('hide');

        if (card.pwr || card.pwr === 0) {
            infoOveredPwr.innerHTML = card.pwr;
            infoOveredPwr.classList.remove('hide');
        } else {
            infoOveredPwr.classList.add('hide');
        }

        infoOvered.style.opacity = 1;
    }
}


function LeaveTuile() {
    infoOvered.style.opacity = 0;
}


function RevealCard(tuileNode) {
    const tuileContent = tuileNode.querySelector('.tuile__content');
    const selectedCard = playerHand.find(card => card.id === selectedCardNode.dataset.id);

    // Mana processing
    const wasWavePlayedLastTurn = history[currentTurn - 1]?.includes('040') ?? false;
    const muaraeE = document.querySelector('.tuile__content[data-card="042"]');
    if (muaraeE && !muaraeE.classList.contains('destroyed') && selectedCard.mana > 1) selectedCard.mana -= 1;
    if (wasWavePlayedLastTurn) selectedCard.mana = Math.min(selectedCard.mana, 4);

    playerMana -= selectedCard.mana;
    manaNode.innerHTML = playerMana;

    SetHtmlInHexagon(tuileContent, selectedCard)

    const cardIndexInPlayerHand = playerHand.findIndex(card => card.id === selectedCard.id);
    if (cardIndexInPlayerHand !== -1) playerHand.splice(cardIndexInPlayerHand, 1);
    HtmlCards();

    RevealPower(tuileNode, selectedCard);

    if (!history[currentTurn]) history[currentTurn] = [];
    history[currentTurn].push(selectedCard.id);

    selectedCardNode = '';
    UpdateCurrentAllPointsScored();
}


function SetHtmlInHexagon(tuileContent, card) {
    tuileContent.dataset.card = card.id;
    tuileContent.dataset.type = card.type;

    if ((card.type === TYPES[0] || card.type === TYPES[3]) && (card.pwr || card.pwr === 0)) {
        tuileContent.dataset.pwr = card.pwr;
        const originalPwr = ALL_CARDS.find(c => c.id === card.id).pwr;
        tuileContent.innerHTML = `<p class="tuile__pwr ${originalPwr < card.pwr ? 'tuile__pwr--up' : originalPwr > card.pwr ? 'tuile__pwr--down' : ''}">${card.pwr}</p>`;
    }

    const tuileHexa = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    tuileHexa.setAttribute('class', 'tuile__hexa');
    tuileHexa.setAttribute('viewBox', '0 0 100 88');
    tuileHexa.setAttribute('fill', 'none');
    if (card.negative) tuileHexa.classList.add('tuile__hexa--negative');

    const prefix = card.type === TYPES[3] ? 'stars/' : '';

    tuileHexa.innerHTML = `
        <defs>
            <pattern id="imagePattern${tuileContent.parentNode.dataset.id}" patternUnits="userSpaceOnUse" width="100" height="242">
                <image href="./assets/img/cards/${prefix}${card.id}.png" width="100" height="242" x="0" y="-43" preserveAspectRatio="xMidYMid slice"/>
            </pattern>
        </defs>
        <path d="M23.5571 3.19824C24.4503 1.65123 26.1009 0.698242 27.8872 0.698242L72.1137 0.698242C73.9001 0.698242 75.5507 1.65124 76.4439 3.19824L98.5571 41.4995C99.4503 43.0465 99.4503 44.9525 98.5571 46.4995L76.4439 84.8008C75.5507 86.3478 73.9001 87.3008 72.1137 87.3008L27.8872 87.3008C26.1009 87.3008 24.4503 86.3478 23.5571 84.8008L1.44386 46.4995C0.5507 44.9525 0.550701 43.0465 1.44386 41.4995L23.5571 3.19824Z" fill="url(#imagePattern${tuileContent.parentNode.dataset.id})"/>
    `;

    tuileContent.parentNode.insertBefore(tuileHexa, tuileContent);
}


function GetLastCardPlayed() {
    const rounds = Object.keys(history).sort((a, b) => b - a);

    for (const round of rounds) {
        const cards = history[round];
        if (cards.length > 0) {
            return cards[cards.length - 1];
        }
    }

    return null;
}


function RevealPower(tuileNode, cardRevealed) {
    const localDex = JSON.parse(localStorage.getItem('dex')) || {};
    const neighborsNode = GetAllNeighbors(tuileNode);
    const lastCardPlayed = GetLastCardPlayed() ? ALL_CARDS.find(card => card.id === GetLastCardPlayed()) : null;
    const allPlanetsOnBoard = Array.from(document.querySelectorAll(`.terrain .tuile__content[data-type="${TYPES[0]}"]`));
    let tuileContent = tuileNode.querySelector('.tuile__content');

    const blackHole = document.querySelector('.tuile--sun [data-card="016"]');
    if (blackHole && cardRevealed.type === TYPES[0]) {
        neighborsNode.forEach(neighborNode => {
            if (neighborNode.dataset.card === '016') AddToTuile(tuileContent, -2);
        });
    }
    // ---
    if (cardRevealed.type === TYPES[0] && lastCardPlayed && lastCardPlayed.id === '019') {
        AddToTuile(tuileContent, 2);
    }
    if (tuileContent.classList.contains('waitingNeptune')) {
        const neptune = document.querySelector('.tuile__content[data-card="024"]');
        if (neptune) {
            neptune.dataset.valid = false;
            document.querySelectorAll('.waitingNeptune').forEach(w => w.classList.remove('waitingNeptune'));
        }
    }
    const trappist1B = document.querySelector('.tuile__content[data-card="032"]');
    if (
        tuileContent.classList.contains('waitingTRAPPIST1B') &&
        trappist1B &&
        parseInt(trappist1B.dataset.turn) === (currentTurn - 1) &&
        cardRevealed.type === TYPES[1]
    ) {
        AddToTuile(trappist1B, 3);
        document.querySelectorAll('.waitingTRAPPIST1B').forEach(x => x.classList.remove('waitingTRAPPIST1B'));
    }
    let hecate = document.querySelector('.tuile__content[data-card="045"]');
    if (hecate && cardRevealed.type === TYPES[0]) {
        neighborsNode.forEach(neighborNode => {
            if (neighborNode.dataset.card === '045') AddToTuile(tuileContent, -4);
        });
    }
    if (cardRevealed.type === TYPES[0] && lastCardPlayed && lastCardPlayed.id === '051') {
        const initialPwr = parseInt(tuileContent.dataset.pwr);
        AddToTuile(tuileContent, initialPwr);
    }
    if (tuileContent.classList.contains('waitingPhoebe')) {
        const phoebe = document.querySelector('.tuile__content[data-card="058"]');
        if (phoebe) {
            phoebe.dataset.valid = false;
            document.querySelectorAll('.waitingPhoebe').forEach(w => w.classList.remove('waitingPhoebe'));
        }
    }

    switch (cardRevealed.id) {
        case '009':
            neighborsNode.forEach(neighborNode => {
                const neighborCard = ALL_CARDS.find(card => card.id === neighborNode.dataset.card);
                if (
                    neighborCard &&
                    neighborCard.type === TYPES[0] &&
                    neighborCard.element.includes(ELEMENTS[0])
                ) {
                    AddToTuile(neighborNode, 6);
                }
            });
            break;

        case '010':
            neighborsNode.forEach(neighborNode => {
                const neighborCard = ALL_CARDS.find(card => card.id === neighborNode.dataset.card);
                if (
                    neighborCard &&
                    neighborCard.type === TYPES[0] &&
                    neighborCard.element.includes(ELEMENTS[1])
                ) {
                    AddToTuile(neighborNode, 4);
                }
            });
            break;

        case '011':
            neighborsNode.forEach(neighborNode => {
                const neighborCard = ALL_CARDS.find(card => card.id === neighborNode.dataset.card);
                if (
                    neighborCard &&
                    neighborCard.type === TYPES[0] &&
                    neighborCard.element.includes(ELEMENTS[2])
                ) {
                    AddToTuile(neighborNode, 3);
                }
            });
            break;

        case '012':
            neighborsNode.forEach(neighborNode => {
                const neighborCard = ALL_CARDS.find(card => card.id === neighborNode.dataset.card);
                if (
                    neighborCard &&
                    neighborCard.type === TYPES[0] &&
                    neighborCard.element.includes(ELEMENTS[3])
                ) {
                    AddToTuile(neighborNode, 2);
                }
            });
            break;

        case '013':
            neighborsNode.forEach(neighborNode => {
                const neighborCard = ALL_CARDS.find(card => card.id === neighborNode.dataset.card);
                if (
                    neighborCard &&
                    neighborCard.type === TYPES[0] &&
                    neighborCard.nature === NATURES[0]
                ) {
                    AddToTuile(neighborNode, 7);
                }
            });
            break;

        case '014':
            neighborsNode.forEach(neighborNode => {
                const neighborCard = ALL_CARDS.find(card => card.id === neighborNode.dataset.card);
                if (
                    neighborCard &&
                    neighborCard.type === TYPES[0] &&
                    neighborCard.nature === NATURES[1]
                ) {
                    AddToTuile(neighborNode, 5);
                }
            });
            break;

        case '015':
            neighborsNode.forEach(neighborNode => {
                if (neighborNode.parentNode.classList.contains('tuile--sun')) {
                    AddToTuile(tuileContent, 3);
                }
            });
            break;

        case '016':
            const allPlanetsOnBoardExecptVenus = Array.from(document.querySelectorAll(`.tuile__content[data-type="${TYPES[0]}"]:not([data-card="016"])`));
            let i = 0;

            while (i < 2 && allPlanetsOnBoardExecptVenus.length > 0) {
                const randomIndex = randomBetween(0, allPlanetsOnBoardExecptVenus.length - 1);
                const planetPicked = allPlanetsOnBoardExecptVenus.splice(randomIndex, 1)[0];
                AddToTuile(planetPicked, 3);

                i += 1;
            }
            break;

        case '017':
            playerDeck.push(deepClone(ALL_CARDS.find(card => card.id === '018')));
            nbCardsInDeckNode.innerHTML = playerDeck.length;

            if (!localDex.allCards.find(c => c.id === '018').found) {
                localDex.allCards.find(c => c.id === '018').found = Date.now();
                localStorage.setItem('dex', JSON.stringify(localDex));
            }
            break;

        case '018':
            neighborsNode.forEach(neighborNode => {
                if (neighborNode.dataset.card === '017') {
                    AddToTuile(neighborNode, 6);
                }
            });
            break;

        case '021':
            const voidNeighbors = [];
            neighborsNode.forEach(neighborNode => {
                if (
                    !neighborNode.dataset.card &&
                    !neighborNode.classList.contains('obstructed') &&
                    !neighborNode.parentNode.classList.contains('tuile--sun')
                ) {
                    voidNeighbors.push(neighborNode);
                }
            });

            let nbAsteroids = randomBetween(2, 5);
            while (nbAsteroids > 0 && voidNeighbors.length > 0) {
                const randomIndex = randomBetween(0, voidNeighbors.length - 1);
                const voidHexagon = voidNeighbors.splice(randomIndex, 1)[0];

                SetHtmlInHexagon(voidHexagon, ALL_CARDS.find(card => card.id === '022'));
                nbAsteroids -= 1;
            }
            break;

        case '023':
            const allPlanetsOnBoardExecptUranus = document.querySelectorAll(`.tuile__content[data-type="${TYPES[0]}"]:not([data-card="023"])`);
            allPlanetsOnBoardExecptUranus.forEach(planet => AddToTuile(planet, 1));
            break;

        case '024':
            tuileContent.dataset.valid = 'true';
            neighborsNode.forEach(neighborNode => {
                if (!neighborNode.dataset.card) neighborNode.classList.add('waitingNeptune');
            });
            break;

        case '026':
            const allPlanetsOnBoardExecptEris = Array.from(document.querySelectorAll(`.tuile__content[data-type="${TYPES[0]}"][data-card]:not([data-card="026"]):not([data-card="117"])`));
            const randomIndex = randomBetween(0, allPlanetsOnBoardExecptEris.length - 1);
            if (allPlanetsOnBoardExecptEris[randomIndex].dataset.card) {
                allPlanetsOnBoardExecptEris[randomIndex].classList.add('destroyed');
                tuilesDestroyToReset.push(allPlanetsOnBoardExecptEris[randomIndex].parentNode.dataset.id);
            }
            break;

        case '027':
            if (lastCardPlayed) {
                const lastCardPlayedNode = document.querySelector(`.tuile__content[data-card="${lastCardPlayed.id}"]`)
                let lastCardPlayedActualPower = lastCardPlayedNode.dataset.pwr ? parseInt(lastCardPlayedNode.dataset.pwr) : 0;

                if (currentStar === '007') lastCardPlayedActualPower += 2;
                else if (currentStar === '009') lastCardPlayedActualPower -= 2;
                else if (currentStar === '004') lastCardPlayedActualPower += 3;
                else if (currentStar === '021') lastCardPlayedActualPower -= 3;

                tuileContent.dataset.pwr = lastCardPlayedActualPower;
                tuileContent.querySelector('.tuile__pwr').innerHTML = tuileContent.dataset.pwr;
            }
            break;

        case '028':
            tuileContent.dataset.keplerboostapply = 'false';
            break;

        case '032':
            tuileContent.dataset.turn = currentTurn;
            neighborsNode.forEach(neighborNode => {
                if (!neighborNode.dataset.card) neighborNode.classList.add('waitingTRAPPIST1B');
            });
            break;

        case '033':
            playerDeck.forEach(cardinDeck => {
                if (cardinDeck.type === TYPES[0]) cardinDeck.pwr += 2;
            });
            break;

        case '035':
            setTimeout(() => {
                DrawCard();

                setTimeout(() => {
                    DrawCard();
                }, 500);
            }, 100);
            break;

        case '036':
            tuileContent.dataset.claimed = false;
            break;

        case '039':
            manaBonus += 1;
            break;

        case '041':
            manaMaxBonus += 1;
            break;

        case '043':
            neighborsNode.forEach(neighborNode => {
                if (!neighborNode.parentNode.classList.contains('tuile--sun')) {
                    if (neighborNode.dataset.card) {
                        neighborNode.classList.add('destroyed');
                        tuilesDestroyToReset.push(neighborNode.parentNode.dataset.id);
                    }
                }
            });
            break;

        case '044':
            const allTuilesVoid = Array.from(document.querySelectorAll('.terrain .tuile:not(.tuile--sun) .tuile__content:not([data-card]):not(.obstructed)'));
            const shuffledTuiles = allTuilesVoid.sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5);
            const randIndex = randomBetween(0, shuffledTuiles.length - 1);
            SetHtmlInHexagon(shuffledTuiles[randIndex], deepClone(ALL_CARDS.find(card => card.id === '045')));
            RevealPower(shuffledTuiles[randIndex].parentNode, deepClone(ALL_CARDS.find(card => card.id === '045')));

            if (!localDex.allCards.find(c => c.id === '045').found) {
                localDex.allCards.find(c => c.id === '045').found = Date.now();
                localStorage.setItem('dex', JSON.stringify(localDex));
            }
            break;

        case '045':
            neighborsNode.forEach(neighborNode => {
                const neighborCard = ALL_CARDS.find(card => card.id === neighborNode.dataset.card);
                if (neighborCard && neighborCard.type === TYPES[0]) AddToTuile(neighborNode, -4);
            });
            break;

        case '046':
            neighborsNode.forEach(neighborNode => {
                const neighborCard = ALL_CARDS.find(card => card.id === neighborNode.dataset.card);
                if (neighborCard && neighborCard.type === TYPES[0]) AddToTuile(neighborNode, -1);
            });
            break;

        case '047':
            playerHand.push(deepClone(ALL_CARDS.find(card => card.id === '048')));
            if (!localDex.allCards.find(c => c.id === '048').found) {
                localDex.allCards.find(c => c.id === '048').found = Date.now();
                localStorage.setItem('dex', JSON.stringify(localDex));
            }
            HtmlCards();
            break;

        case '048':
            neighborsNode.forEach(neighborNode => {
                const neighborCard = ALL_CARDS.find(card => card.id === neighborNode.dataset.card);
                if (neighborCard && neighborCard.type === TYPES[0]) AddToTuile(neighborNode, 2);
            });
            break;

        case '049':
            neighborsNode.forEach(neighborNode => {
                if (
                    !neighborNode.dataset.card &&
                    !neighborNode.parentNode.classList.contains('tuile--sun')
                ) {
                    neighborNode.classList.add('obstructed');
                }
            });
            break;

        case '050':
            tuileContent.dataset.hasmalus = false;
            neighborsNode.forEach(neighborNode => {
                if (
                    tuileContent.dataset.hasmalus === 'false' &&
                    neighborNode.parentNode.classList.contains('tuile--sun')
                ) {
                    AddToTuile(tuileContent, -6);
                    tuileContent.dataset.hasmalus = true;
                }
            });
            break;

        case '052':
            const allPlanetsAndMoonsExept052 = Array.from(document.querySelectorAll(`.terrain .tuile__content[data-type="${TYPES[0]}"]:not([data-card="052"]), .tuile__content[data-type="${TYPES[1]}"]:not([data-card="052"])`));
            const randomCardIndex = randomBetween(0, allPlanetsAndMoonsExept052.length - 1);
            const voidNeighbors052 = [];

            neighborsNode.forEach(neighborNode => {
                if (
                    !neighborNode.dataset.card &&
                    !neighborNode.classList.contains('obstructed') &&
                    !neighborNode.parentNode.classList.contains('tuile--sun')
                ) {
                    voidNeighbors052.push(neighborNode);
                }
            });

            const randomVoidNeighborIndex = randomBetween(0, voidNeighbors052.length - 1);
            if (voidNeighbors052.length > 0 && allPlanetsAndMoonsExept052.length > 0) {
                MovePlatet(allPlanetsAndMoonsExept052[randomCardIndex].parentNode.dataset.id, voidNeighbors052[randomVoidNeighborIndex].parentNode.dataset.id);
            }
            break;

        case '053':
            const allPlanetsOnBoardExecpt053 = document.querySelectorAll(`.tuile__content[data-type="${TYPES[0]}"]:not([data-card="053"])`);
            allPlanetsOnBoardExecpt053.forEach(planet => {
                if (ALL_CARDS.find(card => card.id === planet.dataset.card).mana === 1) {
                    AddToTuile(planet, 1);
                }
            });
            break;

        case '054':
            tuileContent.dataset.mojoboost = 'false';
            const isOrbitFull = ![...neighborsNode].some(neighbor => !neighbor.dataset.card);
            if (isOrbitFull && tuileContent.dataset.mojoboost === 'false') {
                AddToTuile(tuileContent, 6);
                tuileContent.dataset.mojoboost = 'true';
            }
            break;

        case '055':
            playerHand.forEach(card => {
                if (card.type === TYPES[0]) card.pwr += 3;
            });

            HtmlCards();
            break;

        case '056':
            const allPlanetsInDeck = playerDeck.filter(c => c.type === TYPES[0]);
            if (allPlanetsInDeck.length > 0) {
                const randomIndex = randomBetween(0, allPlanetsInDeck.length - 1);
                const randomPlanet = allPlanetsInDeck.splice(randomIndex, 1)[0];

                const pIndex = playerDeck.indexOf(playerDeck.find(c => c.id === randomPlanet.id));
                playerDeck.splice(pIndex, 1);

                randomPlanet.pwr -= 1;
                playerHand.push(randomPlanet);
                HtmlCards();
            }
            break;

        case '057':
            neighborsNode.forEach(neighborNode => {
                const neighborCard = ALL_CARDS.find(card => card.id === neighborNode.dataset.card);
                if (neighborCard && neighborCard.type === TYPES[0]) AddToTuile(neighborNode, 1);
            });
            break;

        case '058':
            tuileContent.dataset.valid = 'true';
            neighborsNode.forEach(neighborNode => {
                if (!neighborNode.dataset.card) neighborNode.classList.add('waitingPhoebe');
            });
            break;

        case '071':
            playerDeck.forEach(card => {
                if (card.type === TYPES[0]) {
                    const memory = card.mana;
                    card.mana = Math.max(card.pwr, 0);
                    card.pwr = memory;
                    card.negative = true;
                }
            })
            break;

        case '073':
            let gaiamotto = playerHand.find(card => card.id === '072') || playerDeck.find(card => card.id === '072');

            if (gaiamotto) {
                gaiamotto.pwr += 3;

                if (playerDeck.find(card => card.id === '072')) {
                    const index = playerDeck.indexOf(playerDeck.find(c => c.id === '072'));
                    playerDeck.splice(index, 1);
                    playerHand.push(gaiamotto);
                }

                HtmlCards();
            } else {
                gaiamotto = document.querySelector('.tuile__content[data-card="072"]');
                if (gaiamotto) AddToTuile(gaiamotto, 3);
            }
            break;

        case '074':
            const randomCardI = randomBetween(0, allPlanetsOnBoard.length - 1);
            const voidNeighbors074 = [];

            neighborsNode.forEach(neighborNode => {
                if (
                    !neighborNode.dataset.card &&
                    !neighborNode.classList.contains('obstructed') &&
                    !neighborNode.parentNode.classList.contains('tuile--sun')
                ) {
                    voidNeighbors074.push(neighborNode);
                }
            });

            const randomVoidNeighborI = randomBetween(0, voidNeighbors074.length - 1);
            if (voidNeighbors074.length > 0 && allPlanetsOnBoard.length > 0) {
                const parent = voidNeighbors074[randomVoidNeighborI].parentNode;
                AddToTuile(allPlanetsOnBoard[randomCardI], 4);
                MovePlatet(allPlanetsOnBoard[randomCardI].parentNode.dataset.id, parent.dataset.id);
            }
            break;

        case '075':
            manaBonus += 4;
            break;

        case '076':
            let maxPwr = -100;
            neighborsNode.forEach(neighborNode => {
                if (neighborNode.dataset.card && neighborNode.dataset.pwr) {
                    maxPwr = Math.max(maxPwr, parseInt(neighborNode.dataset.pwr));
                }
            });

            neighborsNode.forEach(neighborNode => {
                if (
                    neighborNode.dataset.card &&
                    neighborNode.dataset.pwr &&
                    parseInt(neighborNode.dataset.pwr) < maxPwr
                ) {
                    const originalParent = neighborNode.parentNode;
                    MovePlatet(originalParent.dataset.id, 'test');
                    AddToTuile(document.querySelector('.tuile[data-id="test"] .tuile__content'), maxPwr - parseInt(document.querySelector('.tuile[data-id="test"] .tuile__content').dataset.pwr));
                    MovePlatet('test', originalParent.dataset.id);
                    ClearOneTuile(document.querySelector('.tuile[data-id="test"]'));
                }
            });
            break;

        case '078':
            setTimeout(() => {
                DrawCard();
            }, 100);

            const allPlanetsOnBoard078 = Array.from(document.querySelectorAll(`.tuile__content[data-type="${TYPES[0]}"]`));

            if (allPlanetsOnBoard078.length > 0) {
                const randomIndex = randomBetween(0, allPlanetsOnBoard078.length - 1);
                AddToTuile(allPlanetsOnBoard078[randomIndex], 2);
            }
            break;

        case '079':
            const athanasios079 = playerHand.find(card => card.id === '077') || playerDeck.find(card => card.id === '077');
            if (athanasios079) {
                athanasios079.mana = Math.max(athanasios079.mana - 1, 0);
                HtmlCards();
            }
            manaBonus += 1;
            break;

        case '080':
            const quantiqueIdsExept080 = ['078', '079', '081', '082', '083'];
            const allQuantiqueInDeck = playerDeck.filter(c => quantiqueIdsExept080.includes(c.id));

            let j = 0;
            while (j < 2 && allQuantiqueInDeck.length > 0) {
                const randomIndex = randomBetween(0, allQuantiqueInDeck.length - 1);
                const quantiquePicked = allQuantiqueInDeck.splice(randomIndex, 1)[0];

                playerHand.push(quantiquePicked);
                playerDeck.splice(playerDeck.findIndex(c => c.id === quantiquePicked.id), 1);

                j += 1;
            }

            HtmlCards();
            break;

        case '081':
            neighborsNode.forEach(neighborNode => {
                const neighborCard = ALL_CARDS.find(card => card.id === neighborNode.dataset.card);
                if (neighborCard && neighborCard.type === TYPES[0]) AddToTuile(neighborNode, 1);
            });

            tuileContent.dataset.boost = 'false';

            const quantiqueIdsExept081 = ['078', '079', '080', '082', '083'];
            const allOtherQuantiquePlayed = quantiqueIdsExept081.every(id => HistoryContainsCard(id));

            if (allOtherQuantiquePlayed) {
                tuileContent.dataset.boost = 'true';
                let athanasios081 = playerHand.find(card => card.id === '077') || playerDeck.find(card => card.id === '077');

                if (athanasios081) {
                    athanasios081.pwr += 10;
                    tuileContent.dataset.boost = 'true';
                    HtmlCards();
                } else {
                    athanasios081 = document.querySelector('.tuile__content[data-card="077"]');
                    if (athanasios081) {
                        AddToTuile(athanasios081, 10);
                        tuileContent.dataset.boost = 'true';
                    }
                }
            }
            break;

        case '082':
            setTimeout(() => {
                DrawCard();
            }, 100);

            neighborsNode.forEach(neighborNode => {
                const neighborCard = ALL_CARDS.find(card => card.id === neighborNode.dataset.card);
                if (neighborCard && neighborCard.type === TYPES[0]) AddToTuile(neighborNode, -1);
            });
            break;

        case '083':
            setTimeout(() => {
                DrawCard();
            }, 100);

            const allCardsOnBoard = Array.from(document.querySelectorAll(`.tuile__content[data-card]:not([data-type="star"]):not([data-card="083"])`));
            const randCardIndex = randomBetween(0, allCardsOnBoard.length - 1);
            const voidNeighbors083 = [];

            neighborsNode.forEach(neighborNode => {
                if (
                    !neighborNode.dataset.card &&
                    !neighborNode.classList.contains('obstructed') &&
                    !neighborNode.parentNode.classList.contains('tuile--sun')
                ) {
                    voidNeighbors083.push(neighborNode);
                }
            });

            const randVoidNeighborIndex = randomBetween(0, voidNeighbors083.length - 1);
            if (voidNeighbors083.length > 0 && allCardsOnBoard.length > 0) {
                MovePlatet(allCardsOnBoard[randCardIndex].parentNode.dataset.id, voidNeighbors083[randVoidNeighborIndex].parentNode.dataset.id);
            }
            break;

        case '088':
            const boost = parseInt(playerHand.length) * 2;
            tuileContent.dataset.boost = boost;
            AddToTuile(tuileContent, boost);
            break;

        case '089':
            playerDeck.push(deepClone(ALL_CARDS.find(card => card.id === '022')));
            playerDeck.push(deepClone(ALL_CARDS.find(card => card.id === '022')));

            nbCardsInDeckNode.innerHTML = playerDeck.length;
            break;

        case '090':
            if (playerHand.length > 0) {
                const rand = randomBetween(0, playerHand.length - 1);
                playerHand[rand].mana += 1;
                HtmlCards();
            }
            break;

        case '091':
            if (playerHand.length > 0) {
                const cumulativePwr = playerHand.reduce(
                    (total, card) => total + (typeof card.pwr === 'number' ? card.pwr : 0), 0
                );

                if (cumulativePwr >= 15) AddToTuile(tuileContent, cumulativePwr);
            }
            break;

        case '092':
            setTimeout(() => {
                if (playerHand.length < 6) {
                    const availableCards = ALL_CARDS.filter(card => !startingCardsChosen.some(handCard => handCard === card.id));
                    const randCard = deepClone(availableCards[randomBetween(0, availableCards.length - 1)]);
                    randCard.mana -= 1;
                    playerHand.push(randCard);
                    HtmlCards();

                    if (!localDex.allCards.find(c => c.id === randCard.id).found) {
                        localDex.allCards.find(c => c.id === randCard.id).found = Date.now();
                        localStorage.setItem('dex', JSON.stringify(localDex));
                    }
                }
            }, 50);
            break;

        case '093':
            setTimeout(() => {
                if (playerHand.length < 6) {
                    const availableCards = ALL_CARDS.filter(card => !startingCardsChosen.some(handCard => handCard === card.id) && card.mana === 6);
                    const randCard = deepClone(availableCards[randomBetween(0, availableCards.length - 1)]);
                    randCard.mana -= 2;
                    randCard.pwr -= 2;
                    playerHand.push(randCard);
                    HtmlCards();

                    if (!localDex.allCards.find(c => c.id === randCard.id).found) {
                        localDex.allCards.find(c => c.id === randCard.id).found = Date.now();
                        localStorage.setItem('dex', JSON.stringify(localDex));
                    }
                }
            }, 50);
            break;

        case '095':
            if (history[currentTurn]) {
                const nbCardsPlayedThisTurn = history[currentTurn].length;
                AddToTuile(tuileContent, nbCardsPlayedThisTurn * 2);
            }
            break;

        case '096':
            const voidNeighbors096 = [];
            neighborsNode.forEach(neighborNode => {
                if (
                    !neighborNode.dataset.card &&
                    !neighborNode.classList.contains('obstructed') &&
                    !neighborNode.parentNode.classList.contains('tuile--sun')
                ) {
                    voidNeighbors096.push(neighborNode);
                }
            });

            if (voidNeighbors096.length > 0) {
                if (!localDex.allCards.find(c => c.id === '097').found) {
                    localDex.allCards.find(c => c.id === '097').found = Date.now();
                    localStorage.setItem('dex', JSON.stringify(localDex));
                }

                setTimeout(() => {
                    const rvni = randomBetween(0, voidNeighbors096.length - 1);
                    const tuileForClone = voidNeighbors096[rvni].parentNode;
                    const originalParent = tuileContent.parentNode;
                    MovePlatet(originalParent.dataset.id, 'test');
                    const clone = deepClone(ALL_CARDS.find(card => card.id === '097'));
                    const currentPwr = parseInt(document.querySelector('.tuile[data-id="test"] .tuile__content').dataset.pwr);
                    MovePlatet('test', originalParent.dataset.id);
                    ClearOneTuile(document.querySelector('.tuile[data-id="test"]'));
                    tuileContent = originalParent.querySelector('.tuile__content');
                    
                    const originelPosition= tuileContent.getBoundingClientRect();
                    const clonePosition = tuileForClone.getBoundingClientRect();
                    
                    SetHtmlInHexagon(document.querySelector('.tuile[data-id="test"] .tuile__content'), clone);
                    AddToTuile(document.querySelector('.tuile[data-id="test"] .tuile__content'), currentPwr - clone.pwr);
                    MovePlatet('test', tuileForClone.dataset.id);
                    UpdateCurrentAllPointsScored();
                    if (originalParent.querySelector('[data-boost101="true"]')) {
                        tuileForClone.querySelector('.tuile__content').dataset.boost101 = 'true';
                    }

                    // Animation
                    const cloneContent = tuileForClone.querySelector('.tuile__content');
                    const cloneHexa = tuileForClone.querySelector('.tuile__hexa');
                    cloneHexa.setAttribute(
                        'style',
                        `
                            transition: none;
                            opacity: 0;
                            transform: translate(${originelPosition.left - clonePosition.left}px, ${originelPosition.top - clonePosition.top}px);
                        `
                    );
                    cloneContent.setAttribute(
                        'style',
                        `
                            transition: none;
                            opacity: 0;
                            transform: translate(${originelPosition.left - clonePosition.left}px, ${originelPosition.top - clonePosition.top}px);
                        `
                    );
                    setTimeout(() => {
                        cloneHexa.setAttribute(
                            'style',
                            `
                                transition: all 1s ease-in-out;
                                opacity: 1;
                                transform: translate(0, 0);
                            `
                        );
                        cloneContent.setAttribute(
                            'style',
                            `
                                transition: all 1s ease-in-out;
                                opacity: 1;
                                transform: translate(0, 0);
                            `
                        );

                        setTimeout(() => {
                            cloneHexa.removeAttribute('style');
                            cloneContent.removeAttribute('style');
                        }, 1000);
                    }, 100);
                }, 100);
            }
            break;

        case '098':
            neighborsNode.forEach(neighborNode => {
                if (
                    neighborNode.dataset.card &&
                    neighborNode.dataset.pwr
                ) {
                    const originalParent = neighborNode.parentNode;
                    MovePlatet(originalParent.dataset.id, 'test');
                    AddToTuile(document.querySelector('.tuile[data-id="test"] .tuile__content'), 3 - parseInt(document.querySelector('.tuile[data-id="test"] .tuile__content').dataset.pwr));
                    MovePlatet('test', originalParent.dataset.id);
                    ClearOneTuile(document.querySelector('.tuile[data-id="test"]'));
                }
            });
            break;

        case '101':
            let maxPwr101 = -100;
            allPlanetsOnBoard.forEach(planet => maxPwr101 = Math.max(maxPwr101, parseInt(planet.dataset.pwr)));
            allPlanetsOnBoard.forEach(planet => {
                if (parseInt(planet.dataset.pwr) === maxPwr101) {
                    planet.dataset.boost101 = 'true';
                    AddToTuile(planet, 2);
                }
            })
            break;

        case '102':
            const neighborsId = []
            neighborsNode.forEach(neighborNode => {
                if (neighborNode.dataset.type === TYPES[0]) {
                    neighborsId.push(neighborNode.dataset.card);
                }
            });
            allPlanetsOnBoard.forEach(planet => {
                if (!neighborsId.includes(planet.dataset.card)) {
                    AddToTuile(planet, 1);
                }
            });
            break;

        case '104':
            if (playerHand.length > 0) {
                const rand = randomBetween(0, playerHand.length - 1);
                playerHand[rand].mana = Math.max(playerHand[rand].mana - 1, 0);
                if (playerHand[rand].pwr || playerHand[rand].pwr === 0) playerHand[rand].pwr += 1;
                HtmlCards();
            }
            break;

        case '110':
            const cardNeighbors = neighborsNode.filter(neighbor => neighbor.dataset.card && neighbor.dataset.type !== TYPES[3] && neighbor.dataset.card !== '117');
            const shuffled = cardNeighbors.sort(() => Math.random() - 0.5);
            const selectedNeighbors = shuffled.slice(0, 3);
            selectedNeighbors.forEach(neighbor => {
                neighbor.classList.add('destroyed');
                tuilesDestroyToReset.push(neighbor.parentNode.dataset.id);
            });

            let nbCardDestroyed = selectedNeighbors.length;
            AddToTuile(tuileContent, nbCardDestroyed * 2)
            break;

        case '112':
            let cumulePwr = 0;
            neighborsNode.forEach(neighborNode => {
                if (!neighborNode.parentNode.classList.contains('tuile--sun') && neighborNode.dataset.card !== '117') {
                    if (neighborNode.dataset.card) {
                        const ogParentId = neighborNode.parentNode.dataset.id;
                        
                        neighborNode.classList.add('destroyed');
                        tuilesDestroyToReset.push(neighborNode.parentNode.dataset.id);

                        cumulePwr += GetCardTruePwr(ogParentId);
                    }
                }
            });

            AddToTuile(tuileContent, cumulePwr);
            break;

        case '113':
            let cumulePwrDestroy = 0;
            listPwrDestroyInRound.forEach(pwr => cumulePwrDestroy += pwr);
            AddToTuile(tuileContent, cumulePwrDestroy);
            break;

        case '115':
            const cardNeighbors115 = neighborsNode.filter(neighbor => neighbor.dataset.card && neighbor.dataset.type !== TYPES[3] && neighbor.dataset.card !== '117');
            if (cardNeighbors115.length > 0) {
                const randVoid = cardNeighbors115.sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5).slice(0, 1)[0];
                randVoid.classList.add('destroyed');
                tuilesDestroyToReset.push(randVoid.parentNode.dataset.id);
            }
            break;

        case '116':
            const allCards = document.querySelectorAll('.terrain .tuile:not(.tuile--sun) .tuile__content[data-card]');
            allCards.forEach(card => {
                if (ALL_CARDS.find(c => c.id === card.dataset.card).mana === 1) {
                    card.classList.add('destroyed');
                    tuilesDestroyToReset.push(card.parentNode.dataset.id);
                }
            })
            break;

        default:
            break;
    }

    const uranus = document.querySelector('.tuile__content[data-card="023"]');
    if (
        uranus &&
        cardRevealed.id !== '023' &&
        tuileContent.dataset.type === TYPES[0]
    ) {
        AddToTuile(tuileContent, 1);
    }

    const kepler22B = document.querySelector('.tuile__content[data-card="028"]');
    if (kepler22B) {
        const hasNeighbors = GetAllNeighbors(kepler22B.parentNode).some(n => n.dataset.card && !n.classList.contains('destroyed'));
        if (hasNeighbors && kepler22B.dataset.keplerboostapply === 'true') {
            AddToTuile(kepler22B, -5);
            kepler22B.dataset.keplerboostapply = false;
        } else if (!hasNeighbors && kepler22B.dataset.keplerboostapply === 'false') {
            AddToTuile(kepler22B, 5);
            kepler22B.dataset.keplerboostapply = true;
        }
    }

    const trappist1D = document.querySelector('.tuile__content[data-card="034"]');
    if (trappist1D && cardRevealed.type === TYPES[1]) {
        neighborsNode.forEach(neighborNode => {
            if (neighborNode.dataset.card === '034') AddToTuile(neighborNode, 2);
        });
    }

    const trappist1G = document.querySelector('.tuile__content[data-card="037"]');
    if (trappist1G && tuileContent.dataset.card !== '037') AddToTuile(trappist1G, 1);

    let cancriD = document.querySelector('.tuile__content[data-card="046"]');
    if (cancriD && cardRevealed.type === TYPES[0]) {
        neighborsNode.forEach(neighborNode => {
            if (neighborNode.dataset.card === '046') AddToTuile(tuileContent, -1);
        });
    }

    let titan = document.querySelector('.tuile__content[data-card="048"]');
    if (titan && cardRevealed.type === TYPES[0]) {
        neighborsNode.forEach(neighborNode => {
            if (neighborNode.dataset.card === '048') AddToTuile(tuileContent, 2);
        });
    }

    const hr8799C = document.querySelector('.tuile__content[data-card="050"]');
    if (hr8799C && hr8799C.dataset.hasmalus === 'false') {
        const hr8799CNeighbors = GetAllNeighbors(hr8799C.parentNode);
        hr8799CNeighbors.forEach(neighbor => {
            if (neighbor.parentNode.classList.contains('tuile--sun')) {
                AddToTuile(hr8799C, -6);
                hr8799C.dataset.hasmalus = 'true';
            }
        })
    }

    if (
        document.querySelector('.tuile__content[data-card="053"]') &&
        cardRevealed.id !== '053' &&
        tuileContent.dataset.type === TYPES[0] &&
        ALL_CARDS.find(card => card.id === cardRevealed.id).mana === 1
    ) {
        AddToTuile(tuileContent, 1);
    }

    const superSaturne = document.querySelector('.tuile__content[data-card="054"]');
    if (superSaturne) {
        const superSaturneNeighbors = GetAllNeighbors(superSaturne.parentNode);
        let hasVoidNeighbord = false;

        superSaturneNeighbors.forEach(n => {
            if (n.classList.contains('destroyed') || !n.dataset.card) {
                hasVoidNeighbord = true;
            }
        });

        if (superSaturne.dataset.mojoboost === 'true' && hasVoidNeighbord) {
            AddToTuile(superSaturne, -6);
            superSaturne.dataset.mojoboost = 'false';
        } else if (superSaturne.dataset.mojoboost === 'false' && !hasVoidNeighbord) {
            AddToTuile(superSaturne, 6);
            superSaturne.dataset.mojoboost = 'true';
        }
    }

    const starCeinturion = document.querySelector('.tuile--sun .tuile__content[data-card="010"]');
    if (starCeinturion) {
        const starCeinturionNeighbors = GetAllNeighbors(starCeinturion.parentNode);
        let hasVoidNeighbord = false;

        starCeinturionNeighbors.forEach(n => {
            if (n.classList.contains('destroyed') || !n.dataset.card) {
                hasVoidNeighbord = true;
            }
        });

        if (starCeinturion.dataset.boost === 'true' && hasVoidNeighbord) {
            AddToTuile(starCeinturion, -6);
            starCeinturion.dataset.boost = 'false';
        } else if (starCeinturion.dataset.boost === 'false' && !hasVoidNeighbord) {
            AddToTuile(starCeinturion, 6);
            starCeinturion.dataset.boost = 'true';
        }
    }

    const starAstrumSolitarius = document.querySelector('.tuile--sun .tuile__content[data-card="011"]');
    if (starAstrumSolitarius) {
        const starAstrumSolitariusNeighbors = GetAllNeighbors(starAstrumSolitarius.parentNode);
        let hasNeighbord = false;

        starAstrumSolitariusNeighbors.forEach(n => {
            if (!n.classList.contains('destroyed') && n.dataset.card) {
                hasNeighbord = true;
            }
        });

        if (starAstrumSolitarius.dataset.boost === 'true' && hasNeighbord) {
            AddToTuile(starAstrumSolitarius, -6);
            starAstrumSolitarius.dataset.boost = 'false';
        } else if (starAstrumSolitarius.dataset.boost === 'false' && !hasNeighbord) {
            AddToTuile(starAstrumSolitarius, 6);
            starAstrumSolitarius.dataset.boost = 'true';
        }
    }

    let callisto = document.querySelector('.tuile__content[data-card="057"]');
    if (callisto && cardRevealed.type === TYPES[0]) {
        neighborsNode.forEach(neighborNode => {
            if (neighborNode.dataset.card === '057') AddToTuile(tuileContent, 1);
        });
    }

    let purpleQuantum = document.querySelector('.tuile__content[data-card="081"]');
    if (purpleQuantum) {
        if (cardRevealed.type === TYPES[0]) {
            neighborsNode.forEach(neighborNode => {
                if (neighborNode.dataset.card === '081') AddToTuile(tuileContent, 1);
            });
        }

        const quantiqueIdsExept081 = ['078', '079', '080', '082', '083'];

        if (quantiqueIdsExept081.includes(tuileContent.dataset.card)) {
            quantiqueIdsExept081.splice(quantiqueIdsExept081.indexOf(tuileContent.dataset.card), 1);

            const allOtherQuantiquePlayed = quantiqueIdsExept081.every(id => HistoryContainsCard(id));
            if (allOtherQuantiquePlayed && purpleQuantum.dataset.boost === 'false') {
                let athanasios081 = playerHand.find(card => card.id === '077') || playerDeck.find(card => card.id === '077');
                if (athanasios081) {
                    athanasios081.pwr += 10;
                    tuileContent.dataset.boost = 'true';
                    HtmlCards();
                } else {
                    athanasios081 = document.querySelector('.tuile__content[data-card="077"]');

                    if (athanasios081) {
                        AddToTuile(athanasios081, 10);
                        tuileContent.dataset.boost = 'true';
                    }
                }
            }
        }
    }

    let quanticaLaranja = document.querySelector('.tuile__content[data-card="082"]');
    if (quanticaLaranja) {
        if (cardRevealed.type === TYPES[0]) {
            neighborsNode.forEach(neighborNode => {
                if (neighborNode.dataset.card === '082') AddToTuile(tuileContent, -1);
            });
        }
    }

    const gliese581B = document.querySelector('.tuile__content[data-card="088"]');
    if (gliese581B) {
        const oldBoost = parseInt(gliese581B.dataset.boost);
        const newBoost = parseInt(playerHand.length) * 2;
        AddToTuile(gliese581B, oldBoost * (-1));
        AddToTuile(gliese581B, newBoost);
        gliese581B.dataset.boost = newBoost;
    }

    const europe = document.querySelector('.tuile__content[data-card="101"]');
    if (europe) {
        document.querySelectorAll('.tuile__content[data-boost101="true"]').forEach(planet => {
            planet.dataset.boost101 = 'false';
            AddToTuile(planet, -2);
        })
        let maxPwr101 = -100;
        allPlanetsOnBoard.forEach(planet => maxPwr101 = Math.max(maxPwr101, parseInt(planet.dataset.pwr)));
        allPlanetsOnBoard.forEach(planet => {
            if (parseInt(planet.dataset.pwr) === maxPwr101) {
                planet.dataset.boost101 = 'true';
                AddToTuile(planet, 2);
            }
        })
    }

    let tethys = document.querySelector('.tuile__content[data-card="102"]');
    if (tethys && cardRevealed.type === TYPES[0]) {
        let hasTethysHasNeighbor = false;

        neighborsNode.forEach(neighborNode => {
            if (neighborNode.dataset.card === '102') hasTethysHasNeighbor = true;
        });

        if (!hasTethysHasNeighbor) AddToTuile(tuileContent, 1);
    }    

    // Destroy treatment
    tuilesDestroyToReset.forEach(tuileIdDestroyed => {
        const cardDestroyedParent =  document.querySelector(`.tuile[data-id="${tuileIdDestroyed}"]`);
        const cardIdDestroyed = cardDestroyedParent.querySelector('.tuile__content').dataset.card;

        if (cardIdDestroyed !== '117') {
            let needToDeleteTuile = true;
    
            const cardPwr = GetCardTruePwr(tuileIdDestroyed);
            listPwrDestroyInRound.push(cardPwr);
    
            hecate = document.querySelector('.tuile__content[data-card="045"]');
            cancriD = document.querySelector('.tuile__content[data-card="046"]');
            titan = document.querySelector('.tuile__content[data-card="048"]');
            callisto = document.querySelector('.tuile__content[data-card="057"]');
            purpleQuantum = document.querySelector('.tuile__content[data-card="081"]');
            quanticaLaranja = document.querySelector('.tuile__content[data-card="082"]');
            tethys = document.querySelector('.tuile__content[data-card="102"]');
    
            switch (cardIdDestroyed) {
                case '023':
                    document.querySelectorAll(`.tuile__content[data-type="${TYPES[0]}"]`).forEach(tuile => {
                        AddToTuile(tuile, -1);
                    });
                    break;
    
                case '042':
                    HtmlCards();
                    break;
    
                case '045':
                    const allHecateNeighbors = GetAllNeighbors(hecate.parentNode);
                    allHecateNeighbors.forEach(neighbor => {
                        if (neighbor.dataset.pwr && neighbor.dataset.type === TYPES[0]) AddToTuile(neighbor, 4);
                    });
                    break;
    
                case '046':
                    const allCancriDNeighbors = GetAllNeighbors(cancriD.parentNode);
                    allCancriDNeighbors.forEach(neighbor => {
                        if (neighbor.dataset.pwr && neighbor.dataset.type === TYPES[0]) AddToTuile(neighbor, 1);
                    });
                    break;
    
                case '048':
                    const allTitanNeighbors = GetAllNeighbors(titan.parentNode);
                    
                    allTitanNeighbors.forEach(neighbor => {
                        if (neighbor.dataset.pwr && neighbor.dataset.type === TYPES[0]) AddToTuile(neighbor, -2);
                    });
                    break;
    
                case '049':
                    document.querySelectorAll('.obstructed').forEach(o => o.classList.remove('obstructed'));
                    break;
    
                case '053':
                    document.querySelectorAll(`.tuile__content[data-type="${TYPES[0]}"]`).forEach(tuile => {
                        if (ALL_CARDS.find(card => card.id === tuile.dataset.card).mana === 1) {
                            AddToTuile(tuile, -1);
                        }
                    });
                    break;
    
                case '057':
                    const allCallistoNeighbors = GetAllNeighbors(callisto.parentNode);
                    allCallistoNeighbors.forEach(neighbor => {
                        if (neighbor.dataset.pwr && neighbor.dataset.type === TYPES[0]) AddToTuile(neighbor, -1);
                    });
                    break;
    
                case '081':
                    const allPurpleQuantumNeighbors = GetAllNeighbors(purpleQuantum.parentNode);
                    allPurpleQuantumNeighbors.forEach(neighbor => {
                        if (neighbor.dataset.pwr && neighbor.dataset.type === TYPES[0]) AddToTuile(neighbor, -1);
                    });
    
                    if (purpleQuantum.dataset.boost === 'true') {
                        let athanasios = playerHand.find(card => card.id === '077') || playerDeck.find(card => card.id === '077');
                        if (athanasios) {
                            athanasios.pwr -= 10;
                            purpleQuantum.dataset.boost = 'false';
                        } else {
                            athanasios = document.querySelector('.tuile__content[data-card="077"]');
                            if (athanasios) {
                                AddToTuile(athanasios, -10);
                                purpleQuantum.dataset.boost = 'false';
                            }
                        }
                    }
                    break;
    
                case '082':
                    const allQuanticaLaranjaNeighbors = GetAllNeighbors(quanticaLaranja.parentNode);
                    allQuanticaLaranjaNeighbors.forEach(neighbor => {
                        if (neighbor.dataset.pwr && neighbor.dataset.type === TYPES[0]) AddToTuile(neighbor, 1);
                    });
                    break;
    
                case '101':
                    document.querySelectorAll('.tuile__content[data-boost101="true"]').forEach(planet => {
                        planet.dataset.boost101 = 'false';
                        AddToTuile(planet, -2);
                    });
                    break;
    
                case '102':
                    const allTethysNeighbors = GetAllNeighbors(tethys.parentNode);
                    const allTethysNeighborsId = [];
                    allTethysNeighbors.forEach(neighbor => {
                        if (neighbor.dataset.type === TYPES[0]) allTethysNeighborsId.push(neighbor.dataset.card);
                    });
                    allPlanetsOnBoard.forEach(planet => {
                        if (!allTethysNeighborsId.includes(planet.dataset.card)) {
                            AddToTuile(planet, -1);
                        }
                    });
                    break;
    
                case '103':
                    const animation = document.createElement('div');
                    animation.classList.add('wave');
                    cardDestroyedParent.appendChild(animation);
                    allPlanetsOnBoard.forEach(planet => AddToTuile(planet, 1));
    
                    setTimeout(() => {
                        animation.classList.remove('wave');
                    }, 2000);
                    break;
    
                case '106':
                    wasShivaDestroyedLastTurn = cardPwr;
                    break;
    
                case '107':
                    setTimeout(() => {
                        SetHtmlInHexagon(document.querySelector('.tuile[data-id="test"] .tuile__content'), deepClone(ALL_CARDS.find(card => card.id === '108')));
                        MovePlatet('test', tuileIdDestroyed);
                        ClearOneTuile('test');
                        if (uranus) AddToTuile(cardDestroyedParent.querySelector('.tuile__content'), 1);
    
                        const nemesisTuile = document.querySelector('.terrain .tuile:has([data-card="108"])');
                        nemesisTuile.setAttribute(
                            'style',
                            `
                                transform: rotate(720deg);
                                transition: all 0s;
                            `
                        );
                        
                        setTimeout(() => {
                            nemesisTuile.setAttribute(
                                'style',
                                `
                                transform: rotate(0deg);
                                transition: all 1s ease-in-out;
                                `
                            );
                            setTimeout(() => {
                                nemesisTuile.removeAttribute('style');
                            }, 1000);
                        }, 10);
    
                        UpdateCurrentAllPointsScored();
                    }, 2550);
                    break;
    
                case '111':
                    const oldPwr = parseInt(cardDestroyedParent.querySelector('.tuile__content').dataset.pwr);
    
                    setTimeout(() => {
                        const allVoidTuiles = Array.from(document.querySelectorAll(`.terrain .tuile:not(.obstructed):not(.tuile--sun):not(:has([data-card])):not([data-id="${tuileIdDestroyed}"])`));
                        if (allVoidTuiles.length > 0) {
                            let shuffled = allVoidTuiles.sort(() => Math.random() - 0.5);
                            shuffled = shuffled.sort(() => Math.random() - 0.5);
                            const selectedVoidTuile = shuffled.slice(0, 1)[0];
        
                            SetHtmlInHexagon(document.querySelector('.tuile[data-id="test"] .tuile__content'), deepClone(ALL_CARDS.find(card => card.id === '111')));
                            MovePlatet('test', tuileIdDestroyed);
                            ClearOneTuile('test');
    
                            if (uranus) AddToTuile(cardDestroyedParent.querySelector('.tuile__content'), 1);
                            const currentPwr = parseInt(cardDestroyedParent.querySelector('.tuile__content').dataset.pwr);
                            if (parseInt(currentPwr) < oldPwr) {
                                AddToTuile(cardDestroyedParent.querySelector('.tuile__content'), oldPwr - currentPwr);
                            }
                            
                            MovePlatet(tuileIdDestroyed, selectedVoidTuile.dataset.id);
                            AddToTuile(selectedVoidTuile.querySelector('.tuile__content'), 2);
                            
                            UpdateCurrentAllPointsScored();
                        }
                    }, 2550);
                    break;
    
                case '114':
                    wasCerbereDestroyedLastTurn = cardPwr;
                    break;
    
                default:
                    break;
            }
    
            const thanatosCard = playerHand.find(card => card.id === '109') || playerDeck.find(card => card.id === '109');
            if (thanatosCard) {
                thanatosCard.mana = Math.max(thanatosCard.mana - 1, 0);
                HtmlCards();
            }
    
            const anubis = document.querySelector('.terrain .tuile__content[data-card="113"]');
            if (anubis) AddToTuile(anubis, cardPwr);

            const hel = document.querySelector('.terrain .tuile__content[data-card="117"]');
            if (hel) AddToTuile(hel, 1);
    
            // Animation
            const svg = cardDestroyedParent.querySelector('.tuile__hexa path');
            if (svg && needToDeleteTuile) {
                svg.style.transition = 'filter .5s ease-in-out';
                svg.style.filter = 'invert(1)';
                setTimeout(() => {
                    svg.style.filter = 'invert(0)';
    
                    const tuileHexa = cardDestroyedParent.querySelector('.tuile__hexa');
                    tuileHexa.style.transition = 'all 2s ease';
                    tuileHexa.style.opacity = '0';
    
                    const tuileContent = cardDestroyedParent.querySelector('.tuile__content');
                    tuileContent.style.transition = 'all 2s ease';
                    tuileContent.style.opacity = '0';
    
                    setTimeout(() => {
                        ClearOneTuile(cardDestroyedParent);
                        UpdateCurrentAllPointsScored();
                    }, 2000);
                }, 500);
            }
        }

        localDex.nbCardsDestroyed += 1;
        if (localDex.nbCardsDestroyed >= 100 && !localDex.allCards.find(c => c.id === '106').found) localDex.allCards.find(c => c.id === '106').found = Date.now();
        localStorage.setItem('dex', JSON.stringify(localDex));

        // suppr du tableau après traitement
        cardDestroyedParent.querySelector('.tuile__content')?.classList.remove('destroyed');
        tuilesDestroyToReset = tuilesDestroyToReset.filter(id => id !== tuileIdDestroyed);
    });
}


function HistoryContainsCard(cardId) {
    return Object.values(history).flat().includes(cardId);
}


function AddToTuile(tuileContent, value) {
    if (tuileContent.dataset.pwr && (tuileContent.dataset.type === TYPES[0] || tuileContent.dataset.type === TYPES[3])) {
        tuileContent.dataset.pwr = parseInt(tuileContent.dataset.pwr) + value;

        const originalPwr = ALL_CARDS.find(c => c.id === tuileContent.dataset.card).pwr;
        const tuilePwrNode = tuileContent.querySelector('.tuile__pwr');
        tuilePwrNode.innerHTML = tuileContent.dataset.pwr;
        tuilePwrNode.classList.toggle('tuile__pwr--up', parseInt(tuileContent.dataset.pwr) > originalPwr);
        tuilePwrNode.classList.toggle('tuile__pwr--down', parseInt(tuileContent.dataset.pwr) < originalPwr);
    }
}


function PowerBeginningTurn() {
    // --- 088
    const gliese581B = document.querySelector('.tuile__content[data-card="088"]');
    if (gliese581B) {
        const oldBoost = parseInt(gliese581B.dataset.boost);
        const newBoost = parseInt(playerHand.length) * 2;
        AddToTuile(gliese581B, oldBoost * (-1));
        AddToTuile(gliese581B, newBoost);
        gliese581B.dataset.boost = newBoost;
    }
}


function PowerEndOfTurn() {
    // --- 024
    const neptune = document.querySelector('.tuile__content[data-card="024"]');
    if (neptune) {
        const turnNeptunePlayed = Object.keys(history).find(key => history[key].includes('024'));

        if (parseInt(turnNeptunePlayed) === currentTurn - 1) {
            document.querySelectorAll('.waitingNeptune').forEach(x => x.classList.remove('waitingNeptune'));

            if (neptune.dataset.valid === 'true') {
                AddToTuile(neptune, 4);
                neptune.dataset.valid = false;
            }
        }
    }
    // --- 025
    const pluton = document.querySelector('.tuile__content[data-card="025"]');
    if (pluton && playerMana > 0) AddToTuile(pluton, playerMana);
    // --- 032
    const trappist1B = document.querySelector('.tuile__content[data-card="032"]');
    if (trappist1B) {
        const turnTrappist1BPlayed = parseInt(trappist1B.dataset.turn);

        if (parseInt(turnTrappist1BPlayed) === currentTurn - 1) {
            document.querySelectorAll('.waitingTRAPPIST1B').forEach(x => x.classList.remove('waitingTRAPPIST1B'));
        }
    }
    // --- 036
    document.querySelectorAll('.tuile__content[data-card="036"][data-claimed="false"]').forEach(trappist1F => {
        const clone036 = deepClone(ALL_CARDS.find(card => card.id === '036'));

        if (currentStar === '006') clone036.pwr += 2;
        else if (currentStar === '008') clone036.pwr -= 2;
        else if (currentStar === '004') clone036.pwr += 3;
        else if (currentStar === '021') clone036.pwr -= 3;

        playerHand.push(clone036);
        HtmlCards();
        trappist1F.dataset.claimed = true;
    });
    // --- 038
    const trappist1H = [...playerHand, ...playerDeck].find(card => card.id === '038');
    if (trappist1H) {
        trappist1H.mana = deepClone(ALL_CARDS.find(card => card.id === '038')).mana;
        trappist1H.mana -= (playerMana || 0);
        HtmlCards();
    }
    // --- 058
    const phoebe = document.querySelector('.tuile__content[data-card="058"]');
    if (phoebe) {
        const turnPhoebePlayed = Object.keys(history).find(key => history[key].includes('058'));

        if (parseInt(turnPhoebePlayed) === currentTurn - 1) {
            document.querySelectorAll('.waitingPhoebe').forEach(x => x.classList.remove('waitingPhoebe'));

            if (phoebe.dataset.valid === 'true') {
                const phoebeNeighbors = GetAllNeighbors(phoebe.parentNode);
                phoebeNeighbors.forEach(n => {
                    if (n.dataset.type === TYPES[0] && !n.classList.contains('destroyed')) {
                        AddToTuile(n, 3);
                    }
                })

                phoebe.dataset.valid = false;
            }
        }
    }
    // --- 086
    const theEggBell = document.querySelector('.tuile__content[data-card="086"]');
    if (theEggBell && history[currentTurn]?.length === 2) {
        AddToTuile(theEggBell, 3);
    }
    // --- 087
    const theEggBunny = document.querySelector('.tuile__content[data-card="087"]');
    if (theEggBunny) {
        const allNeighbors = GetAllNeighbors(theEggBunny.parentNode);
        const cardNeighbors = allNeighbors.filter(neighbor => neighbor.dataset.card && neighbor.dataset.type === TYPES[0]);
        const shuffled = cardNeighbors.sort(() => Math.random() - 0.5);
        const selectedNeighbors = shuffled.slice(0, 3);
        selectedNeighbors.forEach(neighbor => AddToTuile(neighbor, 1));
    }
    // --- 084
    const theEgg = document.querySelector('.tuile__content[data-card="084"]');
    if (theEgg) {
        const turnTheEggPlayed = Object.keys(history).find(key => history[key].includes('084'));

        if (parseInt(turnTheEggPlayed) === currentTurn - 2) {
            const rand = randomBetween(1, 3);
            const eggTuile = theEgg.parentNode;
            let eggTuileContent = eggTuile.querySelector('.tuile__content');
            const oldPower = parseInt(eggTuileContent.dataset.pwr);

            ClearOneTuile(eggTuile);
            eggTuileContent = eggTuile.querySelector('.tuile__content');
            SetHtmlInHexagon(eggTuileContent, deepClone(ALL_CARDS.find(c => c.id === `0${84 + rand}`)));
            AddToTuile(eggTuileContent, oldPower - ALL_CARDS.find(c => c.id === '084').pwr);
        }
    }
    // --- 085
    const theEggChicken = document.querySelector('.tuile__content[data-card="085"]');
    if (theEggChicken && currentTurn !== nbTurnMax) {
        manaBonus += 1;

        if (playerHand.length > 0) {
            const rand = randomBetween(0, playerHand.length - 1);
            const cardNode = document.querySelector(`.hand .card[data-id="${playerHand[rand].id}"]`);
            const cardPwr = playerHand[rand].pwr;

            if (cardPwr) {
                const allPlanets = document.querySelectorAll(`.tuile__content[data-type=${TYPES[0]}]`);
                const randomIndex = Math.floor(Math.random() * allPlanets.length);
                AddToTuile(allPlanets[randomIndex], cardPwr);
            }

            cardNode.style.transition = 'all 2s ease-in-out';
            setTimeout(() => {
                cardNode.style.transform = 'translate(-200px, -800px)';
                cardNode.style.opacity = '0';

                setTimeout(() => {
                    playerHand.splice(rand, 1);
                    HtmlCards();
                }, 2500);
            }, 10);
        }
    }
    // --- 088
    const gliese581B = document.querySelector('.tuile__content[data-card="088"]');
    if (gliese581B) {
        const oldBoost = parseInt(gliese581B.dataset.boost);
        const newBoost = parseInt(playerHand.length) * 2;
        AddToTuile(gliese581B, oldBoost * (-1));
        AddToTuile(gliese581B, newBoost);
        gliese581B.dataset.boost = newBoost;
    }
    // --- 099
    const andromedaeE = document.querySelector('.tuile__content[data-card="099"]');
    if (andromedaeE && playerMana > 0) {
        const oneInThree = randomBetween(1, 3);
        const originalParent = andromedaeE.parentNode;
        originalParent.classList.add('bigShake');

        if (oneInThree === 3) {
            setTimeout(() => {
                ClearOneTuile(originalParent);
                SetHtmlInHexagon(document.querySelector('.tuile[data-id="test"] .tuile__content'), deepClone(ALL_CARDS.find(c => c.id === '100')))
                MovePlatet('test', originalParent.dataset.id);
                ClearOneTuile(document.querySelector('.tuile[data-id="test"]'));
            }, 600);
        }

        setTimeout(() => {
            originalParent.classList.remove('bigShake');
        }, 750);
    }
    // --- 105
    const collectiona = document.querySelector('.tuile__content[data-card="105"]');
    if (collectiona) {
        const allElements = [];
        const allPlanetsOnBoard = document.querySelectorAll(`.terrain .tuile__content[data-type="${TYPES[0]}"]`);
        allPlanetsOnBoard.forEach(planet => {
            allElements.push(...ALL_CARDS.find(c => c.id === planet.dataset.card).element);
        });

        if (
            allElements.includes(ELEMENTS[0]) &&
            allElements.includes(ELEMENTS[1]) &&
            allElements.includes(ELEMENTS[2]) &&
            allElements.includes(ELEMENTS[3])
        ) {
            allPlanetsOnBoard.forEach(planet => {
                if (planet.dataset.card !== '105') AddToTuile(planet, 1);
            });
        }
    }
    // --- 106
    if (wasShivaDestroyedLastTurn) {
        const shiva = deepClone(ALL_CARDS.find(c => c.id === '106'));
        shiva.pwr = (wasShivaDestroyedLastTurn * 2);
        playerHand.push(shiva);
        HtmlCards();

        wasShivaDestroyedLastTurn = false;
    }
    // --- 114
    if (wasCerbereDestroyedLastTurn) {
        const cerbere = deepClone(ALL_CARDS.find(c => c.id === '114'));
        cerbere.pwr = wasCerbereDestroyedLastTurn;
        cerbere.mana = 0;
        playerHand.push(cerbere);
        HtmlCards();

        wasCerbereDestroyedLastTurn = false;
    }

    UpdateCurrentAllPointsScored();
}


function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}


function End() {
    currentTurn = null;
    btnNextTurn.dataset.front = 'waiting';
    manaNode.innerHTML = '';
    nbCardsInHandNode.innerHTML = '?';
    nbCardsInDeckNode.innerHTML = '?';

    popupEnd.classList.remove('hide');
    popupEnd.style.opacity = '0';
    popupEnd.querySelector('.end__popup').style.transform = 'translateX(1800px)';
    setTimeout(() => {
        popupEnd.style.transition = 'all .5s ease';
        popupEnd.style.opacity = '1';

        setTimeout(() => {
            popupEnd.querySelector('.end__popup').style.transition = 'all 1s ease';
            popupEnd.querySelector('.end__popup').style.transform = 'translateX(0)';
        }, 400);
    }, 10);

    const popupEndManche = popupEnd.querySelector('.end__manche');
    const popupEndScore = popupEnd.querySelector('.end__score');
    const popupEndToal = popupEnd.querySelector('.end__total');
    const popupEndResult = popupEnd.querySelector('.end__result');

    popupEndManche.innerHTML = nbManche;
    let allPoints = 0;
    let maxPointOnSinglePlent = -100;
    const allCardsWithPowerPlayed = document.querySelectorAll('.tuile__content[data-pwr]');
    allCardsWithPowerPlayed.forEach(card => {
        allPoints += parseInt(card.dataset.pwr);
        maxPointOnSinglePlent = Math.max(maxPointOnSinglePlent, parseInt(card.dataset.pwr));
    });
    if (allPoints < pointsToScore) youLose = true;

    popupEndScore.innerHTML = allPoints;
    popupEndToal.innerHTML = `${pointsToScore} énergie${pointsToScore > 1 ? 's' : ''} cosmique${pointsToScore > 1 ? 's' : ''}`;

    const localDex = JSON.parse(localStorage.getItem('dex'));
    if (!localDex.maxPointsScored || localDex.maxPointsScored < allPoints) {
        localDex.maxPointsScored = allPoints;
        localStorage.setItem('dex', JSON.stringify(localDex));
        UpdateHomeStats();
    }

    let foundSomeCards = false;
    if (allPoints >= 100 && !localDex.allCards.find(c => c.id === '072').found) {
        localDex.allCards.find(c => c.id === '072').found = Date.now();
        foundSomeCards = true;
    }
    if (maxPointOnSinglePlent >= 49 && !localDex.allCards.find(c => c.id === '071').found) {
        localDex.allCards.find(c => c.id === '071').found = Date.now();
        foundSomeCards = true;
    }
    if (nbManche >= 20 && !localDex.allCards.find(c => c.id === '077').found) {
        localDex.allCards.find(c => c.id === '077').found = Date.now();
    }
    if (
        nbManche >= 6 &&
        !localDex.allCards.find(c => c.id === '084').found &&
        !startingCardsChosen.some(cardId => ALL_CARDS.find(c => c.id === cardId).mana > 3)
    ) {
        localDex.allCards.find(c => c.id === '084').found = Date.now();
        localDex.allCards.find(c => c.id === '085').found = Date.now();
        localDex.allCards.find(c => c.id === '086').found = Date.now();
        localDex.allCards.find(c => c.id === '087').found = Date.now();
        foundSomeCards = true;
    }
    if (
        nbManche >= 10 &&
        !localDex.allCards.find(c => c.id === '094').found &&
        Array.from({ length: 12 }, (_, i) => `00${i + 1}`.slice(-3)).every(cardId => startingCardsChosen.includes(cardId))
    ) {
        localDex.allCards.find(c => c.id === '094').found = Date.now();
        foundSomeCards = true;
    }
    if (
        allPoints >= pointsToScore &&
        !localDex.allCards.find(c => c.id === '099').found
    ) {
        let nbOneCardSupToEleven = 0;
        allCardsWithPowerPlayed.forEach(card => {
            if (
                parseInt(card.dataset.pwr) >= 17 &&
                ALL_CARDS.find(c => c.id === card.dataset.card).mana === 1
            ) nbOneCardSupToEleven += 1;
        });
        if (nbOneCardSupToEleven >= 2 ) {
            localDex.allCards.find(c => c.id === '099').found = Date.now();
            localDex.allCards.find(c => c.id === '100').found = Date.now();
            foundSomeCards = true;
        }
    }
    if (
        allPoints >= pointsToScore &&
        !localDex.allCards.find(c => c.id === '113').found
    ) {
        const shiva = document.querySelector('.terrain .tuile__content[data-card="106"]');
        if (shiva && parseInt(shiva.dataset.pwr) >= 20) {
            localDex.allCards.find(c => c.id === '113').found = Date.now();
            foundSomeCards = true;
        }
    }

    if (foundSomeCards) {
        localStorage.setItem('dex', JSON.stringify(localDex));
        UnlockCollectionna(localDex);
        UpdateCollection();
        InitChangeDeck();
    }

    if (allPoints >= pointsToScore && !youLose) {
        popupEndResult.innerHTML = `Manche réussie`;

        popupEndBtnNext.classList.remove('hide');
        popupEndBtnHome.classList.add('hide');

        if (!localDex.maxManches || localDex.maxManches < nbManche) {
            localDex.maxManches = nbManche;
            localStorage.setItem('dex', JSON.stringify(localDex));
            UpdateHomeStats();
        }
    } else {
        popupEndResult.innerHTML = `Vous avez échoué`;

        popupEndBtnNext.classList.add('hide');
        popupEndBtnHome.classList.remove('hide');
    }
}


function UpdateCollection() {
    const localDex = JSON.parse(localStorage.getItem('dex'));
    const dexList = document.querySelector('.dex-list');

    dexList.innerHTML = '';
    ALL_CARDS.forEach(card => {
        const cardNode = document.createElement('li');
        cardNode.classList.add('dex-list__ele');
        cardNode.classList.toggle('dex-list__ele--not-found', !localDex.allCards.find(c => c.id === card.id)?.found);
        cardNode.innerHTML = `
            <img src="./assets/img/cards/${card.id}.png" alt="">
            <p class="pwr">${card.pwr || card.pwr === 0 ? card.pwr : ''}</p>
            <p class="mana">${ALL_CARDS.find(c => c.id === card.id)?.mana}</p>
        `;

        if (card.challenge && !localDex.allCards.find(c => c.id === card.id)?.found) {
            const div = document.createElement('div');
            div.classList.add('challenge');
            div.innerHTML = `
                <img class="challenge__img" src="./assets/img/chain.png" alt="">
                <p class="challenge__title">Challenge</p>
                <p class="challenge__txt">${card.challenge}</p>
            `;
            cardNode.appendChild(div)
        }

        dexList.appendChild(cardNode);
    });

    const percentageNode = document.querySelector('.dex__percentage');
    const totalFoundCards = localDex.allCards.filter(card => card.found).length;
    const percentage = Math.floor((totalFoundCards / ALL_CARDS.length) * 1000) / 10;
    percentageNode.innerHTML = `${percentage}%`;
}


function InitNavigation() {
    const localDex = JSON.parse(localStorage.getItem('dex'));

    const backBtns = document.querySelectorAll('.back');
    backBtns.forEach(btn => btn.addEventListener('click', GoHome));

    const btnToDex = document.querySelector('.nav__btn--dex');
    btnToDex.addEventListener('click', goDex);

    const btnToGame = document.querySelector('.nav__btn--game');
    btnToGame.addEventListener('click', goGame);

    const btnToDeck = document.querySelector('.nav__btn--deck');
    if (localDex.allCards.filter(c => c.found).length > 12) btnToDeck.classList.remove('hide');
    btnToDeck.addEventListener('click', goDeck);
}


function GoHome() {
    const currentPage = document.querySelector('.page:not(.hide)');
    const homePage = document.querySelector('.home.page');

    currentPage.classList.add('hide');
    homePage.classList.remove('hide');

    popupEnd.classList.add('hide');
}


function goDex() {
    const currentPage = document.querySelector('.page:not(.hide)');
    const dexPage = document.querySelector('.dex.page');

    currentPage.classList.add('hide');
    dexPage.classList.remove('hide');
}


function goGame() {
    const currentPage = document.querySelector('.page:not(.hide)');
    const gamePage = document.querySelector('.inGame.page');

    currentPage.classList.add('hide');
    gamePage.classList.remove('hide');

    startingCardsChosen = JSON.parse(localStorage.getItem('dex')).defaultDeck;
    nbManche = 1;

    document.querySelector('.hand').innerHTML = '';

    PreGame();
}


function goDeck() {
    const currentPage = document.querySelector('.page:not(.hide)');
    const deckPage = document.querySelector('.deck.page');

    currentPage.classList.add('hide');
    deckPage.classList.remove('hide');
}


function PreGame() {
    popupRecap.classList.remove('hide');
    popupRecap.style.transition = 'all 0s ease';
    popupRecap.style.opacity = '1';
    popupRecap.querySelector('.recap__popup').style.transition = 'all 0s ease';
    popupRecap.querySelector('.recap__popup').style.transform = 'translateX(1800px)';
    setTimeout(() => {
        popupRecap.style.transition = 'all .5s ease';
        popupRecap.querySelector('.recap__popup').style.transition = 'all 1s ease';
        popupRecap.querySelector('.recap__popup').style.transform = 'translateX(0)';
    }, 10);

    ClearTuiles();
    SelectStarAndDifficulty();

    document.querySelector('.target__manche').innerHTML = nbManche;
    document.querySelector('.target__ptns').innerHTML = 0;
    document.querySelector('.target__total').innerHTML = pointsToScore;
    popupRecapNbManche.innerHTML = nbManche;
    popupRecapObjectif.innerHTML = pointsToScore;

    popupRecap.querySelector('.recap__star--star').innerHTML = STARS.find(s => s.id === currentStar).name;
    if (nbManche < 5) popupRecap.querySelector('.recap__star').classList.add('hide');
    else popupRecap.querySelector('.recap__star').classList.remove('hide');
}


function ShowDeck() {
    popupRecap.querySelector('.recap__popup').style.transform = 'translateX(-1800px)';

    popupStart.classList.remove('hide');
    popupStart.style.opacity = '0';
    popupStart.querySelector('.start__popup').style.transform = 'translateX(1800px)';

    setTimeout(() => {
        popupStart.style.transition = 'all 1s ease';
        popupStart.style.opacity = '1';
        popupStart.querySelector('.start__popup').style.transition = 'all 1s ease';
        popupStart.querySelector('.start__popup').style.transform = 'translateX(0px)';

        setTimeout(() => {
            popupRecap.style.opacity = '0';

            setTimeout(() => {
                popupRecap.classList.add('hide');
            }, 500);
        }, 500);
    }, 10);

    bntStart.classList.remove('disabled');

    const deckNode = popupStart.querySelector('.start-list');
    let inner = '';

    startingCardsChosen.forEach(cardId => {
        inner += `
            <li class="start-list__ele" data-id="${cardId}">
                <img src="./assets/img/cards/${cardId}.png" alt="">
                <p class="pwr">${ALL_CARDS.find(c => c.id === cardId).pwr || ALL_CARDS.find(c => c.id === cardId).pwr === 0 ? ALL_CARDS.find(c => c.id === cardId).pwr : ''}</p>
                <p class="mana">${ALL_CARDS.find(c => c.id === cardId)?.mana}</p>
            </li>
        `;
    });

    deckNode.innerHTML = inner;
}


function InitializationGame() {
    if (bntStart.classList.contains('disabled')) return;
    bntStart.classList.add('disabled');

    ClearTuiles();
    SetHtmlInHexagon(document.querySelector('.tuile--sun .tuile__content'), STARS.find(s => s.id === currentStar));
    UpdateCurrentAllPointsScored();

    history = {};
    playerDeck = [];
    playerHand = [];
    currentTurn = 0;
    manaBonus = 0;
    manaMaxBonus = 0;
    tuilesDestroyToReset = [];
    listPwrDestroyInRound = [];
    btnCd = 0;
    spaceCd = 0;
    maxCardsInHand = 6;
    wasShivaDestroyedLastTurn = false;
    wasCerbereDestroyedLastTurn = false;
    youLose = false;
    popupOffrande.querySelector('.offrande__moins').innerHTML = '';
    popupOffrande.querySelector('.offrande__moins').classList.add('hide');
    popupOffrande.querySelector('.offrande__plus').innerHTML = '';
    popupOffrande.querySelector('.offrande__plus').classList.add('hide');

    SetPlayerDeck();
    SetStarPower();
    SetPlayerHand();

    playerHand.forEach(card => document.querySelector(`.hand [data-id="${card.id}"]`).style.opacity = '0');

    popupStart.querySelector('.start__popup').style.transform = 'translateX(-1800px)';
    setTimeout(() => {
        popupStart.style.opacity = '0';

        setTimeout(() => {
            popupStart.classList.add('hide');
            popupStart.querySelector('.start__popup').style.transform = '';
            popupStart.style.opacity = '';
        }, 500);

        let delay = 0;
        if (playerDeck.find(c => c.id === '072') || playerHand.find(c => c.id === '072')) {
            let i = 0;
            const cardGaiamotto = document.createElement('div');
            cardGaiamotto.classList.add('cardGaiamotto');
            body.querySelector('.inGame').appendChild(cardGaiamotto);
            const cardGaiamottoPopup = document.createElement('ul');
            cardGaiamottoPopup.classList.add('cardGaiamotto__popup');
            cardGaiamotto.appendChild(cardGaiamottoPopup);

            while (i < 4) {
                const card = document.createElement('li');
                card.classList.add('cardStart');
                card.dataset.i = i;
                cardGaiamottoPopup.appendChild(card);
                card.innerHTML = `
                    <img class="cardStart__img" src="./assets/img/cards/0${73 + i}.png" alt="">
                    <p class="mana">${ALL_CARDS.find(c => c.id === `0${73 + i}`).mana}</p>
                `;

                setTimeout(() => {
                    const trueI = parseInt(card.dataset.i);
                    card.style.transform = `translate(${window.innerWidth + (250 * (3 - trueI)) - 400}px, ${window.innerHeight}px)`;
                }, (500 * (3 - i)) + 1200);

                i += 1;
            }

            setTimeout(() => {
                cardGaiamotto.style.opacity = '1';
                cardGaiamottoPopup.style.opacity = '1';
            }, 10);

            delay += 2000;

            setTimeout(() => {
                cardGaiamotto.style.opacity = '0';

                setTimeout(() => {
                    body.querySelector('.inGame .cardGaiamotto').remove();
                }, 500);
            }, 3800);
        }
        if (playerDeck.find(c => c.id === '077') || playerHand.find(c => c.id === '077')) {
            setTimeout(() => {
                let i = 0;
                const cardGaiamotto = document.createElement('div');
                cardGaiamotto.classList.add('cardGaiamotto');
                body.querySelector('.inGame').appendChild(cardGaiamotto);
                const cardGaiamottoPopup = document.createElement('ul');
                cardGaiamottoPopup.classList.add('cardGaiamotto__popup', 'cardGaiamotto__popup--grid3');
                cardGaiamotto.appendChild(cardGaiamottoPopup);

                while (i < 6) {
                    const card = document.createElement('li');
                    card.classList.add('cardStart');
                    card.dataset.i = i;
                    cardGaiamottoPopup.appendChild(card);
                    card.innerHTML = `
                        <img class="cardStart__img" src="./assets/img/cards/0${78 + i}.png" alt="">
                        <p class="mana">${ALL_CARDS.find(c => c.id === `0${78 + i}`).mana}</p>
                    `;

                    setTimeout(() => {
                        const trueI = parseInt(card.dataset.i);
                        card.style.transform = `translate(${window.innerWidth + (250 * (3 - trueI)) - 400}px, ${window.innerHeight}px)`;
                    }, (500 * (3 - i)) + 2000);

                    i += 1;
                }

                setTimeout(() => {
                    cardGaiamotto.style.opacity = '1';
                    cardGaiamottoPopup.style.opacity = '1';
                }, 100);


                setTimeout(() => {
                    cardGaiamotto.style.opacity = '0';

                    setTimeout(() => {
                        body.querySelector('.inGame .cardGaiamotto').remove();
                    }, 500);
                }, 4300);
            }, delay);

            delay += 2100;
        }

        setTimeout(() => {
            playerHand.forEach(card => {
                setTimeout(() => {
                    document.querySelector(`.hand [data-id="${card.id}"]`).style.opacity = '1';
                }, delay);
                delay += 500;
            });

            setTimeout(() => {
                NextTurn();

                const localDex = JSON.parse(localStorage.getItem('dex'));
                [...playerHand, ...playerDeck].forEach(card => {
                    if (!localDex.allCards.find(c => c.id === card.id)) {
                        localDex.allCards.push({ id: card.id, found: false });
                        localStorage.setItem('dex', JSON.stringify(localDex));
                        UpdateCollection();
                        InitChangeDeck();
                    }
                    if (!localDex.allCards.find(c => c.id === card.id).found) {
                        localDex.allCards.find(c => c.id === card.id).found = Date.now();

                        localStorage.setItem('dex', JSON.stringify(localDex));
                        UpdateCollection();
                        InitChangeDeck();
                    }
                });
            }, delay + 500);
        }, delay + 500);
    }, 500);
}


function SetOffrande() {
    const localDex = JSON.parse(localStorage.getItem('dex'));
    offrandeChoiceAdd = '';
    offrandeChoiceDelete = '';
    popupOffrandeBtn.innerHTML = 'Garder mon deck tel quel';

    const availableCards = ALL_CARDS.filter(card =>
        !startingCardsChosen.some(handCard => handCard === card.id) && card.offrande
    );

    let offrandeList = [];
    while (offrandeList.length < 3) {
        const rand = randomBetween(0, availableCards.length - 1);
        const pick = availableCards[rand];

        if (!offrandeList.includes(pick.id)) {
            offrandeList.push(pick.id);
        }
    }
    // Si +70% de découverte et pas de nouvelles cartes dans l'Offrande, on relance
    if (localDex.allCards.filter(c => c.found).length / localDex.allCards.length > .7) {
        let hasNewCard = offrandeList.some(id => {
            const card = localDex.allCards.find(c => c.id === id);
            return card && !card.found;
        });
        
        if (!hasNewCard) {
            offrandeList = [];
            while (offrandeList.length < 3) {
                const rand = randomBetween(0, availableCards.length - 1);
                const pick = availableCards[rand];

                if (!offrandeList.includes(pick.id)) {
                    offrandeList.push(pick.id);
                }
            }

            // Si +85% de découverte et pas de nouvelles cartes dans l'Offrande, on relance
            if (localDex.allCards.filter(c => c.found).length / localDex.allCards.length > .85) {
                hasNewCard = offrandeList.some(id => {
                    const card = localDex.allCards.find(c => c.id === id);
                    return card && !card.found;
                });

                if (!hasNewCard) {
                    offrandeList = [];
                    while (offrandeList.length < 3) {
                        const rand = randomBetween(0, availableCards.length - 1);
                        const pick = availableCards[rand];

                        if (!offrandeList.includes(pick.id)) {
                            offrandeList.push(pick.id);
                        }
                    }
                }
            }
        }
    }

    // Deck
    const deckNode = popupOffrande.querySelector('.offrande-deckList');
    deckNode.innerHTML = '';

    startingCardsChosen.forEach(cardId => {
        const li = document.createElement('li');
        li.classList.add('offrande-deckList__ele');
        li.dataset.id = cardId;

        li.innerHTML = `
            <img src="./assets/img/cards/${cardId}.png" alt="">
            <p class="pwr">${ALL_CARDS.find(c => c.id === cardId).pwr || ALL_CARDS.find(c => c.id === cardId).pwr === 0 ? ALL_CARDS.find(c => c.id === cardId).pwr : ''}</p>
            <p class="mana">${ALL_CARDS.find(c => c.id === cardId)?.mana}</p>
        `;

        deckNode.appendChild(li);

        li.addEventListener('click', () => {
            const oldSelected = deckNode.querySelector('.selected');
            oldSelected?.classList.remove('selected');

            if (oldSelected !== li) li.classList.add('selected');

            offrandeChoiceDelete = deckNode.querySelector('.selected') ? deckNode.querySelector('.selected').dataset.id : '';
            popupOffrande.querySelector('.offrande__moins').classList.toggle('hide', !offrandeChoiceDelete);
            popupOffrande.querySelector('.offrande__moins').innerHTML = deckNode.querySelector('.selected') ? ALL_CARDS.find(c => c.id === deckNode.querySelector('.selected').dataset.id).name : '';

            if (offrandeChoiceAdd && offrandeChoiceDelete) {
                popupOffrandeBtn.innerHTML = 'Remplacer';
            } else {
                popupOffrandeBtn.innerHTML = 'Garder mon deck tel quel';
            }
        });
    });

    // Offrande
    const offrandeNode = popupOffrande.querySelector('.offrande-offrandeList');
    offrandeNode.innerHTML = '';

    offrandeList.forEach(cardId => {
        const li = document.createElement('li');
        li.classList.add('offrande-offrandeList__ele');
        li.dataset.id = cardId;

        li.innerHTML = `
            <div class="front">
                <img src="./assets/img/cards/000.png" alt="">
            </div>
            <div class="back">
                <img src="./assets/img/cards/${cardId}.png" alt="">
                <p class="pwr">${ALL_CARDS.find(c => c.id === cardId).pwr || ALL_CARDS.find(c => c.id === cardId).pwr === 0 ? ALL_CARDS.find(c => c.id === cardId).pwr : ''}</p>
                <p class="mana">${ALL_CARDS.find(c => c.id === cardId)?.mana}</p>
                ${!localDex.allCards.find(c => c.id === cardId)?.found ? `<div class="sparkles-container"></div>` : ''}
            </div>
        `;

        offrandeNode.appendChild(li);
        if (!localDex.allCards.find(c => c.id === cardId)?.found) new SparkleAnimation(li.querySelector('.sparkles-container'));

        li.addEventListener('click', () => {
            if (li.classList.contains('flipped')) {
                const oldSelected = offrandeNode.querySelector('.selected');
                oldSelected?.classList.remove('selected');

                if (oldSelected !== li) li.classList.add('selected')

                offrandeChoiceAdd = offrandeNode.querySelector('.selected') ? offrandeNode.querySelector('.selected').dataset.id : '';
                popupOffrande.querySelector('.offrande__plus').classList.toggle('hide', !offrandeChoiceAdd);
                popupOffrande.querySelector('.offrande__plus').innerHTML = offrandeNode.querySelector('.selected') ? ALL_CARDS.find(c => c.id === offrandeNode.querySelector('.selected').dataset.id).name : '';

                if (offrandeChoiceAdd && offrandeChoiceDelete) {
                    popupOffrandeBtn.innerHTML = 'Remplacer';
                } else {
                    popupOffrandeBtn.innerHTML = 'Garder mon deck tel quel';
                }
            } else {
                li.classList.add('flipped');
            }
        });
    });
}


function OffrandeAction() {
    if (offrandeChoiceAdd && offrandeChoiceDelete) {
        startingCardsChosen[startingCardsChosen.indexOf(offrandeChoiceDelete)] = offrandeChoiceAdd;

        const localDex = JSON.parse(localStorage.getItem('dex'));
        if (!localDex.allCards.find(c => c.id === offrandeChoiceAdd).found) {
            localDex.allCards.find(c => c.id === offrandeChoiceAdd).found = Date.now();

            localStorage.setItem('dex', JSON.stringify(localDex));
            UpdateCollection();
            InitChangeDeck();

            if (localDex.allCards.filter(c => c.found).length > 12) document.querySelector('.nav__btn--deck').classList.remove('hide');
        }
    }

    popupOffrande.querySelector('.offrande__popup').style.transform = 'translateX(-1800px)';
    setTimeout(() => {
        popupOffrande.style.opacity = '0';
        popupOffrande.classList.add('hide');
        PreGame();
    }, 510);
}


function NextManche() {
    popupEnd.querySelector('.end__popup').style.transform = 'translateX(-1800px)';

    popupOffrande.classList.remove('hide');
    popupOffrande.style.opacity = '0';
    popupOffrande.querySelector('.offrande__popup').style.transform = 'translateX(1800px)';

    setTimeout(() => {
        popupOffrande.style.transition = 'all 1s ease';
        popupOffrande.style.opacity = '1';
        popupOffrande.querySelector('.offrande__popup').style.transition = 'all 1s ease';
        popupOffrande.querySelector('.offrande__popup').style.transform = 'translateX(0px)';

        setTimeout(() => {
            popupEnd.style.opacity = '0';

            setTimeout(() => {
                popupEnd.classList.add('hide');
            }, 500);
        }, 500);
    }, 10);

    nbManche += 1;
    SetOffrande();

    setTimeout(() => {
        ClearTuiles();
        document.querySelectorAll('.hand .card').forEach(c => c.remove());
    }, 600);
}


function SelectStarAndDifficulty() {
    nbTurnMax = 6;

    switch (true) {
        case nbManche === 1:
            pointsToScore = 20;
            break;

        case nbManche === 2:
            pointsToScore = 24;
            break;

        case nbManche === 3:
            pointsToScore = 28;
            break;

        case nbManche === 4:
            pointsToScore = 30;
            break;

        case nbManche < 10:
            pointsToScore = 32;
            break;

        case nbManche < 15:
            pointsToScore = 34;
            break;

        case nbManche < 20:
            pointsToScore = 36;
            break;

        case nbManche < 25:
            pointsToScore = 38;
            break;

        case nbManche < 30:
            pointsToScore = 40;
            break;

        default:
            pointsToScore = 40 + (nbManche - 29);
            break;
    }

    if (nbManche > 4) currentStar = ChooseRandomStar();
    else currentStar = '001';

    pointsToScore += STARS.find(s => s.id === currentStar).difficulty;

    if (currentStar === '012') nbTurnMax = 5;
    else if (currentStar === '013') nbTurnMax = 7;
}


function ChooseRandomStar() {
    return STARS[randomBetween(0, STARS.length - 1)].id;
}


function UpdateHomeStats() {
    const stats = document.querySelector('.home .stats');
    const localDex = JSON.parse(localStorage.getItem('dex'));

    if (localDex && (localDex.maxPointsScored || localDex.maxManches)) {
        const statsScore = stats.querySelector('.stats__score--value');
        const statsManche = stats.querySelector('.stats__manche--value');

        stats.classList.remove('hide');
        statsScore.innerHTML = localDex.maxPointsScored;
        statsManche.innerHTML = localDex.maxManches;
    }
}


function SetStarPower() {
    const star = STARS.find(s => s.id === currentStar);

    switch (currentStar) {
        case '002':
            playerDeck.forEach(cardinDeck => {
                if (cardinDeck.type === TYPES[0] && cardinDeck.element.includes(ELEMENTS[0])) cardinDeck.pwr += 3;
            });
            break;

        case '003':
            playerDeck.forEach(cardinDeck => {
                if (cardinDeck.type === TYPES[0] && cardinDeck.element.includes(ELEMENTS[1])) cardinDeck.pwr += 3;
            });
            break;

        case '004':
            playerDeck.forEach(cardinDeck => {
                if (cardinDeck.type === TYPES[0] && cardinDeck.element.includes(ELEMENTS[2])) cardinDeck.pwr += 3;
            });
            break;

        case '005':
            playerDeck.forEach(cardinDeck => {
                if (cardinDeck.type === TYPES[0] && cardinDeck.element.includes(ELEMENTS[3])) cardinDeck.pwr += 3;
            });
            break;

        case '006':
            playerDeck.forEach(cardinDeck => {
                if (cardinDeck.type === TYPES[0] && cardinDeck.nature === NATURES[0]) cardinDeck.pwr += 2;
            });
            break;

        case '007':
            playerDeck.forEach(cardinDeck => {
                if (cardinDeck.type === TYPES[0] && cardinDeck.nature === NATURES[1]) cardinDeck.pwr += 2;
            });
            break;

        case '008':
            playerDeck.forEach(cardinDeck => {
                if (cardinDeck.type === TYPES[0] && cardinDeck.nature === NATURES[0]) cardinDeck.pwr -= 2;
            });
            break;

        case '009':
            playerDeck.forEach(cardinDeck => {
                if (cardinDeck.type === TYPES[0] && cardinDeck.nature === NATURES[1]) cardinDeck.pwr -= 2;
            });
            break;

        case '010':
            const starCeinturion = document.querySelector('.tuile--sun .tuile__content[data-card="010"]');
            starCeinturion.dataset.boost = 'false';
            break;

        case '011':
            const starAstrumSolitarius = document.querySelector('.tuile--sun .tuile__content[data-card="011"]');
            AddToTuile(starAstrumSolitarius, 6);
            starAstrumSolitarius.dataset.boost = 'true';
            break;

        case '014':
            const allVoidTuiles = Array.from(document.querySelectorAll('.tuile__content:not([data-card])'));

            let nbAsteroids = 6;
            while (nbAsteroids > 0) {
                const randomIndex = randomBetween(0, allVoidTuiles.length - 1);
                const voidHexagon = allVoidTuiles.splice(randomIndex, 1)[0];

                SetHtmlInHexagon(voidHexagon, ALL_CARDS.find(card => card.id === '022'));
                nbAsteroids -= 1;
            }
            break;

        case '015':
            playerDeck.push(deepClone(ALL_CARDS.find(card => card.id === '022')));
            playerDeck.push(deepClone(ALL_CARDS.find(card => card.id === '022')));

            nbCardsInDeckNode.innerHTML = playerDeck.length;
            break;

        case '017':
            playerDeck.forEach(cardinDeck => {
                if (
                    cardinDeck.type === TYPES[0] &&
                    (
                        cardinDeck.id === '015' ||
                        cardinDeck.id === '016' ||
                        cardinDeck.id === '017' ||
                        cardinDeck.id === '019' ||
                        cardinDeck.id === '020' ||
                        cardinDeck.id === '021' ||
                        cardinDeck.id === '023' ||
                        cardinDeck.id === '024' ||
                        cardinDeck.id === '025' ||
                        cardinDeck.id === '026'

                    )
                ) cardinDeck.pwr += 3;
            });
            break;

        case '018':
            playerDeck.forEach(cardinDeck => {
                if (
                    cardinDeck.type === TYPES[0] &&
                    (
                        cardinDeck.id === '015' ||
                        cardinDeck.id === '016' ||
                        cardinDeck.id === '017' ||
                        cardinDeck.id === '019' ||
                        cardinDeck.id === '020' ||
                        cardinDeck.id === '021' ||
                        cardinDeck.id === '023' ||
                        cardinDeck.id === '024' ||
                        cardinDeck.id === '025' ||
                        cardinDeck.id === '026'

                    )
                ) cardinDeck.pwr -= 3;
            });
            break;

        case '019':
            playerDeck.forEach(cardinDeck => {
                if (cardinDeck.type === TYPES[0] && cardinDeck.element.includes(ELEMENTS[0])) cardinDeck.pwr -= 3;
            });
            break;

        case '020':
            playerDeck.forEach(cardinDeck => {
                if (cardinDeck.type === TYPES[0] && cardinDeck.element.includes(ELEMENTS[1])) cardinDeck.pwr -= 3;
            });
            break;

        case '021':
            playerDeck.forEach(cardinDeck => {
                if (cardinDeck.type === TYPES[0] && cardinDeck.element.includes(ELEMENTS[2])) cardinDeck.pwr -= 3;
            });
            break;

        case '022':
            playerDeck.forEach(cardinDeck => {
                if (cardinDeck.type === TYPES[0] && cardinDeck.element.includes(ELEMENTS[3])) cardinDeck.pwr -= 3;
            });
            break;

        default:
            break;
    }
}


function UpdateCurrentAllPointsScored() {
    let allPoints = 0;

    const allCardsWithPowerPlayed = document.querySelectorAll('.tuile__content[data-pwr]');
    allCardsWithPowerPlayed.forEach(card => allPoints += parseInt(card.dataset.pwr));

    document.querySelector('.target__ptns').innerHTML = allPoints;
}


function InitChangeDeck() {
    const localDex = JSON.parse(localStorage.getItem('dex'));
    const deckList = document.querySelector('.deck-deckList');
    let allManaCost = 0;

    deckList.innerHTML = '';
    localDex.defaultDeck.forEach(cardId => {
        allManaCost += ALL_CARDS.find(c => c.id === cardId).mana;

        const cardNode = document.createElement('li');
        cardNode.classList.add('deck-deckList__ele');
        cardNode.dataset.id = cardId;
        cardNode.innerHTML = `
            <img src="./assets/img/cards/${cardId}.png" alt="">
            <p class="pwr">${ALL_CARDS.find(c => c.id === cardId).pwr || ALL_CARDS.find(c => c.id === cardId).pwr === 0 ? ALL_CARDS.find(c => c.id === cardId).pwr : ''}</p>
            <p class="mana">${ALL_CARDS.find(c => c.id === cardId)?.mana}</p>
        `;

        deckList.appendChild(cardNode);
        cardNode.addEventListener('click', () => {
            const oldSelected = deckList.querySelector('.deck-deckList__ele.selected');
            oldSelected?.classList.remove('selected');

            if (oldSelected !== cardNode) cardNode.classList.add('selected');

            if (cardNode.classList.contains('selected')) {
                deckRemove = cardNode.dataset.id;

                if (deckAdd) {
                    localDex.defaultDeck[localDex.defaultDeck.indexOf(deckRemove)] = deckAdd;
                    localStorage.setItem('dex', JSON.stringify(localDex));

                    deckAdd = '';
                    deckRemove = '';

                    document.querySelector('.deck .deck__cancel').classList.add('hide');

                    InitChangeDeck();
                }
            } else deckRemove = '';
        })
    });

    document.querySelector('.deck .cost__mana').innerHTML = Math.ceil(allManaCost / 12 * 10) / 10;

    const collectionList = document.querySelector('.deck-collectionList');
    collectionList.innerHTML = '';
    const allCardsFound = localDex.allCards.filter(card => card.found && !localDex.defaultDeck.includes(card.id) && ALL_CARDS.find(c => c.id === card.id).playable);
    allCardsFound.forEach(card => {
        const cardNode = document.createElement('li');
        cardNode.classList.add('deck-collectionList__ele');
        cardNode.dataset.id = card.id;
        cardNode.innerHTML = `
            <img src="./assets/img/cards/${card.id}.png" alt="">
            <p class="pwr">${ALL_CARDS.find(c => c.id === card.id).pwr || ALL_CARDS.find(c => c.id === card.id).pwr === 0 ? ALL_CARDS.find(c => c.id === card.id).pwr : ''}</p>
            <p class="mana">${ALL_CARDS.find(c => c.id === card.id)?.mana}</p>
            <p class="replace button-29">Utiliser</p>
        `;

        collectionList.appendChild(cardNode);
        cardNode.addEventListener('click', (e) => {
            if (e.target.classList.contains('replace')) {
                deckAdd = cardNode.dataset.id;
                window.scroll({ top: 178, behavior: "smooth" });
                document.querySelector('.deck .deck__cancel').classList.remove('hide');

                document.querySelectorAll('.deck-deckList__ele').forEach(c => c.classList.add('shake'));
            } else {
                const oldSelected = collectionList.querySelector('.deck-collectionList__ele.selected');
                oldSelected?.classList.remove('selected');

                if (oldSelected !== cardNode) cardNode.classList.add('selected');
            }
        })
    });

    FilterAction();
}


function InitLocalStorage() {
    let localDex = JSON.parse(localStorage.getItem('dex')) || {};

    if (!localDex.version) localDex.version = VERSION;

    if (!localDex.defaultDeck) localDex.defaultDeck = [...DEFAULT_DECK];

    if (!localDex.nbCardsDestroyed) localDex.nbCardsDestroyed = 0;

    if (!localDex.allCards) {
        localDex.allCards = ALL_CARDS.map((card, i) => {
            return {
                'id': card.id,
                'found': i <= 11 ? Date.now() : false
            }
        });
    } else {
        localDex = RevertGaiamotto(localDex);

        localDex.version = VERSION;
        const oldLd = localDex.allCards
        localDex.allCards = ALL_CARDS.map((card, i) => {
            return {
                'id': card.id,
                'found':
                    oldLd.find(c => c.id === card.id)?.found
                        ? oldLd.find(c => c.id === card.id).found
                        : false,
            }
        });
    }

    // Specials cards
    localDex = RevertGaiamotto(localDex);
    if (
        localDex.maxPointsScored &&
        localDex.maxPointsScored >= 100 &&
        !localDex.allCards.find(c => c.id === '072').found
    ) {
        localDex.allCards.find(c => c.id === '072').found = Date.now();
        localStorage.setItem('dex', JSON.stringify(localDex));
        UpdateCollection();
        InitChangeDeck();
    }

    if (
        localDex.maxManches &&
        localDex.maxManches >= 20 &&
        !localDex.allCards.find(c => c.id === '077').found
    ) {
        localDex.allCards.find(c => c.id === '077').found = Date.now();
        localStorage.setItem('dex', JSON.stringify(localDex));
        UpdateCollection();
        InitChangeDeck();
    }

    UnlockCollectionna(localDex);

    localStorage.setItem('dex', JSON.stringify(localDex));
}


function RevertGaiamotto(localDex) {
    if (
        localDex.maxPointsScored < 100 &&
        localDex.allCards.find(c => c.id === '072')?.found
    ) {
        ['072', '073', '074', '075', '076'].forEach(id => {
            const card = localDex.allCards.find(c => c.id === id);
            if (card) card.found = false;
        });

        if (localDex.defaultDeck.includes('072')) {
            const replacementCard = ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012']
                .find(cardId => !localDex.defaultDeck.includes(cardId));

            if (replacementCard) {
                localDex.defaultDeck = localDex.defaultDeck.map(cardId =>
                    cardId === '072' ? replacementCard : cardId
                );
            }
        }
    }

    return localDex;
}


function UnlockCollectionna(localDex) {
    const nbCardFound = localDex.allCards.filter(c => c.found).length;
    if (
        nbCardFound === localDex.allCards.length - 1 &&
        !localDex.allCards.filter(c => c.id === '105').found
    ) {
        localDex.allCards.find(c => c.id === '105').found = Date.now();
        localStorage.setItem('dex', JSON.stringify(localDex));
        UpdateCollection();
        InitChangeDeck();
    } else if (nbCardFound !== localDex.allCards.length) {
        localDex.allCards.find(c => c.id === '105').found = false;

        if (localDex.defaultDeck.includes('105')) {
            const replacementCard = ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012']
                .find(cardId => !localDex.defaultDeck.includes(cardId));

            if (replacementCard) {
                localDex.defaultDeck = localDex.defaultDeck.map(cardId =>
                    cardId === '105' ? replacementCard : cardId
                );
            }
        }

        localStorage.setItem('dex', JSON.stringify(localDex));
        UpdateCollection();
        InitChangeDeck();
    }
}


function MovePlatet(idStart, idFinish) {
    const parentStart = document.querySelector(`.tuile[data-id="${idStart}"]`);
    const parentFinish = document.querySelector(`.tuile[data-id="${idFinish}"]`);

    PowerRecalculation(parentStart, parentFinish);

    if (parentStart.querySelector('.tuile__content').dataset.card === '049') {
        document.querySelectorAll('.obstructed').forEach(t => t.classList.remove('obstructed'));
        GetAllNeighbors(parentFinish).forEach(n => {
            if (
                !n.dataset.card &&
                !n.parentNode.classList.contains('tuile--sun')
            ) {
                n.classList.add('obstructed');
            }
        })
    }

    parentFinish.innerHTML = parentStart.innerHTML;
    parentFinish.querySelector('.tuile__hexa pattern').id = `imagePattern${parentFinish.dataset.id}`;
    parentFinish.querySelector('.tuile__hexa path').setAttribute('fill', `url(#imagePattern${parentFinish.dataset.id})`);

    ClearOneTuile(parentStart);
}


function PowerRecalculation(parentStart, parentFinish) {
    const cardMoved = parentStart.querySelector('.tuile__content');
    const cardMovedId = cardMoved.dataset.card;
    const parentStartNeighbors = GetAllNeighbors(parentStart);
    const parentFinishNeighbors = GetAllNeighbors(parentFinish);
    const orbitRegulationCard = GetRegulationCard(cardMovedId);

    parentStartNeighbors.forEach(neighbor => {
        if (neighbor.dataset.pwr && neighbor.dataset.type === TYPES[0]) {
            AddToTuile(neighbor, (orbitRegulationCard * (-1)));
        }
        if (neighbor.dataset.card !== cardMovedId) {
            AddToTuile(cardMoved, (GetRegulationCard(neighbor.dataset.card) * (-1)));
        }
        if (neighbor.dataset.type === TYPES[3]) {
            AddToTuile(cardMoved, (GetRegulationStar(neighbor.dataset.card) * (-1)));
        }
    });
    parentFinishNeighbors.forEach(neighbor => {
        if (
            neighbor.dataset.pwr &&
            neighbor.dataset.type === TYPES[0] &&
            neighbor.dataset.card !== cardMovedId
        ) {
            AddToTuile(neighbor, orbitRegulationCard);
        }
        if (neighbor.dataset.card !== cardMovedId) {
            AddToTuile(cardMoved, GetRegulationCard(neighbor.dataset.card));
        }
        if (neighbor.dataset.type === TYPES[3]) {
            AddToTuile(cardMoved, GetRegulationStar(neighbor.dataset.card));
        }
    });
}


function GetRegulationCard(cardId) {
    const regulations = {
        '045': -4,
        '046': -1,
        '048': 2,
        '057': 1,
        '081': 1,
        '082': -1,
        '102': 1 * (-1),
    };
    return regulations[cardId] || 0;
}


function GetRegulationStar(starId) {
    const regulations = {
        '016': -2,
    };
    return regulations[starId] || 0;
}


function InitFilters() {
    const filters = document.querySelectorAll('.deck .filters__btn');
    filters.forEach(filter => filter.addEventListener('click', SelectFilter));

    const btnCancel = document.querySelector('.deck .deck__cancel');
    btnCancel.addEventListener('click', CancelSelectedCard);
}


function CancelSelectedCard() {
    document.querySelectorAll('.shake').forEach(c => c.classList.remove('shake'));
    document.querySelector('.deck-collectionList__ele.selected')?.classList.remove('selected');
    document.querySelector('.deck .deck__cancel').classList.add('hide');
    deckAdd = '';
    deckRemove = '';
    window.scroll({ top: 1050, behavior: "smooth" });
}


function SelectFilter() {
    const btn = this;
    const oldSelectedInSameType = document.querySelector(`.deck .filters__btn[data-data="${btn.dataset.data}"].filters__btn--selected`);
    oldSelectedInSameType?.classList.remove('filters__btn--selected');
    if (btn !== oldSelectedInSameType) btn.classList.add('filters__btn--selected');

    FilterAction();
}


function FilterAction() {
    const allCollectionCards = document.querySelectorAll('.deck-collectionList__ele');
    allCollectionCards.forEach(card => card.classList.remove('hide'));

    const activeFilters = document.querySelectorAll('.deck .filters__btn--selected');
    activeFilters.forEach(filter => {
        const filterData = filter.dataset.data;
        const filterValue = filter.dataset.value;

        if (filterData === 'type') {
            if (filterValue === TYPES[1]) {
                allCollectionCards.forEach(card => {
                    if (ALL_CARDS.find(c => c.id === card.dataset.id).type !== TYPES[1]) card.classList.add('hide');
                });

                return;
            } else if (filterValue === TYPES[0]) {
                allCollectionCards.forEach(card => {
                    if (ALL_CARDS.find(c => c.id === card.dataset.id).type !== TYPES[0]) card.classList.add('hide');
                });
            }
        }

        if (filterData === 'element') {
            switch (filterValue) {
                case 'feu':
                    allCollectionCards.forEach(card => {
                        if (!ALL_CARDS.find(c => c.id === card.dataset.id)?.element?.includes(ELEMENTS[0])) card.classList.add('hide');
                        if (card.dataset.id === '009') card.classList.remove('hide');
                    });
                    break;

                case 'eau':
                    allCollectionCards.forEach(card => {
                        if (!ALL_CARDS.find(c => c.id === card.dataset.id)?.element?.includes(ELEMENTS[1])) card.classList.add('hide');
                        if (card.dataset.id === '010') card.classList.remove('hide');
                    });
                    break;

                case 'air':
                    allCollectionCards.forEach(card => {
                        if (!ALL_CARDS.find(c => c.id === card.dataset.id)?.element?.includes(ELEMENTS[2])) card.classList.add('hide');
                        if (card.dataset.id === '011') card.classList.remove('hide');
                    });
                    break;

                case 'terre':
                    allCollectionCards.forEach(card => {
                        if (!ALL_CARDS.find(c => c.id === card.dataset.id)?.element?.includes(ELEMENTS[3])) card.classList.add('hide');
                        if (card.dataset.id === '012') card.classList.remove('hide');
                    });
                    break;

                default:
                    break;
            }
        }

        if (filterData === 'nature') {
            switch (filterValue) {
                case 'tellurique':
                    allCollectionCards.forEach(card => {
                        if (ALL_CARDS.find(c => c.id === card.dataset.id)?.nature !== NATURES[0]) card.classList.add('hide');
                        if (card.dataset.id === '013') card.classList.remove('hide');
                    });
                    break;
                case 'gazeuse':
                    allCollectionCards.forEach(card => {
                        if (ALL_CARDS.find(c => c.id === card.dataset.id)?.nature !== NATURES[1]) card.classList.add('hide');
                        if (card.dataset.id === '014') card.classList.remove('hide');
                    });
                    break;
                case 'naine':
                    allCollectionCards.forEach(card => {
                        if (ALL_CARDS.find(c => c.id === card.dataset.id)?.nature !== NATURES[2]) card.classList.add('hide');
                    });
                    break;

                default:
                    break;
            }
        }
    });
}


function Keypress(e) {
    const gamePage = document.querySelector('.inGame.page');
    if (gamePage.classList.contains('hide')) return;

    let cardToSelect;
    switch (true) {
        case e.key === '&' || e.key === '1':
            cardToSelect = document.querySelector('.hand .card:nth-child(1)');
            break;

        case e.key === 'é' || e.key === '2':
            cardToSelect = document.querySelector('.hand .card:nth-child(2)');
            break;

        case e.key === '"' || e.key === '3':
            cardToSelect = document.querySelector('.hand .card:nth-child(3)');
            break;

        case e.key === "'" || e.key === '4':
            cardToSelect = document.querySelector('.hand .card:nth-child(4)');
            break;

        case e.key === '(' || e.key === '5':
            cardToSelect = document.querySelector('.hand .card:nth-child(5)');
            break;

        case e.key === '-' || e.key === '6':
            cardToSelect = document.querySelector('.hand .card:nth-child(6)');
            break;

        case e.key === ' ':
            if ((Date.now() - spaceCd) < 1000) break;

            if (currentTurn) btnNextTurn.click();
            else if (!popupEnd.classList.contains('hide')) popupEnd.querySelector('.end__btn:not(.hide)').click();
            else if (!popupStart.classList.contains('hide')) bntStart.click();
            else if (!popupRecap.classList.contains('hide')) popupRecapBtn.click();

            spaceCd = Date.now();
            break;
    }

    if (cardToSelect) {
        const oldSelected = document.querySelector('.hand .card--selected');
        oldSelected?.classList.remove('card--selected');
        selectedCardNode = null

        if (oldSelected !== cardToSelect) {
            cardToSelect?.classList.add('card--selected');
            selectedCardNode = cardToSelect;
        }
    }
}


function GetCardTruePwr(tuileId) {
    MovePlatet(tuileId ,'test');

    const card = document.querySelector('.tuile[data-id="test"] .tuile__content');

    let truePwr = parseInt(card?.dataset.pwr) || 0;
    if (card.dataset.pwr && document.querySelector('.tuile__content[data-card="023"]')) truePwr -= 1;

    MovePlatet('test', tuileId);
    ClearOneTuile('test');
    
    return truePwr;
}
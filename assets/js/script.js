const body = document.querySelector('body');
const tuiles = document.querySelectorAll('.tuile');
const btnNextTurn = document.querySelector('.nextTurn');
const manaNode = document.querySelector('.mana');
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
let cardsDestroyToReset;
let btnCd;
let offrandeChoiceAdd;
let offrandeChoiceDelete;
let nbManche;
let currentStar;
let pointsToScore;
let deckAdd;
let deckRemove;

Init();
function Init() {
    document.querySelector('.home__version').innerHTML = `v ${VERSION}`;

    tuiles.forEach(tuile => {
        tuile.addEventListener('click', SelectTuile);
        tuile.addEventListener('mouseover', OverTuile);
        tuile.addEventListener('mouseleave', LeaveTuile);
    });

    btnNextTurn.addEventListener('click', NextTurn);
    bntStart.addEventListener('click', InitializationGame);
    popupOffrandeBtn.addEventListener('click', OffrandeAction);
    popupRecapBtn.addEventListener('click', ShowDeck);
    popupEndBtnNext.addEventListener('click', NextManche);
    popupEndBtnHome.addEventListener('click', GoHome);

    InitLocalStorage();
    UpdateCollection();
    InitChangeDeck();
    InitNavigation();
    UpdateHomeStats();
}


function ClearTuiles() {
    tuiles.forEach(tuile => {
        // <svg class="tuile__hexa" viewBox="0 0 100 88" fill="none" xmlns="http://www.w3.org/2000/svg">
        //     <path d="M23.5571 3.19824C24.4503 1.65123 26.1009 0.698242 27.8872 0.698242L72.1137 0.698242C73.9001 0.698242 75.5507 1.65124 76.4439 3.19824L98.5571 41.4995C99.4503 43.0465 99.4503 44.9525 98.5571 46.4995L76.4439 84.8008C75.5507 86.3478 73.9001 87.3008 72.1137 87.3008L27.8872 87.3008C26.1009 87.3008 24.4503 86.3478 23.5571 84.8008L1.44386 46.4995C0.5507 44.9525 0.550701 43.0465 1.44386 41.4995L23.5571 3.19824Z" fill="white" fill-opacity="0.2"/>
        // </svg>
        tuile.innerHTML = `
            <svg class="tuile__bg" viewBox="0 0 100 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.5571 3.19824C24.4503 1.65123 26.1009 0.698242 27.8872 0.698242L72.1137 0.698242C73.9001 0.698242 75.5507 1.65124 76.4439 3.19824L98.5571 41.4995C99.4503 43.0465 99.4503 44.9525 98.5571 46.4995L76.4439 84.8008C75.5507 86.3478 73.9001 87.3008 72.1137 87.3008L27.8872 87.3008C26.1009 87.3008 24.4503 86.3478 23.5571 84.8008L1.44386 46.4995C0.5507 44.9525 0.550701 43.0465 1.44386 41.4995L23.5571 3.19824Z" fill="rgba(255, 255, 255, .2)"/>
            </svg>
            <div class="tuile__content"></div>
        `;
    })
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
    if (playerDeck.length > 0 && playerHand.length < 6) {
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
}


function DragAnimation(e) {
    const cardDragged = this;

    cardDragged.classList.add('dragged');
    cardDragged.dataset.oldX = e.clientX;
    cardDragged.dataset.originX = e.clientX;
    cardDragged.dataset.originY= e.clientY;
    cardDragged.dataset.scale = 1;
    cardDragged.dataset.rotate = 0;

    document.onmousemove = Drag;
	document.onmouseup = Drop;
}


function Drag(e) {
    const cardDragged = document.querySelector('.dragged');
    const currentScale = parseFloat(cardDragged.dataset.scale);
    const currentRotate = parseFloat(cardDragged.dataset.rotate);
    const scale = Math.max(currentScale - 0.01, .5);
    const rotate = e.clientX > parseInt(cardDragged.dataset.oldX) 
        ? Math.min(currentRotate + 0.05, 5)
        : Math.max(currentRotate - 0.05, -5);

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
    if ((Date.now() - btnCd) < 1200) return;

    if (currentTurn !== 0) PowerEndOfTurn();

    if (currentTurn === nbTurnMax) {
        End();
    } else {
        currentTurn += 1;
        playerMana = currentTurn + manaBonus + manaMaxBonus;
        manaBonus = 0;

        const proximaC = playerDeck.find(card => card.id === '030');
        const proximaD = playerDeck.find(card => card.id === '031');
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
                    const muaraeD = document.querySelector('.tuile__content[data-card="041"]');
                    muaraeD.parentNode.querySelector('.tuile__hexa').style.filter = 'brightness(2)';
                    setTimeout(() => { muaraeD.parentNode.querySelector('.tuile__hexa').style.filter = 'brightness(.6)'; }, 200);
                    setTimeout(() => { muaraeD.parentNode.querySelector('.tuile__hexa').style.filter = 'brightness(1.5)'; }, 600);
                    setTimeout(() => { muaraeD.parentNode.querySelector('.tuile__hexa').style.removeProperty('filter'); }, 950);
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
    const neighborsNode = GetAllNeighbors(tuileNode);
    const tuileContent = tuileNode.querySelector('.tuile__content');
    const lastCardPlayed = GetLastCardPlayed() ? ALL_CARDS.find(card => card.id === GetLastCardPlayed()) : null;

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
    const hecate = document.querySelector('.tuile__content[data-card="045"]');
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
            const allPlanetsOnBoardExecptEris = Array.from(document.querySelectorAll(`.tuile__content[data-type="${TYPES[0]}"][data-card]:not([data-card="026"])`));
            const randomIndex = randomBetween(0, allPlanetsOnBoardExecptEris.length - 1);
            allPlanetsOnBoardExecptEris[randomIndex].classList.add('destroyed');
            cardsDestroyToReset.push(allPlanetsOnBoardExecptEris[randomIndex].dataset.card);

            // Animation
            const svg = allPlanetsOnBoardExecptEris[randomIndex].parentNode.querySelector('.tuile__hexa path');
            if (svg) {
                svg.style.transition = 'filter .5s ease-in-out';
                svg.style.filter = 'invert(1)';
                setTimeout(() => {
                    svg.style.filter = 'invert(0)';
                    allPlanetsOnBoardExecptEris[randomIndex].style.transition = 'all 2s ease';
                    allPlanetsOnBoardExecptEris[randomIndex].style.opacity = '0';

                    const content = allPlanetsOnBoardExecptEris[randomIndex].parentNode.querySelector('.tuile__hexa');
                    content.style.transition = 'all 2s ease';
                    content.style.opacity = '0';

                    setTimeout(() => {
                        allPlanetsOnBoardExecptEris[randomIndex].parentNode.innerHTML = `
                            <svg class="tuile__bg" viewBox="0 0 100 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.5571 3.19824C24.4503 1.65123 26.1009 0.698242 27.8872 0.698242L72.1137 0.698242C73.9001 0.698242 75.5507 1.65124 76.4439 3.19824L98.5571 41.4995C99.4503 43.0465 99.4503 44.9525 98.5571 46.4995L76.4439 84.8008C75.5507 86.3478 73.9001 87.3008 72.1137 87.3008L27.8872 87.3008C26.1009 87.3008 24.4503 86.3478 23.5571 84.8008L1.44386 46.4995C0.5507 44.9525 0.550701 43.0465 1.44386 41.4995L23.5571 3.19824Z" fill="rgba(255, 255, 255, .2)"/>
                            </svg>
                            <div class="tuile__content"></div>
                        `;

                        UpdateCurrentAllPointsScored();
                    }, 2000);
                }, 500);
            }
            break;

        case '027':
            if (lastCardPlayed) {
                const lastCardPlayedNode = document.querySelector(`.tuile__content[data-card="${lastCardPlayed.id}"]`)
                const lastCardPlayedActualPower = lastCardPlayedNode.dataset.pwr ? parseInt(lastCardPlayedNode.dataset.pwr) : 0;
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
                    neighborNode.classList.add('destroyed');
                    cardsDestroyToReset.push(neighborNode.dataset.card);

                    // Animation
                    const svg = neighborNode.parentNode.querySelector('.tuile__hexa path');
                    if (svg) {
                        svg.style.transition = 'filter .5s ease-in-out';
                        svg.style.filter = 'invert(1)';

                        setTimeout(() => {
                            svg.style.filter = 'invert(0)';
                            svg.style.transition = 'all 2s ease';
                            svg.style.opacity = '0';

                            const content = neighborNode.parentNode.querySelector('.tuile__hexa');
                            content.style.transition = 'all 2s ease';
                            content.style.opacity = '0';

                            setTimeout(() => {
                                neighborNode.parentNode.innerHTML = `
                                    <svg class="tuile__bg" viewBox="0 0 100 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M23.5571 3.19824C24.4503 1.65123 26.1009 0.698242 27.8872 0.698242L72.1137 0.698242C73.9001 0.698242 75.5507 1.65124 76.4439 3.19824L98.5571 41.4995C99.4503 43.0465 99.4503 44.9525 98.5571 46.4995L76.4439 84.8008C75.5507 86.3478 73.9001 87.3008 72.1137 87.3008L27.8872 87.3008C26.1009 87.3008 24.4503 86.3478 23.5571 84.8008L1.44386 46.4995C0.5507 44.9525 0.550701 43.0465 1.44386 41.4995L23.5571 3.19824Z" fill="rgba(255, 255, 255, .2)"/>
                                    </svg>
                                    <div class="tuile__content"></div>
                                `;

                                UpdateCurrentAllPointsScored();
                            }, 2000);
                        }, 500);
                    }
                }
            });
            break;

        case '044':
            const allTuilesVoid = Array.from(document.querySelectorAll('.tuile:not(.tuile--sun) .tuile__content:not([data-card]):not(.obstructed)'));
            const randIndex = randomBetween(0, allTuilesVoid.length - 1);
            SetHtmlInHexagon(allTuilesVoid[randIndex], deepClone(ALL_CARDS.find(card => card.id === '045')));
            RevealPower(allTuilesVoid[randIndex].parentNode, deepClone(ALL_CARDS.find(card => card.id === '045')))
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
            const allPlanetsAndMoonsExept052 = Array.from(document.querySelectorAll(`.tuile__content[data-type="planet"]:not([data-card="052"]), .tuile__content[data-type="lune"]:not([data-card="052"])`));
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
                const parent = voidNeighbors052[randomVoidNeighborIndex].parentNode;
                parent.innerHTML = allPlanetsAndMoonsExept052[randomCardIndex].parentNode.innerHTML;
                parent.querySelector('.tuile__hexa pattern').id = `imagePattern${parent.dataset.id}`;
                parent.querySelector('.tuile__hexa path').setAttribute('fill', `url(#imagePattern${parent.dataset.id})`);

                allPlanetsAndMoonsExept052[randomCardIndex].parentNode.innerHTML = `
                    <svg class="tuile__bg" viewBox="0 0 100 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.5571 3.19824C24.4503 1.65123 26.1009 0.698242 27.8872 0.698242L72.1137 0.698242C73.9001 0.698242 75.5507 1.65124 76.4439 3.19824L98.5571 41.4995C99.4503 43.0465 99.4503 44.9525 98.5571 46.4995L76.4439 84.8008C75.5507 86.3478 73.9001 87.3008 72.1137 87.3008L27.8872 87.3008C26.1009 87.3008 24.4503 86.3478 23.5571 84.8008L1.44386 46.4995C0.5507 44.9525 0.550701 43.0465 1.44386 41.4995L23.5571 3.19824Z" fill="rgba(255, 255, 255, .2)"/>
                    </svg>
                    <div class="tuile__content"></div>
                `;
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
            const allPlanetsOnBoard = Array.from(document.querySelectorAll(`.tuile__content[data-type="planet"]`));
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
                parent.innerHTML = allPlanetsOnBoard[randomCardI].parentNode.innerHTML;
                parent.querySelector('.tuile__hexa pattern').id = `imagePattern${parent.dataset.id}`;
                parent.querySelector('.tuile__hexa path').setAttribute('fill', `url(#imagePattern${parent.dataset.id})`);

                allPlanetsOnBoard[randomCardI].parentNode.innerHTML = `
                    <svg class="tuile__bg" viewBox="0 0 100 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.5571 3.19824C24.4503 1.65123 26.1009 0.698242 27.8872 0.698242L72.1137 0.698242C73.9001 0.698242 75.5507 1.65124 76.4439 3.19824L98.5571 41.4995C99.4503 43.0465 99.4503 44.9525 98.5571 46.4995L76.4439 84.8008C75.5507 86.3478 73.9001 87.3008 72.1137 87.3008L27.8872 87.3008C26.1009 87.3008 24.4503 86.3478 23.5571 84.8008L1.44386 46.4995C0.5507 44.9525 0.550701 43.0465 1.44386 41.4995L23.5571 3.19824Z" fill="rgba(255, 255, 255, .2)"/>
                    </svg>
                    <div class="tuile__content"></div>
                `;

                AddToTuile(parent.querySelector('.tuile__content'), 4);
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
                    AddToTuile(neighborNode, maxPwr - parseInt(neighborNode.dataset.pwr));
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

        default:
            break;
    }

    if (
        document.querySelector('.tuile__content[data-card="023"]') &&
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
    if (trappist1G) AddToTuile(trappist1G, 1);

    const cancriD = document.querySelector('.tuile__content[data-card="046"]');
    if (cancriD && cardRevealed.type === TYPES[0]) {
        neighborsNode.forEach(neighborNode => {
            if (neighborNode.dataset.card === '046') AddToTuile(tuileContent, -1);
        });
    }

    const titan = document.querySelector('.tuile__content[data-card="048"]');
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

    const callisto = document.querySelector('.tuile__content[data-card="057"]');
    if (callisto && cardRevealed.type === TYPES[0]) {
        neighborsNode.forEach(neighborNode => {
            if (neighborNode.dataset.card === '057') AddToTuile(tuileContent, 1);
        });
    }

    const purpleQuantum = document.querySelector('.tuile__content[data-card="081"]');
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

    const quanticaLaranja = document.querySelector('.tuile__content[data-card="082"]');
    if (quanticaLaranja) {
        if (cardRevealed.type === TYPES[0]) {
            neighborsNode.forEach(neighborNode => {
                if (neighborNode.dataset.card === '082') AddToTuile(tuileContent, -1);
            });
        }
    }

    // Destroy treatment
    cardsDestroyToReset.forEach(cardIdDestroyed => {
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
                    if (neighbor.dataset.pwr && neighbor.type === TYPES[0]) AddToTuile(neighbor, 4);
                });
                break;

            case '046':
                const allCancriDNeighbors = GetAllNeighbors(cancriD.parentNode);
                allCancriDNeighbors.forEach(neighbor => {
                    if (neighbor.dataset.pwr && neighbor.type === TYPES[0]) AddToTuile(neighbor, 1);
                });
                break;

            case '048':
                const allTitanNeighbors = GetAllNeighbors(titan.parentNode);
                allTitanNeighbors.forEach(neighbor => {
                    if (neighbor.dataset.pwr && neighbor.type === TYPES[0]) AddToTuile(neighbor, -2);
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
                    if (neighbor.dataset.pwr && neighbor.type === TYPES[0]) AddToTuile(neighbor, -1);
                });
                break;

            case '081':
                const allPurpleQuantumNeighbors = GetAllNeighbors(purpleQuantum.parentNode);
                allPurpleQuantumNeighbors.forEach(neighbor => {
                    if (neighbor.dataset.pwr && neighbor.type === TYPES[0]) AddToTuile(neighbor, -1);
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
                    if (neighbor.dataset.pwr && neighbor.type === TYPES[0]) AddToTuile(neighbor, 1);
                });
                break;

            default:
                break;
        }

        // suppr du tableau après traitement
        cardsDestroyToReset = cardsDestroyToReset.filter(id => id !== cardIdDestroyed);
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
        playerHand.push(deepClone(ALL_CARDS.find(card => card.id === '036')));
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

    UpdateCurrentAllPointsScored();
}


function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}


function End() {
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

    popupEndScore.innerHTML = allPoints;
    popupEndToal.innerHTML = `${pointsToScore} énergie cosmique`;

    const localDex = JSON.parse(localStorage.getItem('dex'));
    if (!localDex.maxPointsScored || localDex.maxPointsScored < allPoints) {
        localDex.maxPointsScored = allPoints;
        localStorage.setItem('dex', JSON.stringify(localDex));
        UpdateHomeStats();
    }

    if (allPoints >= 100 && !localDex.allCards.find(c => c.id === '072').found) {
        localDex.allCards.find(c => c.id === '072').found = Date.now();
        localStorage.setItem('dex', JSON.stringify(localDex));
        UpdateCollection();
        InitChangeDeck();
    }
    if (maxPointOnSinglePlent >= 49 && !localDex.allCards.find(c => c.id === '071').found) {
        localDex.allCards.find(c => c.id === '071').found = Date.now();
        localStorage.setItem('dex', JSON.stringify(localDex));
        UpdateCollection();
        InitChangeDeck();
    }

    if (allPoints >= pointsToScore) {
        popupEndResult.innerHTML = `Manche réussie`;

        popupEndBtnNext.classList.remove('hide');
        popupEndBtnHome.classList.add('hide');

        if (!localDex.maxManches || localDex.maxManches < nbManche) {
            localDex.maxManches = nbManche;
            localStorage.setItem('dex', JSON.stringify(localDex));
            UpdateHomeStats();
        }
        if (
            localDex.maxManches >= 20 &&
            !localDex.allCards.find(c => c.id === '077').found
        ) {
            localDex.allCards.find(c => c.id === '077').found = Date.now();
            localStorage.setItem('dex', JSON.stringify(localDex));
            UpdateCollection();
            InitChangeDeck();
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
    })
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
                <p class="pwr">${ALL_CARDS.find(c => c.id === cardId).pwr ? ALL_CARDS.find(c => c.id === cardId).pwr : ''}</p>
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

    history = {};
    playerDeck = [];
    playerHand = [];
    currentTurn = 0;
    manaBonus = 0;
    manaMaxBonus = 0;
    cardsDestroyToReset = [];
    btnCd = 0;
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

    const offrandeList = [];
    while (offrandeList.length < 3) {
        const rand = randomBetween(0, availableCards.length - 1);
        const pick = availableCards[rand];

        if (!offrandeList.includes(pick.id)) {
            offrandeList.push(pick.id);
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
        if(!localDex.allCards.find(c => c.id === cardId)?.found) new SparkleAnimation(li.querySelector('.sparkles-container'));

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

    deckList.innerHTML = '';
    localDex.defaultDeck.forEach(cardId => {
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

                    InitChangeDeck();
                    setTimeout(() => {
                        window.scroll({ top: 150, behavior: "smooth" });
                    }, 50);
                }
            } else deckRemove = '';
        })
    });

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
        `;

        collectionList.appendChild(cardNode);
        cardNode.addEventListener('click', () => {
            const oldSelected = collectionList.querySelector('.deck-collectionList__ele.selected');
            oldSelected?.classList.remove('selected');

            if (oldSelected !== cardNode) cardNode.classList.add('selected');

            if (cardNode.classList.contains('selected')) {
                deckAdd = cardNode.dataset.id;

                if (deckRemove) {
                    localDex.defaultDeck[localDex.defaultDeck.indexOf(deckRemove)] = deckAdd;
                    localStorage.setItem('dex', JSON.stringify(localDex));

                    deckAdd = '';
                    deckRemove = '';

                    InitChangeDeck();
                    setTimeout(() => {
                        window.scroll({ top: 150, behavior: "smooth" });
                    }, 50);
                }
            } else deckAdd = '';
        })
    });
}


function InitLocalStorage() {
    let localDex = JSON.parse(localStorage.getItem('dex')) || {};

    if (!localDex.version) localDex.version = VERSION;

    if (!localDex.defaultDeck) localDex.defaultDeck = [...DEFAULT_DECK];

    if (!localDex.allCards) {
        localDex.allCards = ALL_CARDS.map((card, i) => {
            return {
                'id': card.id,
                'found': i <= 11 ? Date.now() : false
            }
        });
    } else if (localDex.version !== VERSION) {
        localDex = RevertGaiamotto(localDex);

        localDex.version = VERSION;
        const oldLd = localDex.allCards
        localDex.allCards = ALL_CARDS.map((card, i) => {
            return {
                'id': card.id,
                'found':
                    oldLd.find(c => c.id === card.id)?.found
                        ? oldLd.find(c => c.id === card.id).found
                        : i <= 11
                            ? Date.now()
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

    localStorage.setItem('dex', JSON.stringify(localDex));
}


function RevertGaiamotto(localDex) {
    if (
        localDex.maxPointsScored < 100 &&
        localDex.allCards.find(c => c.id === '072').found
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


function MovePlatet(idStart, idFinish) {
    const parentStart = document.querySelector(`.tuile[data-id="${idStart}"]`);
    const parentFinish = document.querySelector(`.tuile[data-id="${idFinish}"]`);

    PowerRecalculation(parentStart, parentFinish);

    parentFinish.innerHTML = parentStart.innerHTML;
    parentFinish.querySelector('.tuile__hexa pattern').id = `imagePattern${parentFinish.dataset.id}`;
    parentFinish.querySelector('.tuile__hexa path').setAttribute('fill', `url(#imagePattern${parentFinish.dataset.id})`);

    parentStart.innerHTML = `
        <svg class="tuile__bg" viewBox="0 0 100 88" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.5571 3.19824C24.4503 1.65123 26.1009 0.698242 27.8872 0.698242L72.1137 0.698242C73.9001 0.698242 75.5507 1.65124 76.4439 3.19824L98.5571 41.4995C99.4503 43.0465 99.4503 44.9525 98.5571 46.4995L76.4439 84.8008C75.5507 86.3478 73.9001 87.3008 72.1137 87.3008L27.8872 87.3008C26.1009 87.3008 24.4503 86.3478 23.5571 84.8008L1.44386 46.4995C0.5507 44.9525 0.550701 43.0465 1.44386 41.4995L23.5571 3.19824Z" fill="rgba(255, 255, 255, .2)"/>
        </svg>
        <div class="tuile__content"></div>
    `;
}


function PowerRecalculation(parentStart, parentFinish) {
    const cardIdMoved = parentStart.querySelector('.tuile__content').dataset.card;

    const parentStartNeighbors = GetAllNeighbors(parentStart);
    const parentFinishNeighbors = GetAllNeighbors(parentFinish);
    let orbitRegulation = 0;

    switch (cardIdMoved) {
        case '045':
            orbitRegulation = -4;
            break;

        case '046':
            orbitRegulation = -1;
            break;

        case '048':
            orbitRegulation = 2;
            break;

        case '057':
            orbitRegulation = 1;
            break;

        case '081':
            orbitRegulation = 1;
            break;

        case '082':
            orbitRegulation = -1;
            break;

        default:
            break;
    }

    parentStartNeighbors.forEach(neighbor => {
        if (neighbor.dataset.pwr && neighbor.type === TYPES[0]) AddToTuile(neighbor, (orbitRegulation * (-1)));
    });
    parentFinishNeighbors.forEach(neighbor => {
        if (neighbor.dataset.pwr && neighbor.type === TYPES[0]) AddToTuile(neighbor, orbitRegulation);
    });
}
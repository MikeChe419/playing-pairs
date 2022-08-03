(() => {

    //Создаем и возвращаем заголовок игры
    function createAppTitle(title) {
        const appTitle = document.createElement('h2');
        appTitle.textContent = title;
        appTitle.classList.add('app-title');
        return appTitle;
    }

    //Создаем и возвращаем форму для ввода кол-ва карточек
    function createNumberOfCardsForm() {
        const form = document.createElement('form');
        const input = document.createElement('input');
        const button = document.createElement('button');

        form.classList.add('number-card_form');
        form.innerText = 'количество карточек по вертикали/горизонтали';
        input.classList.add('number-card_input');
        input.type = 'text';
        input.placeholder = 'Введите четное число от 2 до 10';
        button.classList.add('number-card_button');
        button.textContent = 'Начать игру';
        form.append(input);
        form.append(button);

        return {
            form,
            input,
            button,
        };
    };

    let timerId;

    //Отрисовываем формы и передаем валидное число карточек
    function getNumberOfCards () {
        const formContainer = document.querySelector('.header');
        const gameAppTitle = createAppTitle('Игра в пары');
        const numberOfCardsForm = createNumberOfCardsForm();
        formContainer.append(gameAppTitle);
        formContainer.append(numberOfCardsForm.form); 
       
        // Ввод и проверка чисел на валидность
        numberOfCardsForm.form.addEventListener('submit', (e)=> {
        e.preventDefault();
        const inputValue = numberOfCardsForm.input.value;
        if(!inputValue) {
            return;
        }

        const validNumber = checkOnValidation(inputValue);
        if(!validNumber) {
            numberOfCardsForm.input.value = '4';
        } else {
            numberOfCardsForm.input.value = ''; 
            numberOfCardsForm.button.disabled = true;
            timerId = setTimeout(() => {
                alert('Время игры закончилось');
                window.location.reload();
            }, 60000);
            startOfGame(Math.pow(validNumber, 2)); 
       }
        
       });
    }

    function checkOnValidation(numb) {
        if(numb > 1 && numb < 11) {
            if(!(numb % 2)) {
                return numb;
            }
        }
        return null;
    }

    //Тасование Фишера-Йейтса
    function shuffle (arr) {
        for (let i = arr.length -1; i > 0; i-- ) {
            let j = Math.floor(Math.random()*(i+1));
            let t = arr[i];
            arr[i] = arr[j];
            arr[j] = t
        }
        return arr;
    }

    //Создание блока для карточек
    function createCardList() {
        const list = document.createElement('ul');
        list.classList.add('Card_list');
        return list
    }

    //Создание карточки с атрибутами
    function createCard(idValue, numberOfCards) {
        const containerWidth = document.querySelector('.main').offsetWidth; //Ширина контейнера
        const cardWidth = containerWidth * 0.85 / (Math.sqrt(numberOfCards));
        const card = document.createElement('li');
        const button = document.createElement('button');

        card.classList.add('card');
        card.setAttribute('style', `width: ${cardWidth}px; height: ${cardWidth}px;`);
        button.classList.add('btn');
        button.id = idValue;
        button.setAttribute('style', `font-size: ${cardWidth * 0.7}px;`)

        card.append(button);

        return {
            card,
            button,
        };
    }

    let numberOfCoincidence = 0; //счетчик совпадений

    //Создание массива цифр расположенных в случайном порядке
    function startOfGame(numberOfCards) {
        const arrOfCards = [];
        let valueOfCards  = numberOfCards / 2;

        for(let i = 0; i < numberOfCards; i++) {
            arrOfCards.push(valueOfCards);
            if (i%2) {
                -- valueOfCards;
            }
        }

        const shuffledArr = shuffle(arrOfCards);
        createListOfCards(numberOfCards, shuffledArr);
    }

    // Создание списка карточек
    function createListOfCards(numberOfCards, shuffledArr) {
        const section = document.querySelector('.main');
        const listOfCards = createCardList();
        listOfCards.setAttribute('style', 'display: flex; flex-wrap: wrap')
        for (let i = 0; i < numberOfCards; i++) {
            let currentCard = createCard(i, numberOfCards);
            listOfCards.append(currentCard.card);
            currentCard.button.addEventListener('click', ()=> {
               let valueOfCard = shuffledArr[currentCard.button.id];
               currentCard.button.innerHTML = valueOfCard;
               compairPairs(currentCard, valueOfCard);
               if(numberOfCards === numberOfCoincidence * 2) {
                playAgain();
               }
            })
            
        }
        console.log(listOfCards);
        section.appendChild(listOfCards);
    }

    let firstNumberObj = {};
    let secondNumberObj = {};
    let equal = false;

    function compairPairs(card, value) {
        if(!Object.keys(firstNumberObj).length) {
            firstNumberObj = {
                card: card,
                value: value,
            };
            card.button.setAttribute('disabled', 'true');
        } else if (!Object.keys(secondNumberObj).length) {
            secondNumberObj = {
                card: card,
                value: value,
            };
            card.button.setAttribute('disabled', 'true');
            if (firstNumberObj.value === secondNumberObj.value) {
                equal = true;
                ++numberOfCoincidence;
                return
            }
        } else {
            if(!equal) {
                firstNumberObj.card.button.innerHTML = '';
                secondNumberObj.card.button.innerHTML = '';
                firstNumberObj.card.button.removeAttribute('disabled');
                secondNumberObj.card.button.removeAttribute('disabled');
            } else {
                equal = false;
            }

            firstNumberObj = {
                card: card,
                value: value,
            };

            card.button.setAttribute('disabled', 'true');
            secondNumberObj = {}
        }
    }

    function playAgain() {
        const section = document.querySelector('.main');
        const button = document.createElement('button');
        button.innerText = 'Сыграть еще раз';
        button.classList.add('btn-1');
        section.after(button);

        clearTimeout(timerId);

        button.addEventListener('click', () => {
            window.location.reload();
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        getNumberOfCards();
    });
})();
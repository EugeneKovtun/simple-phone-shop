const app = document.getElementById('root');

const container = document.createElement('div');
container.setAttribute('class', 'container');

const bin = document.createElement("div");
bin.setAttribute("class", "container");

app.appendChild(container);
app.appendChild(bin);

var request = new XMLHttpRequest();
request.open('GET', 'http://apeps.kiev.ua/post/getphones', true);

var data;
request.onload = function () {
    data = JSON.parse(this.response);

    if (request.status >= 200 && request.status < 400) {
        data.forEach(phone => {
            let countProducts = phone.countProducts;
            let productsInBin = 0;

            const card = document.createElement('div');
            card.setAttribute('class', 'phone');

            const name = document.createElement('h3');
            name.textContent = phone.productName;

            const image = document.createElement('img');
            image.setAttribute('src', `http://apeps.kiev.ua/images/phones/${phone.id}.jpg`);

            const brand = document.createElement('p');
            brand.textContent = phone.brandName;

            const operatingSystem = document.createElement('p');
            operatingSystem.textContent = `OS: ${phone.operationSystem}`;

            const amountOfSimCards = document.createElement('p');
            amountOfSimCards.textContent = `NumCards: ${phone.numSimCard}`;

            const price = document.createElement('p');
            price.textContent = `${phone.priceUAH} ₴`;

            const buyButton = document.createElement("button");
            buyButton.setAttribute('class', countProducts > 0 ? "buyButton-active" : "buyButton-disabled");
            buyButton.disabled = countProducts <= 0;
            buyButton.textContent = buyButton.disabled ? 'NOT AVAILABLE' : "BUY NOW";

            const declineButton = document.createElement('button');
            declineButton.setAttribute('class', "decline-button");

            buyButton.onclick = () => {
                countProducts--;
                if (productsInBin <= 0) {
                    const binCard = document.createElement('div');
                    binCard.setAttribute('class', 'phone');
                    binCard.appendChild(name.cloneNode(true));
                    binCard.appendChild(image.cloneNode(true));
                    binCard.appendChild(brand.cloneNode(true));
                    binCard.appendChild(operatingSystem.cloneNode(true));
                    binCard.appendChild(amountOfSimCards.cloneNode(true));
                    binCard.appendChild(price.cloneNode(true));
                    binCard.appendChild(declineButton);
                    declineButton.onclick = () => {
                        countProducts++;
                        productsInBin--;
                        if (countProducts > 0) {
                            buyButton.disabled = false;
                            buyButton.setAttribute("class", "buyButton-active");
                            buyButton.textContent = "BUY NOW";
                        }
                        if (productsInBin <= 0) {
                            bin.removeChild(binCard);
                        }
                        declineButton.textContent = declineButton.textContent = `${productsInBin} REMOVE ONE`;
                    };
                    bin.appendChild(binCard);
                }
                productsInBin++;

                declineButton.textContent = `${productsInBin} REMOVE ONE`;

                if (countProducts < 1) {
                    buyButton.disabled = true;
                    buyButton.setAttribute('class', "buyButton-disabled");
                    buyButton.textContent = 'NOT AVAILABLE';
                }
            };
            container.appendChild(card);
            card.appendChild(name);
            card.appendChild(image);
            card.appendChild(brand);
            card.appendChild(operatingSystem);
            card.appendChild(amountOfSimCards);
            card.appendChild(price);
            card.appendChild(buyButton);
        });
    } else {
        const errorMessage = document.createElement('marquee');
        errorMessage.textContent = `Gah, it's not working!`;
        app.appendChild(errorMessage);
    }
};

request.send();


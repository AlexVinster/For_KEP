document.addEventListener("DOMContentLoaded", function () {
    const shoppingCartIcon = document.getElementById("shoppingCart");
    const cartItemCount = document.getElementById("cartItemCount");
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const addedToCartModal = document.getElementById("addedToCartModal");
    const emptyCartModal = document.getElementById("emptyCartModal");
    const addingToCartModal = document.getElementById("addingToCartModal");
    let productLink, productName, productPrice;
    let products = [];
    let currentProductIndex = 0;
    const panelsPerPage = 4;

    fetch("https://alexvinster.github.io/For_KEP/4KURS/LR6/json/product.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            products = data;
            displayProducts(products);
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });

    function displayProducts(products) {
        const productContainer = document.getElementById("productCarousel");
        productContainer.innerHTML = "";

        products.forEach(function (product, index) {
            const panel = document.createElement("div");
            panel.className = "panel";

            const isNew = product.status === 'Новинка' ? '<span class="note new">новинка</span>' : '';
            const isHit = product.status === 'Хіт продажів' ? '<span class="note hit">хіт продажів</span>' : '';

            const category = `<div class="categor"><a href="${product.link}">${product.category}</a></div>`;

            const picture = `<div class="picture"><a href="${product.link}"><img src="${product.image}" alt="${product.name}"></a></div>`;

            const productName = `<div class="prod ${product.bold ? 'bold' : ''}"><a href="${product.link}" title="${product.name}">${product.name}</a></div>`;

            const costs = `<div class="costs ${product.bold ? 'bold' : ''}">
                <span class="price">${product.price} грн</span>
            </div>`;

            const availability = `<div>
                <a class="btn ${product.availability ? 'avl' : 'soon'} ${product.bold ? 'bold' : ''}" href="#" onclick="openQuantityModal('${product.link}', '${product.name}', '${product.price}')">
                    ${product.availability ? 'у корзину' : 'незабаром у продажі'}
                </a>
            </div>`;

            panel.innerHTML = `${isNew}${isHit}${category}<hr>${picture}${productName}${costs}${availability}`;

            productContainer.appendChild(panel);
        });

        showCurrentProduct();
    }

    function showCurrentProduct() {
        const panels = document.querySelectorAll(".panel");
        panels.forEach(function (panel, index) {
            const isVisible = index >= currentProductIndex && index < currentProductIndex + panelsPerPage;
            panel.style.display = isVisible ? "block" : "none";
        });
    }

    window.prevProduct = function () {
        if (currentProductIndex > 0) {
            currentProductIndex--;
        }
        showCurrentProduct();
    };

    window.nextProduct = function () {
        const totalPages = Math.ceil(products.length / panelsPerPage);
        const lastPageIndex = totalPages - 1;

        if (currentProductIndex < lastPageIndex * panelsPerPage) {
            currentProductIndex++;
        } else {
            currentProductIndex = 0;
        }

        showCurrentProduct();
    };

    window.openQuantityModal = function (link, name, price) {
        productLink = link;
        productName = name;
        productPrice = price;
        const quantityInput = document.getElementById("quantityInput");
        if (addingToCartModal && quantityInput) {
            addingToCartModal.style.display = "flex";
            quantityInput.value = 1;
            updateAddingToCartModal();
        } else {
            console.error("Adding to Cart modal or input not found.");
        }
    };

    function updateAddingToCartModal() {
        const productNameAdd = document.getElementById("productNameAdd");
        const productPriceAdd = document.getElementById("productPriceAdd");
        const totalPriceAdd = document.getElementById("totalPriceAdd");

        if (productNameAdd && productPriceAdd && totalPriceAdd) {
            productNameAdd.innerText = productName;
            productPriceAdd.innerText = productPrice;
            totalPriceAdd.innerText = productPrice;
        } else {
            console.error("Elements in Adding to Cart modal not found.");
        }
    }

    window.closeQuantityModal = function () {
        const addingToCartModal = document.getElementById("addingToCartModal");
        if (addingToCartModal) {
            addingToCartModal.style.display = "none";
        } else {
            console.error("Adding to Cart modal not found.");
        }
    };

    shoppingCartIcon.addEventListener("click", function () {
        if (cartItems.length === 0) {
            openCartModal();
        } else {
            window.location.href = "cart/index.html";
        }
    });

    function openCartModal() {
        if (cartItems.length === 0) {
            emptyCartModal.style.display = "flex";
        } else {
            addedToCartModal.style.display = "flex";
            const modalContent = `
                <div>
                    Товар додано
                    <div class="buttons">
                        <button onclick="goToCart()">Перейти у корзину</button>
                        <button onclick="continueShopping()">Повернутись до покупок</button>
                    </div>
                </div>`;
            addedToCartModal.innerHTML = modalContent;
        }
    }

    window.goToCart = function () {
        window.location.href = "cart/index.html";
    };

    window.continueShopping = function () {
        addedToCartModal.style.display = "none";
    };

    window.closeCartModal = function () {
        addedToCartModal.style.display = "none";
        emptyCartModal.style.display = "none";
    };

    window.addToCartModal = function () {
        const quantityInput = document.getElementById("productQuantityAdd");
        const quantity = quantityInput.value;

        if (isValidQuantity(quantity)) {
            addToCart(productLink, quantity, productName, productPrice);
            updateCartItemCount();
            closeQuantityModal();
            openCartModal();
        } else {
            console.error("Invalid quantity.");
        }
    };

    function updateCartItemCount() {
        const cartItemCount = document.getElementById("cartItemCount");
        const uniqueItemCount = getUniqueItemCount();
        cartItemCount.innerText = uniqueItemCount;
    }

    updateCartItemCount();

    function addToCart(productLink, quantity, productName, productPrice) {
        const item = {
            link: productLink,
            quantity: parseInt(quantity),
            name: productName,
            price: productPrice
        };
        cartItems.push(item);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }

    function getUniqueItemCount() {
        return new Set(cartItems.map(item => item.link)).size;
    }

    function isValidQuantity(quantity) {
        return quantity !== null && quantity !== "" && !isNaN(quantity) && parseInt(quantity) > 0;
    }

    function getPrice(element) {
        const priceString = element.innerText.trim().replace("грн", "");
        return parseFloat(priceString);
    }
});

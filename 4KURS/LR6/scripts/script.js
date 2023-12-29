document.addEventListener("DOMContentLoaded", function () {
    const shoppingCartIcon = document.getElementById("shoppingCart");
    const cartItemCount = document.getElementById("cartItemCount");
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const cartModal = document.getElementById("cartModal");
    const quantityModal = document.getElementById("quantityModal");
    let productLink, productName, productPrice;
    let products = [];
    let currentProductIndex = 0;
    const panelsPerPage = 4;

    fetch("https://alexvinster.github.io/For_KEP/4KURS/PR6/json/index.json")
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

            const isNew = product.new ? '<span class="note new">новинка</span>' : '';
            const isHit = product.bestseller ? '<span class="note hit">хіт продажів</span>' : '';

            const category = `<div class="categor"><a href="${product.categoryLink}">${product.category}</a></div>`;

            const picture = `<div class="picture"><a href="${product.link}"><img src="${product.image}" alt="${product.name}"></a></div>`;

            const productName = `<div class="prod ${product.bold ? 'bold' : ''}"><a href="${product.link}" title="${product.title}">${product.name}</a></div>`;

            const costs = `<div class="costs ${product.bold ? 'bold' : ''}"><span class="discount-price">${product.discount ? product.discountPrice : ''}</span><span class="price">${product.price} грн</span></div>`;

            const availability = `<div><a class="btn ${product.available ? 'avl' : 'soon'} ${product.bold ? 'bold' : ''}" href="#">${product.available ? 'у корзину' : 'незабаром у продажі'}</a></div>`;

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

    document.body.addEventListener("click", function (event) {
        const button = event.target.closest(".avl");

        if (button) {
            const parentPanel = button.parentElement.parentElement;
            const productAnchor = parentPanel.querySelector('.prod a');
            const priceElement = parentPanel.querySelector('.price');

            if (productAnchor && priceElement) {
                productName = productAnchor.innerText;
                productLink = productAnchor.href;
                productPrice = getPrice(priceElement);

                openQuantityModal();
            } else {
                console.error("Required elements not found.");
            }
        }
    });

    function openQuantityModal() {
        const quantityInput = document.getElementById("quantityInput");
        if (quantityModal && quantityInput) {
            quantityModal.style.display = "flex";
            quantityInput.value = 1;
        } else {
            console.error("Quantity modal or input not found.");
        }
    }

    window.closeQuantityModal = function () {
        const quantityModal = document.getElementById("quantityModal");
        if (quantityModal) {
            quantityModal.style.display = "none";
        } else {
            console.error("Quantity modal not found.");
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
            cartModal.style.display = "flex";
        } else {
            cartModal.style.display = "flex";
            const modalContent = `
                <div>
                    Товар додано
                    <div class="buttons">
                        <button onclick="goToCart()">Перейти у корзину</button>
                        <button onclick="continueShopping()">Повернутись до покупок</button>
                    </div>
                </div>`;
            cartModal.innerHTML = modalContent;
        }
    }

    window.goToCart = function () {
        window.location.href = "cart/index.html";
    };

    window.continueShopping = function () {
        cartModal.style.display = "none";
    };

    window.closeCartModal = function () {
        cartModal.style.display = "none";
    };

    window.openQuantityModal = function () {
        openQuantityModal();
    };

    window.addToCartModal = function () {
        const quantityInput = document.getElementById("quantityInput");
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

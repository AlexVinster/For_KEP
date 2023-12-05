document.addEventListener("DOMContentLoaded", function () {
    const cartIcon = document.querySelector(".cart");
    const addingToCartModal = document.getElementById("addingToCartModal");
    const addedToCartModal = document.getElementById("addedToCartModal");
    const emptyCartModal = document.getElementById("emptyCartModal");
    const wrapper = document.getElementById("wrapper");

    let productName;
    let productPrice;
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    // Функція для видалення товару з корзини
    function removeFromCart(index) {
        cartItems.splice(index, 1);
        updateCart();
        saveCartToLocalStorage(); // Зберегти зміни в локальному сховищі
    }

    // Функція для оновлення вмісту кошика
    function updateCart() {
        const cartContentElement = document.getElementById("cartContent");
        cartContentElement.innerHTML = "";

        cartItems.forEach((item, index) => {
            const itemElement = document.createElement("div");
            itemElement.innerHTML = `
                <p>${item.name} - ${item.quantity} шт. за ${item.price.toFixed(2)} ₴ кожен
                    <span class="delete-btn" onclick="removeFromCart(${index})">Видалити</span>
                </p>
            `;
            cartContentElement.appendChild(itemElement);
        });
    }

    // Функція для збереження кошика в локальному сховищі
    function saveCartToLocalStorage() {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }

    function addingToCart(btn) {
        const panel = btn.closest(".panel");
        const productData = JSON.parse(panel.getAttribute("data-product"));

        productName = productData.name;
        productPrice = parseFloat(productData.price.replace(/\D/g, ''));

        addingToCartModal.style.display = "block";
        document.getElementById("productNameAdd").innerText = productName;
        document.getElementById("productPriceAdd").innerText = productPrice.toFixed(2);
        document.getElementById("totalPriceAdd").innerText = calculateTotalPrice().toFixed(2);

        wrapper.classList.add("blur");
    }

    function calculateTotalPrice() {
        const productQuantity = document.getElementById("productQuantityAdd").value;
        return productPrice * productQuantity;
    }

    window.addToCart = function () {
        const productQuantity = document.getElementById("productQuantityAdd").value;

        if (parseInt(productQuantity) <= 0) {
            alert("Кількість товару має бути більше 0.");
            return;
        }

        const cartItem = {
            name: productName,
            price: productPrice,
            quantity: parseInt(productQuantity),
        };
        cartItems.push(cartItem);

        localStorage.setItem("cartItems", JSON.stringify(cartItems));

        addedToCartModal.style.display = "block";
        document.getElementById("productNameAdded").innerText = productName;
        document.getElementById("productPriceAdded").innerText = calculateTotalPrice().toFixed(2);
        document.getElementById("productQuantityAdded").innerText = productQuantity;

        addingToCartModal.style.display = "none";
        wrapper.classList.add("blur");

        updateCart(); // Оновити візуальне представлення кошика
    }

    function openCartPage() {
        window.open("cart.html", "_blank");
    }

    function updateCartPage() {
        const cartContentElement = document.getElementById("cartContent");
        cartContentElement.innerHTML = "";

        cartItems.forEach((item, index) => {
            const itemElement = document.createElement("div");
            itemElement.innerHTML = `
                <p>${item.name} - ${item.quantity} шт. за ${item.price.toFixed(2)} ₴ кожен
                    <span class="delete-btn" onclick="removeFromCart(${index})">Видалити</span>
                </p>
            `;
            cartContentElement.appendChild(itemElement);
        });
    }

    function closeModal() {
        addedToCartModal.style.display = "none";
        emptyCartModal.style.display = "none";
        addingToCartModal.style.display = "none";
        wrapper.classList.remove("blur");
    }

    function openEmptyCartModal() {
        emptyCartModal.style.display = "block";
        wrapper.classList.add("blur");
    }

    function checkAndProceedToCart() {
        if (cartItems.length === 0) {
            openEmptyCartModal();
        } else {
            openCartPage();
        }
    }

    document.querySelectorAll(".close").forEach(function (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    });

    document.querySelector(".btnContinueShopping").addEventListener("click", function () {
        addedToCartModal.style.display = "none";
        wrapper.classList.remove("blur");
    });

    document.querySelector(".btnToCart").addEventListener("click", checkAndProceedToCart);

    document.querySelectorAll(".avl").forEach(function (addToCartBtn) {
        addToCartBtn.addEventListener("click", function () {
            addingToCart(addToCartBtn);
        });
    });

    document.getElementById("addToCartBtn").addEventListener("click", function () {
        addToCart();
    });

    document.getElementById("productQuantityAdd").addEventListener("input", function () {
        document.getElementById("totalPriceAdd").innerText = calculateTotalPrice().toFixed(2);
    });

    cartIcon.addEventListener("click", checkAndProceedToCart);
    updateCartPage();
});

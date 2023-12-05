const cartContentElement = document.getElementById("cartContent");
const totalSumElement = document.getElementById("totalSum");

let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

function removeFromCart(index) {
    const itemToDelete = cartItems[index];
    cartItems = cartItems.filter(item => !(item.name === itemToDelete.name && item.price === itemToDelete.price));
    updateCart();
    saveCartToLocalStorage();
}

function increaseQuantity(index) {
    cartItems[index].quantity += 1;
    updateCart();
    saveCartToLocalStorage();
}

function decreaseQuantity(index) {
    if (cartItems[index].quantity > 1) {
        cartItems[index].quantity -= 1;
        updateCart();
        saveCartToLocalStorage();
    }
}

function editQuantity(index, element) {
    const newQuantity = parseInt(element.innerText);

    if (!isNaN(newQuantity) && newQuantity > 0) {
        cartItems[index].quantity = newQuantity;
        updateCart();
        saveCartToLocalStorage();
    } else {
        element.innerText = cartItems[index].quantity;
    }
}

function updateCart() {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    cartContentElement.innerHTML = "";
    let totalSum = 0;
    let aggregatedItems = {};

    cartItems.forEach((item, index) => {
        const key = `${item.name}${item.price.toFixed(2)}`;
        if (aggregatedItems[key]) {
            aggregatedItems[key].quantity += item.quantity;
            aggregatedItems[key].itemTotalPrice += item.price * item.quantity;
        } else {
            aggregatedItems[key] = { ...item, itemTotalPrice: item.price * item.quantity };
        }
    });

    const aggregatedItemsArray = Object.values(aggregatedItems);

    aggregatedItemsArray.forEach((aggregatedItem, index) => {
        const itemElement = document.createElement("div");
        const itemTotalPrice = aggregatedItem.itemTotalPrice;

        itemElement.innerHTML = `
        <p class="cart-item">
            ${aggregatedItem.name} - 
            <span class="quantity-controls">
                <button class="quantity-btn" onclick="decreaseQuantity(${index})">-</button>
                <span class="quantity" contenteditable="true" oninput="editQuantity(${index}, this)">${aggregatedItem.quantity} шт.</span>
                <button class="quantity-btn" onclick="increaseQuantity(${index})">+</button>
            </span>
            <span class="word">за</span> 
            <span class="price">${aggregatedItem.price.toFixed(2)} ₴</span> 
            <span class="word">кожен</span> = 
            <span class="item-total">${itemTotalPrice.toFixed(2)} ₴</span>
            <span class="delete-btn" onclick="removeFromCart(${index})">Видалити</span>
        </p>
    `;
        cartContentElement.appendChild(itemElement);

        totalSum += itemTotalPrice;
    });

    totalSumElement.innerHTML = `Загальна сума: <span class="total">${totalSum.toFixed(2)} ₴</span>`;
}

function saveCartToLocalStorage() {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

updateCart();

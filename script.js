document.addEventListener("DOMContentLoaded", function () {
    const quantityInput = document.getElementById("quantity");
    const productInputs = document.querySelectorAll('input[name="product"]');
    const radioOptions = document.getElementById("radioOptions");
    const serviceOption = document.getElementById("serviceOption");
    const checkboxOption = document.getElementById("checkboxOption");
    const giftWrap = document.getElementById("giftWrap");
    const result = document.getElementById("result");

    function updatePrice() {
        const selectedProduct = document.querySelector('input[name="product"]:checked').value;
        let unitPrice = 10;

        radioOptions.hidden = selectedProduct !== "custom";
        checkboxOption.hidden = selectedProduct !== "gift";

        if (selectedProduct === "custom") {
            unitPrice = 15 + parseFloat(serviceOption.value);
        } else if (selectedProduct === "gift") {
            unitPrice = 20;

            if (giftWrap.checked) {
                unitPrice += parseFloat(giftWrap.value);
            }
        }

        const quantity = parseInt(quantityInput.value, 10);

        if (Number.isNaN(quantity) || quantity < 1) {
            result.textContent = "Please enter a quantity of 1 or more.";
            return;
        }

        const totalPrice = unitPrice * quantity;
        result.textContent = "Total cost: $" + totalPrice.toFixed(2);
    }

    quantityInput.addEventListener("input", updatePrice);

    productInputs.forEach(function (productInput) {
        productInput.addEventListener("change", updatePrice);
    });

    serviceOption.addEventListener("change", updatePrice);
    giftWrap.addEventListener("change", updatePrice);
});

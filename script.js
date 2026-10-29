document.addEventListener("DOMContentLoaded", function () {
    const quantityInput = document.getElementById("quantity");
    const productList = document.getElementById("productList");
    const radioOptions = document.getElementById("radioOptions");
    const serviceOption = document.getElementById("serviceOption");
    const checkboxOption = document.getElementById("checkboxOption");
    const propertyOption = document.getElementById("propertyOption");
    const result = document.getElementById("result");
    let products = [];

    function createProductInputs() {
        products.forEach(function (product, index) {
            const label = document.createElement("label");
            const radio = document.createElement("input");

            label.classList.add("choice");
            radio.type = "radio";
            radio.name = "product";
            radio.value = product.id;
            radio.checked = index === 0;
            label.appendChild(radio);
            label.appendChild(document.createTextNode(" " + product.name + " ($" + product.price.toFixed(2) + " each)"));
            productList.appendChild(label);

            radio.addEventListener("change", updateOptionsAndPrice);
        });

        updateOptionsAndPrice();
    }

    function updateOptionsAndPrice() {
        const selectedId = document.querySelector('input[name="product"]:checked').value;
        const selectedProduct = products.find(function (product) {
            return product.id === selectedId;
        });

        serviceOption.textContent = "";
        propertyOption.textContent = "";
        radioOptions.hidden = selectedProduct.options.length === 0;
        checkboxOption.hidden = selectedProduct.property === null;

        selectedProduct.options.forEach(function (option) {
            const optionElement = document.createElement("option");
            optionElement.value = option.price;
            optionElement.textContent = option.name + " (+$" + option.price.toFixed(2) + " each)";
            serviceOption.appendChild(optionElement);
        });

        if (selectedProduct.property !== null) {
            const label = document.createElement("label");
            const checkbox = document.createElement("input");

            label.classList.add("choice");
            checkbox.type = "checkbox";
            checkbox.id = "productProperty";
            checkbox.value = selectedProduct.property.price;
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(" " + selectedProduct.property.name + " (+$" + selectedProduct.property.price.toFixed(2) + " each)"));
            propertyOption.appendChild(label);
            checkbox.addEventListener("change", updatePrice);
        }

        updatePrice();
    }

    function updatePrice() {
        const selectedId = document.querySelector('input[name="product"]:checked').value;
        const selectedProduct = products.find(function (product) {
            return product.id === selectedId;
        });
        const quantity = parseInt(quantityInput.value, 10);
        let unitPrice = selectedProduct.price;

        if (selectedProduct.options.length > 0) {
            unitPrice += parseFloat(serviceOption.value);
        }

        const checkbox = document.getElementById("productProperty");
        if (checkbox !== null && checkbox.checked) {
            unitPrice += parseFloat(checkbox.value);
        }

        if (Number.isNaN(quantity) || quantity < 1) {
            result.textContent = "Please enter a quantity of 1 or more.";
            return;
        }

        result.textContent = "Total cost: $" + (unitPrice * quantity).toFixed(2);
    }

    quantityInput.addEventListener("input", updatePrice);
    serviceOption.addEventListener("change", updatePrice);

    fetch("products.json")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Could not load product data.");
            }
            return response.json();
        })
        .then(function (data) {
            products = data;
            createProductInputs();
        })
        .catch(function () {
            result.textContent = "Could not load products. Please open this page using a local web server.";
        });
});

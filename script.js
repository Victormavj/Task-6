document.addEventListener("DOMContentLoaded", function () {
    const quantityInput = document.getElementById("quantity");
    const productTypeSelect = document.getElementById("productType");
    const radioOptions = document.getElementById("radioOptions");
    const radioList = document.getElementById("radioList");
    const propertyOptions = document.getElementById("propertyOptions");
    const propertyList = document.getElementById("propertyList");
    const result = document.getElementById("result");
    const productsData = '[{"id":"basic","name":"Basic Service","price":10,"options":[],"property":null},{"id":"custom","name":"Custom Service","price":15,"options":[{"id":"standard","name":"Standard","price":0},{"id":"express","name":"Express","price":5},{"id":"premium","name":"Premium","price":8}],"property":null},{"id":"gift","name":"Gift Service","price":20,"options":[],"property":{"id":"wrapping","name":"Gift wrapping","price":4}}]';
    const products = JSON.parse(productsData);

    function loadProducts() {
        products.forEach(function (product) {
            const option = document.createElement("option");
            option.value = product.id;
            option.textContent = product.name;
            productTypeSelect.appendChild(option);
        });

        updateProductOptions();
    }

    function updateProductOptions() {
        const selectedProduct = products.find(function (product) {
            return product.id === productTypeSelect.value;
        });

        radioList.textContent = "";
        propertyList.textContent = "";
        radioOptions.hidden = selectedProduct.options.length === 0;
        propertyOptions.hidden = selectedProduct.property === null;

        selectedProduct.options.forEach(function (productOption, index) {
            const label = document.createElement("label");
            const radio = document.createElement("input");

            label.classList.add("choice");
            radio.type = "radio";
            radio.name = "productOption";
            radio.value = productOption.id;
            radio.checked = index === 0;
            label.appendChild(radio);
            label.appendChild(document.createTextNode(" " + productOption.name + " (+$" + productOption.price.toFixed(2) + " each)"));
            radioList.appendChild(label);
            radio.addEventListener("change", updatePrice);
        });

        if (selectedProduct.property !== null) {
            const label = document.createElement("label");
            const checkbox = document.createElement("input");

            label.classList.add("choice");
            checkbox.type = "checkbox";
            checkbox.name = "productProperty";
            checkbox.value = selectedProduct.property.id;
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(" " + selectedProduct.property.name + " (+$" + selectedProduct.property.price.toFixed(2) + " each)"));
            propertyList.appendChild(label);
            checkbox.addEventListener("change", updatePrice);
        }

        updatePrice();
    }

    function updatePrice() {
        const selectedProduct = products.find(function (product) {
            return product.id === productTypeSelect.value;
        });
        const quantity = parseInt(quantityInput.value, 10);
        let unitPrice = selectedProduct.price;

        const selectedOption = document.querySelector('input[name="productOption"]:checked');
        if (selectedOption !== null) {
            const productOption = selectedProduct.options.find(function (option) {
                return option.id === selectedOption.value;
            });
            unitPrice += productOption.price;
        }

        const selectedProperty = document.querySelector('input[name="productProperty"]:checked');
        if (selectedProperty !== null && selectedProduct.property !== null) {
            unitPrice += selectedProduct.property.price;
        }

        if (Number.isNaN(quantity) || quantity < 1) {
            result.textContent = "Please enter a quantity of 1 or more.";
            return;
        }

        result.textContent = "Total cost: $" + (unitPrice * quantity).toFixed(2);
    }

    quantityInput.addEventListener("input", updatePrice);
    productTypeSelect.addEventListener("change", updateProductOptions);

    loadProducts();
});


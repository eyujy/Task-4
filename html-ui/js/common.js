/* 
 Common URLs so that it's easy to update
*/
// var products_url = "http://localhost:32144/products/products/";

// var inventory_url = "http://localhost:32144/inventory/inventory/";

// var customer_login_url = 'http://localhost:32144/customers/login/'

// var customer_url = 'http://localhost:32144/customers/customer/'

var products_url = "http://localhost/products/products/";

var inventory_url = "http://localhost/inventory/inventory/";

var customer_login_url = 'http://localhost/customers/login/'

var customer_url = 'http://localhost/customers/customer/'

var cart_url = 'http://localhost/cart/cart/'

/*
common Signout
*/

function signIn(e) {
	e.preventDefault();


	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;


	var data = {};
	data.username = username;
	data.password = password;


	console.log('form submitted', data);

	axios.post(customer_login_url, data)
		.then(response => {
			console.log(`User is successfully signed in.`, response.data);
			sessionStorage.setItem("customerName", username);
			sessionStorage.setItem("customerId", response.data);
			alert("Successfully signed in. click OK to redirect.");
			setTimeout(function () {
				if (username == "admin")
					window.location.href = 'inventory.html';
				else
					window.location.href = 'shop.html';
			}, 1000);
		})
		.catch(error => { alert("Invalid Credentials!"); console.error(error); });
	return false;
}


function signUp(e) {
	e.preventDefault();


	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;
	var firstName = document.getElementById('firstname').value;
	var lastName = document.getElementById('lastname').value;
	var email = document.getElementById('email').value;

	var data = {};
	data.username = username;
	data.password = password;
	data.firstName = firstName;
	data.lastName = lastName;
	data.email = email;

	console.log('form submitted', data);

	axios.post(customer_url, data)
		.then(response => {
			console.log(`User is successfully signed up.`, response.data);
			sessionStorage.setItem("customerName", username);
			sessionStorage.setItem("customerId", response.data.id);
			alert("Successfully signed up. click OK to redirect.");
			setTimeout(function () {
				window.location.href = 'shop.html';
			}, 1000);
		})
		.catch(error => console.error(error));
	return false;
}


function signout() {
	sessionStorage.removeItem("customerName");
	sessionStorage.removeItem("customerId");
	sessionStorage.removeItem("products");
	alert("Successfully signed out. click OK to redirect.");
	setTimeout(function () {
		window.location.href = 'signin.html';
	}, 1000);
}

/*
 Add to Cart - Shop related functionality 
*/
function getProducts_shop() {

	axios.get(products_url)
		.then(response => {
			console.log(`GET list products response`, response.data);
			createProductList(response.data);
			const users = response.data;
			console.log(`GET list products`, users);
		})
		.catch(error => console.error(error));
}

function createProductList(responseData) {

	responseData.forEach(function (product) {

		const productList = document.createElement('div');
		const eachProduct = document.createElement('div');
		const productImage = document.createElement('div');
		const img = document.createElement('img');
		const button = document.createElement('button');
		const shopItemDetails = document.createElement('div');
		const addToCart = document.createElement('a');
		const span = document.createElement('span');
		const h4 = document.createElement('h4');
		const a = document.createElement('a');
		const div = document.createElement('div');

		productList.className = "col-sm-6 col-md-3 col-lg-3";
		eachProduct.className = "shop-item";
		productImage.className = "shop-item-image";
		img.src = "assets/images/shop/product-11.png";
		shopItemDetails.className = "shop-item-detail";
		addToCart.className = "";
		span.className = "icon-basket";
		span.innerHTML = "Add to Cart";
		h4.className = "shop-item-title font-alt";
		a.innerHTML = product.details;
		div.innerHTML = "SGD " + product.price;//move down
		div.className = "custom-font";
		button.innerHTML = "Add to Cart";
		button.className = "btn btn-round btn-b";
		button.onclick = () => { addToCartService(product); alert("Successfully added into cart.") };

		shopItemDetails.appendChild(button);
		h4.appendChild(a);
		h4.appendChild(div);

		shopItemDetails.appendChild(addToCart);
		productImage.appendChild(img);
		productImage.appendChild(shopItemDetails);
		eachProduct.appendChild(productImage);
		eachProduct.appendChild(h4);
		productList.appendChild(eachProduct);

		const myCollection = document.getElementsByTagName('div')[16];

		document.getElementById("container").appendChild(productList);


	});

}



function containsObject(obj, list) {
	var i;
	for (i = 0; i < list.length; i++) {
		if ((list[i].productid) === (obj.productid)) {
			return true;
		}
	}

	return false;
}

function addToCartService(product) {

	let products = [];
	if (sessionStorage.getItem('products')) {
		console.log(sessionStorage.getItem('products'));
		products = JSON.parse(sessionStorage.getItem('products'));
	}
	if (containsObject(product, products)) {
		let index = products.findIndex(a => a.id === product.id);
		let foundProduct = products[index];
		products.splice(index, 1);
		product.qty = foundProduct.qty + 1;
		products.push(product);
	}
	else {
		product.qty = 1;
		products.push(product);
	}
	console.log(JSON.stringify(products));
	sessionStorage.setItem("products", JSON.stringify(products));

}


/*
Cart Checkout related functionality
*/
function getCartsByCustomerId() {
	const collection = document.getElementsByTagName('tbody')[0];

	var count = 0;
	var totalPrice = 0;
	console.log(sessionStorage.products);
	var products = JSON.parse(sessionStorage.products);
	console.log(products);
	products.forEach(function (product) {


		const item = document.createElement('td');
		const description = document.createElement('td'); //description
		const price = document.createElement('td'); //price
		const quantity = document.createElement('td'); //quantity
		const fifthTd = document.createElement('td'); //total
		const Tr = document.createElement('tr');
		item.innerHTML = ++count;
		description.innerHTML = product.details.toUpperCase();;
		price.innerHTML = "SGD " + (product.price).toFixed(2);
		quantity.innerHTML = product.qty;
		fifthTd.innerHTML = "SGD " + (product.price * product.qty).toFixed(2);
		Tr.appendChild(item);
		Tr.appendChild(description);

		Tr.appendChild(price);
		Tr.appendChild(quantity);
		Tr.appendChild(fifthTd);

		totalPrice += (product.price * product.qty);

		document.getElementById("tbody").appendChild(Tr);
	});

	console.log("total price:", totalPrice)

	var subTotal = totalPrice;
	var sum = subTotal;

	document.getElementById("subtotal").innerHTML = "SGD " + subTotal.toFixed(2);
	document.getElementById("shippingFee").innerHTML = "SGD 0.00";
	document.getElementById("total").innerHTML = "SGD " + sum.toFixed(2)

}

/*
 =>>>>>>This is the Code which needs to be updated!<<<<<<=
*/
function checkout(e) {

	e.preventDefault();
	console.log(sessionStorage.products);
	var products = JSON.parse(sessionStorage.products);
	var total = document.getElementById("total");
	var cartId = "CART-0001";
	var data ={};
	data.cartId = cartId;
	data.products = products;
	data.total = total;
	console.log(data);

	axios.post(cart_url, data)
		.then(response => {

			const inventory = response.data;
			console.log(`Post Inventory Success`, inventory);
		})
		.catch(error => console.error(error));

}

/*
products related functions
*/

function getProducts() {

	axios.get(products_url)
		.then(response => {

			var count = 0;

			response.data.forEach(function (product) {

				const firstTd = document.createElement('td'); //productId
				const secondTd = document.createElement('td'); //productName
				const thirdTd = document.createElement('td'); //description
				const forthTd = document.createElement('td'); //price
				const fifthTd = document.createElement('td'); //type
				const sixthTd = document.createElement('td');
				const aTag = document.createElement('a');
				const iTag = document.createElement('button');
				const Tr = document.createElement('tr');

				var current = count++;
				firstTd.innerHTML = response.data[current].productId;
				secondTd.innerHTML = response.data[current].productName;
				thirdTd.innerHTML = response.data[current].description;
				forthTd.innerHTML = "SGD " + response.data[current].price.toFixed(2);
				fifthTd.innerHTML = response.data[current].type;
				sixthTd.className = "pr-remove";
				iTag.className = "fa fa-times";
				iTag.onclick = () => { deleteProduct(response.data[current].productId); };

				Tr.appendChild(firstTd);
				Tr.appendChild(secondTd);
				Tr.appendChild(thirdTd);
				Tr.appendChild(forthTd);
				Tr.appendChild(fifthTd);
				aTag.appendChild(iTag);
				sixthTd.appendChild(aTag);
				Tr.appendChild(sixthTd);
				document.getElementById("tbody").appendChild(Tr);

			});

			const inventory = response.data;
			console.log(`GET list products from inventory`, inventory);
		})
		.catch(error => console.error(error));
}


function deleteProduct(productId) {

	axios.delete(products_url + productId)
		.then(response => {

			const deleted = response.data;
			console.log(`Successfully deleted`, deleted);
			alert("Delete successful.");
			setTimeout(function () {
				window.location.reload();;
			}, 1000);
		})
		.catch(error => console.error(error));
}

function addProduct(e) {
	e.preventDefault();
	var productName = document.getElementById('productName').value;
	var description = document.getElementById('description').value;
	var price = document.getElementById('price').value;
	var type = document.getElementById('type').value;


	var data = {};
	data.productName = productName;
	data.description = description;
	data.price = price;
	data.type = type;


	axios.post(products_url, data)
		.then(response => {

			const added = response.data;
			console.log(`Successfully addedd`, added);
			alert("Added successful.");
			setTimeout(function () {
				window.location.reload();;
			}, 1000);
		})
		.catch(error => console.error(error));
}



/*
Inventory related functions
*/
function getInventory() {

	axios.get(inventory_url)
		.then(response => {

			var count = 0;

			response.data.forEach(function (product) {


				const firstTd = document.createElement('td');
				const secondTd = document.createElement('td'); //product name
				const thirdTd = document.createElement('td'); //quantity
				const forthTd = document.createElement('td'); //selling price
				const fifthTd = document.createElement('td'); //x
				const aTag = document.createElement('a');
				const iTag = document.createElement('button');
				const Tr = document.createElement('tr');

				var current = count++;
				firstTd.innerHTML = product.productid;
				secondTd.innerHTML = product.details;
				thirdTd.innerHTML = product.quantity;
				forthTd.innerHTML = "SGD " + product.buyingPrice.toFixed(2);
				iTag.className = "fa fa-times";
				fifthTd.className = "pr-remove";
				aTag.appendChild(iTag);
				fifthTd.appendChild(aTag);
				Tr.appendChild(firstTd);
				Tr.appendChild(secondTd);
				Tr.appendChild(thirdTd);
				Tr.appendChild(forthTd);
				Tr.appendChild(fifthTd);

				document.getElementById("tbody").appendChild(Tr);




			});

			const inventory = response.data;
			console.log(`GET list products from inventory`, inventory);
		})
		.catch(error => console.error(error));

	axios.get(products_url)
		.then(response => {

			var count = 0;

			response.data.forEach(function (product) {

				var current = count++;

				var el = document.createElement("option");
				el.textContent = response.data[current].details;
				el.value = response.data[current].productid;

				document.getElementById("products").appendChild(el);

			});

			const products = response.data;
			console.log(`GET list of product from products`, products);
		})
		.catch(error => console.error(error));


}

function addToInventory(e) {

	e.preventDefault();

	var products = document.getElementById("products");
	var details = products.options[products.selectedIndex].text;
	var productId = products.value;
	var quantity = document.getElementById('quantity').value;
	var price = document.getElementById('price').value;

	var data = {}
	data.productid = productId;
	data.details = details;
	data.buyingPrice = price;
	data.quantity = quantity;

	console.log(data);


	axios.post(inventory_url, data)
		.then(response => {

			const inventory = response.data;
			console.log(`Post Inventory Success`, inventory);
		})
		.catch(error => console.error(error));

}

function updateInventory() {
	var el = document.createElement("option");
	el.textContent = response.data[current].product.productName;
	el.value = response.data[current].product.productId;
	//select.appendChild(el);

	document.getElementById('products').appendChild(el);

	var productName = document.getElementById('products').value;
	var quantity = document.getElementById('quantity').value;
	var price = document.getElementById('price').value;

	var data = {}
	data.buyingPrice = price;
	data.quantity = quantity;

	axios.post(inventory_url, data)
		.then(response => {

			const inventory = response.data;
			console.log(`Post Inventory Success`, inventory);
		})
		.catch(error => console.error(error));
}


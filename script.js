const Products = {
	/**
	 * Takes a JSON representation of the products and renders cards to the DOM
	 * @param {Object} productsJson
	 */
	displayProducts: (productsJson) => {
		// Select the card container and find the array of products in the JSON
		const productContainer = document.querySelector(".product__container");
		const productArray = productsJson.data.products.edges;

		// Map over all the products in the array, create a card for each one and
		// append it to the product container
		productArray.map((product) => {
			const productCard = Products.createProductCard(product);
			productContainer.appendChild(productCard);
		});
	},

	/**
	 * Takes a JSON representation of a product and returns a HTML dom object of
	 * a card
	 * @param {Object} productsObject
	 * @returns {Object} An Article DOM object containing the HTML for a product
	 * card
	 */
	createProductCard: (productObject) => {
		// Select the product variables to be adding to the card
		const product = productObject.node;
		product.imageSrc = product.images.edges[0].node.originalSrc;
		product.price = product.priceRange.minVariantPrice;
		product.price.symbol = Products.getCurrencySymbol(
			product.price.currencyCode
		);

		// Select the HTML string to display all known product tags
		product.tags = Products.displayTags(product.tags).outerHTML;

		// Create an article node and add the class along with the HTML template
		const productCard = document.createElement("ARTICLE");
		productCard.className = "product__card";
		productCard.innerHTML = `
      <img class="product__image" 
         src=${product.imageSrc} 
         alt=${product.handle}>
      <section class="product__description">
        <h3 class="product__title">${product.title}</h3>
        <p class="product__price">${product.price.symbol} ${product.price.amount}</p>
      </section>
      <section class="product__tags">
        ${product.tags}
      </section>
    `;

		return productCard;
	},

	/**
	 * Takes an array of Tag Strings and returns a HTML dom object of
	 * an unordered list of all tags
	 * @param {Array} tagArray
	 * @returns {Object} An Unordered List DOM object containing List Item nodes
	 * for each tag in the array
	 *
	 */
	displayTags: (tagArray) => {
		// Create an unordered list node
		const tagList = document.createElement("ul");

		// Map over the tags array and append a list item for each tag in the array
		tagArray.map((tag) => {
			const tagItem = document.createElement("li");
			tagItem.innerHTML = tag;
			tagList.appendChild(tagItem);
		});

		return tagList;
	},

	/**
	 * Takes a string representing a currency code and returns the symbol for that
	 * currency. New currencies can be added in the currencies Object
	 * @param {String} currencyCode
	 * @returns {String} A currency symbol
	 *
	 */
	getCurrencySymbol: (currencyCode) => {
		// Add currency codes and respective symbols here
		const currencies = {
			USD: "$",
			GBP: "£",
		};

		// Return the currency symbol or return the currency code if no match is
		// found
		if (currencyCode in currencies) return currencies[currencyCode];
		else return currencyCode;
	},

	state: {
		storeUrl: "https://api-demo-store.myshopify.com/api/2020-07/graphql",
		contentType: "application/json",
		accept: "application/json",
		accessToken: "b8385e410d5a37c05eead6c96e30ccb8",
	},

	/**
	 * Sets up the query string for the GraphQL request
	 * @returns {String} A GraphQL query string
	 */
	query: () => `
    {
      products(first:3) {
        edges {
          node {
            id
            handle
            title
            tags
            images(first:1) {
              edges {
                node {
                  originalSrc
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `,

	/**
	 * Fetches the products via GraphQL then runs the display function
	 */
	handleFetch: async () => {
		const productsResponse = await fetch(Products.state.storeUrl, {
			method: "POST",
			headers: {
				"Content-Type": Products.state.contentType,
				Accept: Products.state.accept,
				"X-Shopify-Storefront-Access-Token": Products.state.accessToken,
			},
			body: JSON.stringify({
				query: Products.query(),
			}),
		});
		const productsResponseJson = await productsResponse.json();
		Products.displayProducts(productsResponseJson);
	},

	/**
	 * Sets up the click handler for the fetch button
	 */
	initialize: () => {
		// Add click handler to fetch button
		const fetchButton = document.querySelector(".fetchButton");
		if (fetchButton) {
			fetchButton.addEventListener("click", Products.handleFetch);
		}
	},
};

document.addEventListener("DOMContentLoaded", () => {
	Products.initialize();
});

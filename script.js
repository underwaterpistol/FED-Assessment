const Products = {

  /**
   * Takes a JSON representation of the products and renders cards to the DOM
   * @param {Object} productsJson 
   */
  displayProducts: productsJson => {

    // Render the products here
    const container = document.getElementById('grid')
    container.innerHTML = ""

    Object.values(productsJson.data.products.edges).forEach(edge => {

      const product = edge['node']
      const { title, images: {edges : [{node:{originalSrc}}]}, tags, priceRange:{minVariantPrice:{amount}}} = product

      const card = `<div class="card">
        <div class="product__image">
          <image src="${originalSrc}" alt="${title}">
        </div>
        <div class="product__info">
          <h2 class="product__title">${title}</h2>
          <p class="product__price">&#36;${amount}</p>
          <p class="product__tags">Tags: <em>${tags}<em></p>
        </div>
      </div>`
      

      container.innerHTML += card
    });

  },

  state: {
    storeUrl: "https://api-demo-store.myshopify.com/api/2020-07/graphql",
    contentType: "application/json",
    accept: "application/json",
    accessToken: "b8385e410d5a37c05eead6c96e30ccb8"
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
        "Accept": Products.state.accept,
        "X-Shopify-Storefront-Access-Token": Products.state.accessToken
      }, 
      body: JSON.stringify({
        query: Products.query()
      })
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
  }

};

document.addEventListener('DOMContentLoaded', () => {
  Products.initialize();
});
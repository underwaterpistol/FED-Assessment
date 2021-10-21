const Products = {

  /**
   * Takes a JSON representation of the products and renders cards to the DOM
   * @param {Object} productsJson 
   */
  displayProducts: productsJson => {

    // Render the products here
    // console.log(productsJson.data.products)

    for (var i = 0; i < productsJson.data.products.edges.length; i++) {
      var productImageSrc= productsJson.data.products.edges[i].node.images.edges[0].node.originalSrc;
      var productTitleSrc = productsJson.data.products.edges[i].node.title;
      var productPriceSrc = productsJson.data.products.edges[i].node.priceRange.minVariantPrice.amount + ' ' + productsJson.data.products.edges[i].node.priceRange.minVariantPrice.currencyCode;
      var productTagSrc = 'Tags: ' + productsJson.data.products.edges[i].node.tags[0];

    

    const mainContainer = document.getElementById("Products-Container");
    const productHolder = document.createElement("div");
    productHolder.setAttribute( "class", "product-holder" );

    const productImage = document.createElement("img");
    productImage.src = productImageSrc;
    const productTitle = document.createElement("h2");
    productTitle.innerHTML = productTitleSrc;
    const productPrice = document.createElement("p");
    productPrice.innerHTML = productPriceSrc;
    const productTag = document.createElement("p");
    productTag.innerHTML = productTagSrc;


      mainContainer.appendChild(productHolder);
      productHolder.appendChild(productImage);
      productHolder.appendChild(productTitle);
      productHolder.appendChild(productPrice);
      productHolder.appendChild(productTag);
     }
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
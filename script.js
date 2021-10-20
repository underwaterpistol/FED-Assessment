const Products = {

  /**
   * Takes a JSON representation of the products and renders cards to the DOM
   * @param {Object} productsJson 
   */
  displayProducts: productsJson => {
    let productArray = productsJson.data.products.edges;
    if(productArray != null){
      let productSection = document.getElementById("ProductSection");
      productArray.forEach(product => {
        let createdProduct = Products.createProductCard(product.node);
        productSection.appendChild(createdProduct);
      })
    }
  },

/**
 * Takes a JSON representation of a singular product node.
 * @param {Object} productNode 
 * @returns Product card with relevant child elements.
 */
  createProductCard: productNode => {

    const cardClass = "product-card";

    let productCard = document.createElement("div");
    productCard.setAttribute("class", cardClass);

    let productCardImage = document.createElement("div");
    productCardImage.setAttribute("class", `${cardClass}__image`);
    let image = document.createElement("img")
    image.setAttribute("src", productNode.images.edges[0].node.originalSrc)

    productCardImage.appendChild(image);
    productCard.appendChild(productCardImage);

    let productCardTitle = document.createElement("p");
    productCardTitle.setAttribute("class", `${cardClass}__title`);
    productCardTitle.innerText = productNode.title;
    productCard.appendChild(productCardTitle);

    let productPrice = document.createElement("p");
    productPrice.setAttribute("class", `${cardClass}__price`);
    let priceInformation = productNode.priceRange.minVariantPrice;
    productPrice.innerText = `${priceInformation.currencyCode === 'GBP' ? '£' : '$'}${priceInformation.amount}`;
    productCard.appendChild(productPrice);

    let productTags = document.createElement("div");
    productTags.setAttribute("class", `${cardClass}__tags`);

    productNode.tags.forEach(tag => {
      let tagElement = document.createElement("div")
      tagElement.setAttribute("class", "tag");
      let tagText = document.createElement("p");
      tagText.setAttribute("class", "tag__text");
      tagText.innerText = `#${tag}`;

      tagElement.appendChild(tagText);
      productTags.appendChild(tagElement);
    })

    productCard.appendChild(productTags);

    return productCard;
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
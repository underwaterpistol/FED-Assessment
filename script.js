const Products = {

  /**
   * Takes a JSON representation of the products and renders cards to the DOM
   * @param {Object} productsJson 
   */
  displayProducts(productsJson) {

    // Render the products here
    const productsData = productsJson.data.products.edges;

    productsData.forEach((product) => this.createCard(product))
  },

    // Get the API data sources for later
  createCard(product) {

    this.state.cursor = `"${product.cursor}"`;
		product = product.node;
    const productObject = {
      imageSrc: product.images.edges[0].node.originalSrc,
      title: product.title,
      desc: product.descriptionHtml,
      price: `${product.priceRange.minVariantPrice.amount} ${product.priceRange.minVariantPrice.currencyCode}`,
      tag: `Tags: ${product.tags[0]}`,
      vendor: `Vendor: ${product.vendor}`,
      type: product.productType,
    }

    this.createElements(productObject)
  },

    // Create HTML elements for our data and populate them.
  createElements(product) {

    const image = document.createElement('img');
    image.src = product.imageSrc;
    const button = this.createElement('a', 'Add to Cart');
    button.setAttribute( "class", "cart-button" );
    button.href = '#';

    const title = this.createElement('h2', product.title);
    const desc = this.createElement('h3', product.desc);
    const price = this.createElement('p', product.price);

    const miscString =  [product.tag, product.type, product.vendor].join(' | ');
    const misc =  this.createElement('p', miscString);
    
    this.attachElements([
      image,
      title,
      desc,
      misc,
      price,
      button,
  ]);
  },
  createElement: (type, data) => {
    const el = document.createElement(type);
    el.innerHTML = data;
    return el;

  },
    // Loop through our array from the previous steps and append the elements.
  attachElements(elements) {
    const mainContainer = document.getElementById("Products-Container");
    const productHolder = document.createElement("div");
    productHolder.setAttribute( "class", "product-holder" );
    mainContainer.appendChild(productHolder);
    
    elements.forEach((el) => productHolder.appendChild(el));
    this.afterProductsRender();
  },
  afterProductsRender(){
    if(this.state.productsRendered === false) {

      const button = document.querySelector(".fetchButton");
      button.innerHTML = 'Load More';
      this.state.productsRendered = true
    }
  },

  state: {
    storeUrl: "https://api-demo-store.myshopify.com/api/2020-07/graphql",
    contentType: "application/json",
    accept: "application/json",
    accessToken: "b8385e410d5a37c05eead6c96e30ccb8",
    cursor: null,
    productsRendered: false
  },

  /**
   * Sets up the query string for the GraphQL request
   * @returns {String} A GraphQL query string
   */
   query(cursor) {
    return `{
        products(first:3 after:${cursor}) {
          edges {
            node {
              id
              handle
              title
              tags
              vendor
              descriptionHtml
              productType
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
            cursor
          }
        }
      }`;
    },

  /**
   * Fetches the products via GraphQL then runs the display function
   */
   async handleFetch(cursor = null) {
    try {

    const productsResponse = await fetch(this.state.storeUrl, {
      method: "POST",
      headers: {
        "Content-Type": this.state.contentType,
        "Accept": this.state.accept,
        "X-Shopify-Storefront-Access-Token": this.state.accessToken
      }, 
      body: JSON.stringify({
        query: this.query(cursor)
      })
    });
    const productsResponseJson = await productsResponse.json();
    this.displayProducts(productsResponseJson);
  }
  catch (error) {
    console.error(error);
    }
  },

  /**
   * Sets up the click handler for the fetch button
   */
  initialize: () => {
    // Add click handler to fetch button
    const fetchButton = document.querySelector(".fetchButton");
    if (fetchButton) {
      fetchButton.addEventListener("click", function() { Products.handleFetch(Products.state.cursor) });
    }
  }

};

document.addEventListener('DOMContentLoaded', () => {
  Products.initialize();
});
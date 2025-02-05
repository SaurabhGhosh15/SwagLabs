const {test, expect} = require('@playwright/test');
const LoginPage = require('../pages/login.page');
const ProductsPage = require('../pages/products.page');

test.describe('Adding/ removing products from cart', ()=>{

    let productsPage;
    let cartPage;
    let loginPage;

    test.beforeEach('', ({page})=>{
        productsPage = new ProductsPage(page);
        loginPage = new LoginPage(page);
    })

test('Add a single item to cart and verify', async ({page})=>{
    
    //Login̦̦̦̦
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');

    //Add product to cart
    await productsPage.addItemToCart('Sauce Labs Backpack');

    //Verify cart count
    const cartCount = await productsPage.getCartCount();
    expect(cartCount).toBe('1');

    //Verify product details in cart
    const productDetails = await productsPage.getProductDetailsInCart();
    expect(productDetails.name).toBe('Sauce Labs Backpack');
    expect(productDetails.price).toBe('$29.99');
});

test('Add all 6 products to cart and verify', async({page})=>{

    //Login
    await loginPage.navigate();
    await loginPage.login('standard_user','secret_sauce');

    //Add all 6products to cart
    const products = ['Sauce Labs Backpack', 'Sauce Labs Bike Light','Sauce Labs Bolt T-Shirt',
         'Sauce Labs Fleece Jacket', 'Sauce Labs Onesie','Test.allTheThings() T-Shirt (Red)'];
    await productsPage.addMultipleItemsToCart(products);

    //Verify cart count
    const cartCount = await productsPage.getCartCount();
    expect(cartCount).toBe('6');

    //Verify product details in cart
    const allProductDetails = await productsPage.getMultipleProductDetailsInCart(products);
    console.log(allProductDetails);


});

});
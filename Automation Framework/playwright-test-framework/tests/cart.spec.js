import {test, expect} from '@playwright/test'
import ProductsPage from '../pages/products.page'
import CartPage from '../pages/cart.page';
import LoginPage from '../pages/login.page';

test.describe('Cart page tests',()=>{
    
    let productsPage;
    let cartPage;
    let loginPage;

    test.beforeEach('', ({page})=>{
        productsPage = new ProductsPage(page);
        cartPage = new CartPage(page);
        loginPage = new LoginPage(page);
    })

    test('Verify items in the cart', async ({page})=>{
        
        //Login and add items to the cart
        await loginPage.navigate();
        await loginPage.login('standard_user','secret_sauce');
        await productsPage.addItemToCart('Sauce Labs Backpack');
        await productsPage.addItemToCart('Sauce Labs Bike Light');

        //Navigate to the cart
        await productsPage.navigateToCart();

        //Verify cart items
        const cartItems = await cartPage.getCartItems();
        expect(cartItems).toEqual([
            { name: 'Sauce Labs Backpack', price: '$29.99'},
            { name: 'Sauce Labs Bike Light', price: '$9.99'},
        ]);
    });

    test('Remove an item from the cart', async({page})=>{

        await loginPage.navigate();
        await loginPage.login('standard_user','secret_sauce');
        await productsPage.addItemToCart('Sauce Labs Backpack');
        await productsPage.addItemToCart('Sauce Labs Bike Light');

        //Navigate to the cart
        await productsPage.navigateToCart();

        //Remove an item
        await cartPage.removeItem('Sauce Labs Backpack');

        //Verify the remaining cart items
        const cartItems = await cartPage.getCartItems();
        expect(cartItems).toEqual([
            { name: 'Sauce Labs Bike Light', price: '$9.99'},
        ]);
    });

    test('Proceed to checkout from the cart', async({page})=>{
   
        //Login and add items to the cart
        await loginPage.navigate();
        await loginPage.login('standard_user', 'secret_sauce');
        await productsPage.addItemToCart('Sauce Labs Backpack');

        //Navigate to cart and procedd to checkout
        await productsPage.navigateToCart();
        await cartPage.checkout();

        //Verify navigation to checkout page
        await expect(page).toHaveURL('/checkout-step-one.html');

    });
});
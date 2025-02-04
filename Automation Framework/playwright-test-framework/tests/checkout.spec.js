import {test, expect} from '@playwright/test'
import LoginPage from '../pages/login.page'
import ProductsPage from '../pages/products.page';
import CartPage from '../pages/cart.page';
import CheckoutPage from '../pages/checkout.page';

test.describe('Checkout flow tests',()=>{

    test('Complete a purchase successfully', async ({page})=>{
        const loginPage = new LoginPage(page);
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        // Step 1: Login and add items to cart
        await loginPage.navigate();
        await loginPage.login('standard_user', 'secret_sauce');
        await productsPage.addItemToCart('Sauce Labs Backpack');
        await productsPage.navigateToCart();

        //Step 2: Proceed to checkout
        await cartPage.checkout();

        //Step 3: Fill customer information
        await checkoutPage.fillCustomerInformation('ABC', 'DEF', '12345');

        //Step 4: Complete the purchase
        await checkoutPage.CompletePurchase();

        //Step 5: Verify order completion
        const message = await checkoutPage.getOrderCompletionMessage();
        expect(message).toBe('Thank you for your order!');
    });

    test('Verify order summary details', async ({page})=>{
        const loginPage = new LoginPage(page);
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        //Step 1: Login and add products to cart
        await loginPage.navigate();
        await loginPage.login('standard_user', 'secret_sauce');
        await productsPage.addItemToCart('Sauce Labs Backpack');
        await productsPage.addItemToCart('Sauce Labs Bike Light');
        await productsPage.navigateToCart();

        //Step 2: Proceed to checkout
        await cartPage.checkout();

        //Step 3: Fill customer information
        await checkoutPage.fillCustomerInformation('ABC', 'DEF', '12345');

        //Step 4: Verify order summary
        const orderSummary = await checkoutPage.getOrderSummaryItems();
        expect(orderSummary).toEqual([
            { name: 'Sauce Labs Backpack', price: '$29.99'},
            { name: 'Sauce Labs Bike Light', price: '$9.99'},
        ]);
    });

    test('Error message for missing customer information', async ({page})=>{
        const loginPage = new LoginPage(page);
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        //Login and add items to cart
        await loginPage.navigate();
        await loginPage.login('standard_user', 'secret_sauce');
        await productsPage.addItemToCart('Sauce Labs Backpack');
        await productsPage.navigateToCart();

        //Proceed to checkout
        await cartPage.checkout();

        //Attempt to continue without filling customer information
        await checkoutPage.fillCustomerInformation('','','');

        //Verify error message
        const errorMessage = await page.textContent('.error-message-container');
        expect(errorMessage).toContain('Error: First Name is required');
    });

    test('Validate subtotal, tax, and total on checkout', async({page})=>{
        const loginPage = new LoginPage(page);
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        //Login and add items to cart
        await loginPage.navigate();
        await loginPage.login('standard_user', 'secret_sauce');
        await productsPage.addItemToCart('Sauce Labs Backpack');
        await productsPage.addItemToCart('Sauce Labs Bike Light');
        await productsPage.navigateToCart();

        //Proceed to checkout
        await cartPage.checkout();
        await checkoutPage.fillCustomerInformation('asd','asd','12345');

        //Vaidate subtotal, tax and total
        const orderSummary = await checkoutPage.getOrderSummaryItems();
        const subtotal = await checkoutPage.getSubtotal();
        const tax = await checkoutPage.getTax();
        const total = await checkoutPage.getTotal();

        //Calculate expected values
        const expectedSubtotal = orderSummary.reduce((sum, item) => sum + parseFloat(item.price.replace('$','')), 0);
        const expectedTax = expectedSubtotal * 0.08; //Assuming 8% tax
        const expectedTotal = expectedSubtotal+expectedTax;

        expect(subtotal).toBeCloseTo(expectedSubtotal,2);
        expect(tax).toBeCloseTo(expectedTax,2);
        expect(total).toBeCloseTo(expectedTotal,2);
    });

    test('Cancel button should navigate back to cart', async({page})=>{
        const loginPage = new LoginPage(page);
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        
        //Login and add products
        await loginPage.navigate();
        await loginPage.login('standard_user','secret_sauce');
        await productsPage.addItemToCart('Sauce Labs Backpack');
        await productsPage.navigateToCart();

        //Proceed to checkout and then cancel
        await cartPage.checkout();
        await checkoutPage.cancelCheckout();

        //Verify navigation back to the Cart page
        await expect(page).toHaveURL('/cart.html');
    });

    test.only('Validate navigation between checkout steps', async ({page})=>{
        const loginPage = new LoginPage(page);
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        //Login and add products
        await loginPage.navigate();
        await loginPage.login('standard_user','secret_sauce');
        await productsPage.addItemToCart('Sauce Labs Backpack');
        await productsPage.navigateToCart();

        //proceed to checkout
        await cartPage.checkout();

        //Fill customer information
        await checkoutPage.fillCustomerInformation('ABC','DEF','12345');

        //Verify navigation to order summary page
        await expect(page).toHaveURL('/checkout-step-two.html');

        //Navigate back to cart using cancel button
        await checkoutPage.cancelCheckout();

        //Verify navigation to cart page
        await expect(page).toHaveURL('/inventory.html');
    });
});
//const { text } = require("stream/consumers");

class CheckoutPage{
    constructor(page){
        this.page = page;

        //Locators for Customer Information
        this.firstNameInput = '#first-name';
        this.lastNameInput = '#last-name';
        this.postalCodeInput = '#postal-code';
        this.continueBtn = '#continue';

        //Locators for summary details
        this.subtotal = '.summary_subtotal_label';
        this.tax = '.summary_tax_label';
        this.total = '.summary_total_label';

        //Locators for order review
        this.cartItem = '.cart_item';
        this.finishBtn = '#finish';
        this.cancelBtn = '#cancel';

        //Locators for Order Completion
        this.orderConfirmationMessage = '.complete-header';
    }

    // Step 1: Fill out customer information and proceed
    async fillCustomerInformation(firstName, lastName, zipCode){
        await this.page.fill(this.firstNameInput, firstName);
        await this.page.fill(this.lastNameInput, lastName);
        await this.page.fill(this.postalCodeInput, zipCode);
        await this.page.click(this.continueBtn);
    }

    // Step 2: Get all items in the order review
    async getOrderSummaryItems(){
        const items = [];
        const cartItems = this.page.locator(this.cartItem);
        const count = await cartItems.count();

        for(let i=0; i<count; i++){
            const name = await cartItems.nth(i).locator('.inventory_item_name').textContent();
            const price =  await cartItems.nth(i).locator('.inventory_item_price').textContent();

            items.push({
                name: name.trim(),
                price: price.trim(), 
            });
        }
        return items;
    }

    //Complete the purchase
    async CompletePurchase(){
        await this.page.click(this.finishBtn);
    }

    //Verify order completion message
    async getOrderCompletionMessage(){
        return await this.page.textContent(this.orderConfirmationMessage);
    }

    //Cancel the purchase
    async cancelCheckout(){
        await this.page.click(this.cancelBtn);
    }

    //Get subtotal
    async getSubtotal(){
        const text = await this.page.textContent(this.subtotal);
        return parseFloat(text.replace('Item total: $','').trim());
    }

    //Get tax
    async getTax(){
        const text = await this.page.textContent(this.tax);
        return parseFloat(text.replace('Tax: $','').trim());
    }

    //Get total
    async getTotal(){
        const text = await this.page.textContent(this.total);
        return parseFloat(text.replace('Total: $','').trim());
    }
}

module.exports = CheckoutPage;
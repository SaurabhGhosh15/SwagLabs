class CartPage{
    constructor(page){
        this.page = page;

        this.cartItem = '.cart_item';
        this.productName = '.inventory_item_name';
        this.productPrice = '.inventory_item_price';
        this.removeButton = 'button:has-text("Remove")';
        this.continueShopppingBtn = '#continue-shopping';
        this.checkoutBtn = '#checkout';
    }

    async getCartItems(){
        const items = [];
        const cartItems = this.page.locator(this.cartItem);
        const count = await cartItems.count();

        for (let i=0; i<count; i++){
            const name = await cartItems.nth(i).locator(this.productName).textContent();
            const price = await cartItems.nth(i).locator(this.productPrice).textContent();

            items.push({
                name: name.trim(),
                price: price.trim(),
            });
        }

        return items;
    }

    async removeItem(productName){
        const cartItems = this.page.locator(this.cartItem);
        const count = await cartItems.count();

        for(let i=0; i<count; i++){
            const name = await cartItems.nth(i).locator(this.productName).textContent();
            if(name.trim() === productName){
                await cartItems.nth(i).locator(this.removeButton).click();
                break;
            }
        }

    }

    async continueShopping(){
        await this.page.click(this.continueShopppingBtn);
    }

    async checkout(){
        await this.page.click(this.checkoutBtn);
    }    
}


module.exports = CartPage;



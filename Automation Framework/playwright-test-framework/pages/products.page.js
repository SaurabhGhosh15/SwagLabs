class ProductsPage{
    constructor(page){
        this.page = page;
        this.cartIcon = '.shopping_cart_link';
        this.cartCount = '.shopping_cart_badge';
        this.productContainer = '.inventory_item';
    }

    async addItemToCart(productName){
        const productLocator = this.page.locator(this.productContainer).filter({hasText: productName,});
        await productLocator.locator('button:has-text("Add to cart")').click();
    }

    async addMultipleItemsToCart(items){
        const noOfItems = items.length;
        for(let i=0;i<noOfItems; i++){
            const productLocator = this.page.locator(this.productContainer).filter({hasText: items[i],});
            await productLocator.locator('button:has-text("Add to cart")').click();
        }
    }

    async removeItemFromCart(productName){
        const productLocator = this.page.locator(this.productContainer).filter({hasText: productName,});
        await productLocator.locator('button:has-text("Remove")').click();
    }

    async getCartCount(){
        if(await this.page.isVisible(this.cartCount)){
            return await this.page.locator(this.cartCount).textContent();
        }
        return '0';
    }

    async navigateToCart(){
        await this.page.click(this.cartIcon);
    }

    async getProductDetailsInCart(){
        await this.navigateToCart();

        const productName = await this.page.locator('.inventory_item_name').textContent();
        const productPrice = await this.page.locator('.inventory_item_price').textContent();
        
        return { name: productName.trim(), price: productPrice.trim() };

    }

    async getMultipleProductDetailsInCart(items){
        await this.navigateToCart();
        //const productLocators = await this.page.$$('.cart_item');
        const productDetails = [];
        const noOfItems = items.length;
        const productNames = await this.page.locator('.inventory_item_name');
        const productPrices = await this.page.locator('.inventory_item_price');
        
        for(let i=0; i<noOfItems; i++){
            
            const productName = await productNames.nth(i).textContent();
            const productPrice = await productPrices.nth(i).textContent();

            productDetails.push({
                name: productName.trim(),
                price: productPrice.trim(),
            });
        }
        return productDetails;
    }
}

module.exports = ProductsPage;
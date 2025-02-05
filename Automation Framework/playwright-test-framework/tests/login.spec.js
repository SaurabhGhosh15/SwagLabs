import {test, expect} from '@playwright/test'
import LoginPage from '../pages/login.page';
//const LoginPage = require('../pages/login.page');

test.describe('Login tests', ()=>{

let loginPage;
test.beforeEach('', async({page})=>{
    loginPage = new LoginPage(page);
})

    test('Login with valid credentials', async ({page})=>{  
        await loginPage.navigate();
        await loginPage.login('standard_user', 'secret_sauce');
        expect(page.url()).toBe('https://www.saucedemo.com/inventory.html');
    });

    test('Login with locked credentials', async({page})=>{
        await loginPage.navigate();
        await loginPage.login('locked_out_user','secret_sauce');
        const errorText = await page.locator('[data-test="error"]').textContent();
        expect(errorText).toContain('Epic sadface: Sorry, this user has been locked out.');
    });
}); 
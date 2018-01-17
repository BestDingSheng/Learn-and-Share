const {Builder, By, Key, until} = require('selenium-webdriver');

let driver = new Builder()
    .forBrowser('chrome')
    .build();

driver.get('https://www.baidu.com/');
driver.findElement(By.name('wd')).sendKeys('webdriver', Key.RETURN);
driver.wait(until.titleIs('webdriver'), 3000);
driver.quit();
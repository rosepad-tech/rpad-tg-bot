// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('consensus-faucet', function() {
  this.timeout(30000)
  let driver
  let vars
  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build()
    vars = {}
  })
  afterEach(async function() {
    await driver.quit();
  })
  it('consensus-faucet', async function() {
    await driver.get("https://faucet.testnet.oasis.dev/")
    await driver.manage().window().setRect({ width: 1920, height: 998 })
    await driver.findElement(By.id("paratime")).click()
    {
      const dropdown = await driver.findElement(By.id("paratime"))
      await dropdown.findElement(By.xpath("//option[. = 'Emerald']")).click()
    }
    await driver.findElement(By.id("account")).click()
    await driver.findElement(By.id("account")).sendKeys("0x93471f86C53926B07d4554D9f186f71F283fCD24")
    await driver.switchTo().frame(0)
    await driver.findElement(By.css(".recaptcha-checkbox-border")).click()
    await driver.switchTo().defaultContent()
    await driver.findElement(By.id("request-form-submit")).click()
    await driver.findElement(By.css(".mui-btn:nth-child(2)")).click()
  })
})

import 'babel-polyfill'
import 'colors'
import wd from 'wd'
import {assert} from 'chai'

const username = 'shwethushivaji'
const apiKey = '41d20455-d645-41b0-a314-77ff6d2e0b80'
const deviceName = process.env.KOBITON_DEVICE_NAME || 'Galaxy*'

const kobitonServerConfig = {
  protocol: 'https',
  host: 'api.kobiton.com',
  auth: `${username}:${apiKey}`
}

const desiredCaps = {
  // The generated session will be visible to you only. 
  sessionName:        'Automation test session',
  sessionDescription: '',
  deviceOrientation:  'portrait',
  captureScreenshots: true,
  useConfiguration:   '',
  autoWebview:        true,
  browserName:        'chrome',
  deviceGroup:        'KOBITON',
  // For deviceName, platformVersion Kobiton supports wildcard
  // character *, with 3 formats: *text, text* and *text*
  // If there is no *, Kobiton will match the exact text provided
  deviceName:         'Galaxy S10',
  platformVersion:    '12',
  platformName:       'Android'
}

let driver

if (!username || !apiKey) {
  console.log('Error: Environment variables KOBITON_USERNAME and KOBITON_API_KEY are required to execute script')
  process.exit(1)
}

describe('Android Web sample', () => {

  before(async () => {
    driver = wd.promiseChainRemote(kobitonServerConfig)

    driver.on('status', (info) => {
      console.log(info.cyan)
    })
    driver.on('command', (meth, path, data) => {
      console.log(' > ' + meth.yellow, path.grey, data || '')
    })
    driver.on('http', (meth, path, data) => {
      console.log(' > ' + meth.magenta, path, (data || '').grey)
    })

    try {
      await driver.init(desiredCaps)
    }
    catch (err) {
      if (err.data) {
        console.error(`init driver: ${err.data}`)
      }
    throw err
    }
  })

  it('should return the title that contains Kobiton', async () => {
    await driver.get('https://www.google.com')
    .waitForElementByName('q')
    .sendKeys('Kobiton')
    .sleep(3000)
    .keys(wd.SPECIAL_KEYS.Enter)
    
    let msg = await driver.title()
    assert.include(msg, 'Kobiton - Google Search')
  })

  after(async () => {
    if (driver != null) {
    try {
      await driver.quit()
    }
    catch (err) {
      console.error(`quit driver: ${err}`)
    }
  }
  })
})

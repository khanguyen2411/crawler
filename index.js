const { Builder, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox')
const database = require('./configs/database')
const env = require('dotenv').config()
const Data = require('./models/Data')
const colors = require('colors/safe')

function crawl(url) {
    return new Promise(async (resolve, reject) => {
        try {
            let driver = await new Builder()
                .forBrowser('firefox')
                .setFirefoxOptions(new firefox.Options().headless())
                .build()

            await driver.get(url);

            const table = await driver.findElement(By.className("table table-hover"));
            const tbody = await table.findElement(By.css("tbody"));
            const tr = await tbody.findElements(By.css("tr"));

            for (const item of tr) {
                const span = await item.findElement(
                    By.className("hash-tag text-truncate")
                );
                const a = await span.findElement(By.css("a"));
                const rs = await a.getAttribute("innerText");

                const check = await Data.findOne({ from: rs })
                if (check == null) {
                    try {
                        const data = new Data({ from: rs })
                        await data.save((error, data) => {
                            if (error) {
                                return console.error(error);
                            }

                            return console.log(colors.green(`Save successfully ${data.from}`))
                        });

                    } catch (error) {
                        console.log(error.message)
                    }
                }
            }

            driver.quit()
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

async function run() {
    const a = 100
    for (let i = 1; i <= a; i++) {
        //console.log(colors.red(`${i}`));
        let url = `https://bscscan.com/txs?ps=100&p=${i}`;

        try {
            await crawl(url);
        } catch (error) {
            console.log(error.message)
        }

    }
}

//connect database
database.connect()

run()





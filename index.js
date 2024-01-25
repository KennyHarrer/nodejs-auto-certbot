require('dotenv').config();
const express = require('express');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path')

//

const app = express();
app.use(express.static('public'));

//

app.listen(async () => {
    await runCertbot();
    process.exit()
});

// CERT BOT FUNC

async function runCertbot() {
    try {
        const certbotCommand = `certbot certonly --manual --preferred-challenges=http --manual-auth-hook ${path.join(__dirname,'auth.sh')} --manual-cleanup-hook ${path.join(__dirname,'cleanup.sh')} -d ${process.env.certbotDomain}`;

        const { stdout, stderr } = await exec(certbotCommand);

        console.log(`Certbot output:\n${stdout}`);

        if (stderr) {
            console.error(`Certbot errors:\n${stderr}`);
        }
    } catch (error) {
        console.error(`Error running Certbot: ${error}`);    
    }
}
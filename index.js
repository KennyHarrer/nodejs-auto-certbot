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
//sudo certbot certonly --manual --non-interactive -m contact@privaterelay.me --preferred-challenges=http --manual-auth-hook /home/fastd1/nodejs-auto-certbot/auth.sh --manual-cleanup-hook /home/fastd1/nodejs-auto-certbot/cleanup.sh -d fastdl.privaterelay.me
async function runCertbot() {
    try {
        const certbotCommand = `certbot certonly --manual --non-interactive -m ${process.env.email} --preferred-challenges=http --manual-auth-hook "bash ${path.join(__dirname,'auth.sh')}" --manual-cleanup-hook "bash ${path.join(__dirname,'cleanup.sh')}" -d ${process.env.certbotDomain}`;

        const { stdout, stderr } = await exec(certbotCommand);

        console.log(`Certbot output:\n${stdout}`);

        if (stderr) {
            console.error(`Certbot errors:\n${stderr}`);
        }
    } catch (error) {
        console.error(`Error running Certbot: ${error}`);    
    }
}
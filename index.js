require('dotenv').config();
const express = require('express');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const {mkdir} = require('fs/promises')
const path = require('path')

//

const app = express();
app.use(express.static('public'));

//

app.listen(80, async () => {
    await createChallengeDirectory()
    await runCertbot();
    process.exit()
});

// CERT BOT FUNC
async function runCertbot() {
    try {
        const certbotCommand = `certbot certonly --agree-tos --manual --non-interactive -m ${process.env.certbotContactEmail} --preferred-challenges=http --manual-auth-hook "bash ${path.join(__dirname,'auth.sh')}" --manual-cleanup-hook "bash ${path.join(__dirname,'cleanup.sh')}" -d ${process.env.certbotDomain}`;

        const { stdout, stderr } = await exec(certbotCommand);

        console.log(`Certbot output:\n${stdout}`);

        if (stderr) {
            console.error(`Certbot errors:\n${stderr}`);
        }
    } catch (error) {
        console.error(`Error running Certbot: ${error}`);    
    }
}

//make challenge dir
async function createChallengeDirectory() {
    const challengeDir = path.join(__dirname, 'public', '.well-known', 'acme-challenge');
    try {
      await mkdir(challengeDir, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }
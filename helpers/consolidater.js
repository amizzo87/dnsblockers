const fs = require('fs');
const path = require('path');
const readline = require('readline');

function isDomain(domain) {
    const pattern = /^([a-z0-9]+(-[a-z0-9]+)*)*[a-z0-9]+\.[a-z]{2,}$/;
    return pattern.test(domain);
}

function isIp(ip) {
    const pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|[01]?[0-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|[01]?[0-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|[01]?[0-9]?[0-9])$/;
    return pattern.test(ip);
}

async function processFile(filePath) {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let data = [];
    for await (const line of rl) {
        const trimmedLine = line.trim();
        if ((trimmedLine.length > 0 && !trimmedLine.startsWith('#') && !trimmedLine.startsWith('*')) 
            && (isDomain(trimmedLine) || isIp(trimmedLine))) {
            data.push(trimmedLine);
        }
    }
    return data;
}

async function start(files) {
    let uniqueAddresses = new Set();

    for (let file of files) {
        let addresses = await processFile(file);
        for (let address of addresses) {
            uniqueAddresses.add(address);
        }
    }

    fs.writeFileSync('output.txt', Array.from(uniqueAddresses).join('\n'), 'utf-8');
    console.log("Output written to output.txt");
}

let files = process.argv.slice(2);
if (files.length === 0) {
    try {
        files = fs.readdirSync('./lists/').map(file => path.join('./lists/', file)); 
    } catch (error) {
        console.error(`Error reading files from ./lists/ directory: ${error.message}`);
        process.exit(1);
    }
}

start(files)
    .catch(console.error);

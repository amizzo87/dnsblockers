const fs = require('fs');
const readline = require('readline');
const path = require('path');

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
        if ((trimmedLine.length > 0 && !trimmedLine.startsWith('#')) 
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

    fs.writeFileSync('processed.txt', Array.from(uniqueAddresses).join('\n'), 'utf-8');
    console.log("Output written to processed.txt");
}

let files = process.argv.slice(2);
start(files)
    .catch(console.error);
import os
import urllib.request
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

# Create the directory if it doesn't exist
os.makedirs('../lists', exist_ok=True)

# List of files to download
files = [
    ('https://raw.githubusercontent.com/badmojr/1Hosts/master/Lite/domains.txt', '../lists/1hosts_lite.txt'),
    ('https://raw.githubusercontent.com/mullvad/dns-blocklists/main/output/doh/doh_adblock.txt', '../lists/mullvad_adblock.txt'),
    ('https://raw.githubusercontent.com/mullvad/dns-blocklists/main/output/doh/doh_privacy.txt', '../lists/mullvad_privacy.txt'),
]

# Download and rename files
for url, filename in files:
    try:
        logging.info(f"Starting download of {url} to {filename}")
        urllib.request.urlretrieve(url, filename)
        logging.info(f"Successfully downloaded {url} to {filename}")
    except Exception as e:
        logging.error(f"Error downloading {url} to {filename}: {e}")


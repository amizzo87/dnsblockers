import os
import urllib.request
import logging
import argparse
import binascii

# Configure logging
logging.basicConfig(level=logging.INFO)

# Parse command line arguments
parser = argparse.ArgumentParser()
parser.add_argument("--output_dir", default="../lists", help="Directory to save the files")
args = parser.parse_args()

# Create the directory if it doesn't exist
os.makedirs(args.output_dir, exist_ok=True)

# List of files to download
files = [
    ('https://raw.githubusercontent.com/badmojr/1Hosts/master/Lite/domains.txt', '1hosts_lite.txt'),
    ('https://raw.githubusercontent.com/mullvad/dns-blocklists/main/output/doh/doh_adblock.txt', 'mullvad_adblock.txt'),
    ('https://raw.githubusercontent.com/mullvad/dns-blocklists/main/output/doh/doh_privacy.txt', 'mullvad_privacy.txt'),
]

# Download and rename files
for url, filename in files:
    try:
        logging.info(f"Starting download of {url} to {filename}")
        response = urllib.request.urlopen(url)
        data = response.read()      # a `bytes` object
        crc32_code = binascii.crc32(data) & 0xffffffff  # compute CRC32
        filename_without_ext, extension = os.path.splitext(filename)
        new_filename = os.path.join(args.output_dir, f"{filename_without_ext}-{format(crc32_code, '08x')}{extension}")
        with open(new_filename, 'wb') as f:
            f.write(data)
        logging.info(f"Successfully downloaded {url} to {new_filename}")
    except Exception as e:
        logging.error(f"Error downloading {url} to {filename}: {e}")

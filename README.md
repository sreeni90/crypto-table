# crypto-table
Bootstrap table listing using coinmarketcap api for simple sorting and searching , analysis of cryptocurrencies.

System Requirements
=====================
PHP v5.6 to latest
curl needed to run api

# command need to run or setup cronjob

php api.php

# windows powershell

while (1) {php api.php; sleep 5} // runs every 5 seconds , but the file creation is happening every 5 min once.

data.json -- all cryptocurrencies data

gdata.json -- total market capital, 24 hour volume

APIs are powered by coinmarketcap.com






cls
set DEBUG=Rent:*,-not_this
supervisor -i ./app/crawler app/boot.js

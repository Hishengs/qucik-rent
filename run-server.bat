cls
set DEBUG=Rent:*,-not_this
supervisor -w app -i app/crawler app/boot.js

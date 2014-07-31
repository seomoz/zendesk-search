all: zip

zip: zendesk-search.zip

zendesk-search.zip: app.js manifest.json app.css templates/* assets/* translations/* src/*
	zip -r zendesk-search.zip manifest.json app.js app.css templates assets translations

# Create app.js by joining of our source files
app.js: src/*.js
	cp src/app.js app.js

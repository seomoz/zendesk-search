all: zip

zip: zendesk-search.zip

zendesk-search.zip: app.js manifest.json app.css templates/* assets/*
	zip -r zendesk-search.zip manifest.json app.js app.css templates assets

# Create app.js by joining of our source files
app.js: src/*
	cat src/elastic.min.js src/elastic-jquery-client.min.js src/zendesk-search.js > app.js

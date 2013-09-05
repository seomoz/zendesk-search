all: zip

zip: zendesk-search.zip

zendesk-search.zip: app.js manifest.json app.css templates/* assets/* translations/* src/*
	zip -r zendesk-search.zip manifest.json app.js app.css templates assets translations

# Create app.js by joining of our source files
app.js: src/*
	#cat src/zendesk-search.js > app.js
	# cat src/elastic.min.js src/elastic-jquery-client.min.js src/zendesk-search.js > app.js
	touch app.js

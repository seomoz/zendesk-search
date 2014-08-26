all: zip

zip: zendesk-search.zip

zendesk-search.zip: app.js manifest.json app.css templates/* assets/* translations/*
	zip -r zendesk-search.zip manifest.json app.js app.css templates assets translations

clean:
	rm zendesk-search.zip

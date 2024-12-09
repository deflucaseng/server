.PHONY: server client clientpush serverpush jsclient

jsclient:
	node main.js

server:
	node server.js


client:
	python3 main.py

clientpush:
	git add .
	git commit -m "clientpush"
	git push


serverpush:
	git add .
	git commit -m "serverpush"
	git push








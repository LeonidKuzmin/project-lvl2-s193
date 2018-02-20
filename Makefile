install:
	npm install

run:
	npm run babel-node -- src/bin/gendiff.js

lint:
	npm run eslint -- src

publish:
	npm publish

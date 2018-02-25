install:
	npm install

run:
	npm run babel-node -- src/bin/gendiff.js --format plain __tests__/__fixtures__/before.yml __tests__/__fixtures__/after.ini

lint:
	npm run eslint .

test:
	npm test

publish:
	npm publish

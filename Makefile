build:
	cd contracts;sozo build;
	cp contracts/target/dev/manifest.json web/src/manifest.json;
	node web/src/generateComponents.cjs;
	cp web/src/output.ts web/src/dojo/contractComponents.ts

test:
	cd contracts; sozo test

prep_web:
	cd web; cp .env.example .env

start_container:
	docker compose up -d

stop_container:
	docker compose down





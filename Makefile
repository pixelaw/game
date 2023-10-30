build:
	cd contracts;sozo build;
#	cp contracts/target/dev/manifest.json web/src/dojo/manifest.json;
#	node web/src/generateComponents.cjs;
#	cp web/src/output.ts web/src/dojo/contractComponents.ts

test:
	cd contracts; sozo test

prep_web:
	cd web; cp .env.example .env

start_keiko: stop_keiko
	make build
	docker compose up -d

restart_keiko: build
	docker compose down -v && docker compose up -d && docker compose logs -f

stop_keiko:
	docker compose down


redeploy:
	@cd contracts; \
	WORLD_ADDR=$$(tail -n1 ../last_deployed_world); \
	sozo migrate --world $$WORLD_ADDR;

deploy:
	@cd contracts; \
	SOZO_OUT="$$(sozo migrate)"; echo "$$SOZO_OUT"; \
	WORLD_ADDR="$$(echo "$$SOZO_OUT" | grep "Successfully migrated World at address" | rev | cut -d " " -f 1 | rev)"; \
	[ -n "$$WORLD_ADDR" ] && \
		echo "$$WORLD_ADDR" > ../last_deployed_world && \
		echo "$$SOZO_OUT" > ../deployed.log; \
	WORLD_ADDR=$$(tail -n1 ../last_deployed_world); \

test:
	cd contracts; sozo test

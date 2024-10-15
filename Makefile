include .env
export $(shell sed 's/=.*//' .env)

watch:
	docker-compose -f docker-compose.dev.yml up

shell:
	docker exec -it ${VITE_CONTAINER_NAME} /bin/bash

builld:
	docker-compose up
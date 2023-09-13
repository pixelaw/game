FROM node:18-alpine as node_deps

WORKDIR /app
COPY /web/package.json ./package.json
COPY /web/yarn.lock ./yarn.lock

# Install dependencies
RUN yarn install --frozen-lockfile

# Now copy all the sources so we can compile
FROM node:18-alpine AS node_builder
WORKDIR /app
COPY /web .
COPY --from=node_deps /app/node_modules ./node_modules

# Build the webapp
RUN yarn build --mode production

FROM oostvoort/dojo-forkserver:dev AS runtime
WORKDIR /opt
COPY /contracts .
COPY --from=node_builder /app/dist static/
HEALTHCHECK CMD (curl --fail http://localhost:3000 && curl --fail http://localhost:5050) || exit 1

CMD ["/opt/server"]

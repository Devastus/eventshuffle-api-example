# Build stage
FROM node:12-alpine AS build
COPY src build/src
COPY ./*.json build/

WORKDIR build/
RUN npm ci && npm run build
# RUN npm ci

# # Run stage
FROM node:12-alpine
COPY --from=build build/package.json app/package.json
COPY --from=build build/package-lock.json app/package-lock.json
COPY --from=build build/dist app/dist

WORKDIR app/
RUN npm ci --only=production

CMD ["npm", "start"]

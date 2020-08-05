FROM node:current-stretch-slim as base
RUN adduser -D appuser -h /app

FROM base AS build
WORKDIR /app
USER appuser
COPY --chown=appuser:appuser . .
RUN yarn install
RUN yarn run build

FROM base AS run
WORKDIR /app
USER appuser
COPY --chown=appuser:appuser . .
COPY --chown=appuser:appuser --from=build /app/dist /app/dist
RUN yarn install --production
EXPOSE 4000
ENV PORT 4000
CMD ["yarn", "start"]


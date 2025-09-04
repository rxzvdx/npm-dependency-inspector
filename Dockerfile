# ----- build stage -----
# use node 20 from Debian bullseye as build env
FROM node:20-bullseye AS build          
# in container, set working dir to /app
WORKDIR /app
# copy JUST package.json & lock file first
COPY package.json package-lock.json*
# install dependencies
RUN npm ci || npm i
# copy rest of proj into /app
COPY . .
# run build (vite --> dist folder)
RUN npm run build

# ----- prod stage -----
# slimmer debian image for prod
FROM node:20-bullseye-slim AS runner
WORKDIR /app
# set env var for prod
ENV NODE_ENV=production
RUN npm i -g serve@14
# copy built app files from build stage
COPY --from=build /app/dist ./dist
# inform docker this container listens on port 4173
EXPOSE 4173
# run serve w/:
    # -s: single-page app mode (for react router)
    # -l: specify port 4173
CMD ["serve", "-s", "dist", "-l", "4173"]



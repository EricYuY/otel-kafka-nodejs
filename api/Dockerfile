#
# BASE NODE
#
FROM node:14-alpine AS base
WORKDIR /app

#
# DEPENDENCIES BUILD
#
FROM base AS dependencies
RUN apk add --no-cache libsecret-dev bash python3 make g++
COPY package*.json ./
RUN npm install --only=production
# side copy the production node_modules folder for later use
RUN cp -R node_modules prod_node_modules
# install also the devDependencies
RUN npm install

#
# RELEASE BUILD
#
FROM base AS release
COPY . .
COPY --from=dependencies /app/prod_node_modules ./node_modules
CMD [ "npm", "start" ]

FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

# Crée un user non-root
RUN addgroup -g 1001 appgroup && adduser -D -G appgroup -u 1001 utilisateur

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

# Change user
USER utilisateur 

CMD ["nginx", "-g", "daemon off;"]

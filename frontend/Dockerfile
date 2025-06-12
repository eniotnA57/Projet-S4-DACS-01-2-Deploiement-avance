FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

# Crée un user non-root
RUN addgroup -g 1001 appgroup && adduser -D -G appgroup -u 1001 utilisateur

# Copie le build React
COPY --from=build /app/build /usr/share/nginx/html

# Copie la conf nginx spéciale React Router
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Change user (tu peux le remettre : ok ici)
#USER utilisateur

CMD ["nginx", "-g", "daemon off;"]

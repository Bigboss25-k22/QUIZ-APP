# build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# runtime stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# optional: custom nginx for SPA fallback and proxy to backend
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

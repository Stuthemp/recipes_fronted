# Stage 1: Build the app
FROM node:alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build
# Output is in /app/dist

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
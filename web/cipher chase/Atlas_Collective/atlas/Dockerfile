<<<<<<< HEAD
FROM node:18-alpine

WORKDIR /srv/atlas

COPY package.json package-lock.json* ./
RUN npm i

# lightweight app
COPY index.html ./
COPY vite.config.js ./

# seed a secret artifact inside container only
RUN mkdir -p /srv/atlas/secrets \
 && echo "FLAG{echo_atlas_multiverse_signature}" > /srv/atlas/secrets/atlas_thread.txt \
 && chmod 600 /srv/atlas/secrets/atlas_thread.txt

EXPOSE 5173
CMD ["npm", "run", "dev"]
=======
FROM node:18-alpine

WORKDIR /srv/atlas

COPY package.json package-lock.json* ./
RUN npm i

# lightweight app
COPY index.html ./
COPY vite.config.js ./

# seed a secret artifact inside container only
RUN mkdir -p /srv/atlas/secrets \
 && echo "FLAG{echo_atlas_multiverse_signature}" > /srv/atlas/secrets/atlas_thread.txt \
 && chmod 600 /srv/atlas/secrets/atlas_thread.txt

EXPOSE 5173
CMD ["npm", "run", "dev"]
>>>>>>> d4a2367056d677336c8a5b16802e91d113b52a21

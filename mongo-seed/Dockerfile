FROM mongo

COPY users.json /users.json
CMD mongoimport --host database --db mean-docker --collection users --file /users.json
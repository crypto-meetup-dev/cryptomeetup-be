# Cryptomeetup Backend

<p align="center" style="font-size: 1.5rem; font-weight:700;">This is still a on going working project</p>

<p align="center">Table of Content</p>

- [Deploy](#Deploy)
  - [clone](#clone)
  - [node installation](#node-installation)
  - [lift up](#lift-up)
  - [reverse proxy](#reverse-proxy)
  - [try out](#try-out)
- [Development](#Development)
- [API Documentation](#API-DOCUMENTATION)
  - [GET /user/login](#get-userlogin)
  - [GET /user/avatar](#get-useravatar)
  - [GET /user/position](#get-userposition)
  - [GET /user/update/email](#get-userupdateemail)
  - [GET /user/update/avatar](#get-userupdateavatar)
  - [GET /user/update/nickname](#get-userupdatenickname)
  - [GET /user/update/position](#get-userupateposition)



## Deploy

### clone

This instance must run behind a proxy if you expect HTTPS and other advanced web server settings.

```
$ git clone https://github.com/crypto-meetup-dev/cryptomeetup-be
$ cd cryptomeetup-be
$ cp config.json.example config.json
$ vim config.json
```

Currently we are only having one parameter here, you can change the port number for your instance. But later we will have more envirnment settings in this file which is important.    

### node installation

After editing the config.json and change the things you want, run to install dependencies:

```
$ yarn
# for npm users
$ npm install
```

### lift up

After your installation finished, run this command on another screen or **pm2**:

```
$ yarn start

# For npm command is compatible though
$ npm start

# For pm2 command
$ pm2 start app.js --name YOU_INSTANCE_NAME -- start
```

### reverse proxy

Let's go to edit our web server configuration. In this case, I use Nginx.

```
$ cd /etc/nginx/sites-available
$ sudo vim api.instance.domain.conf
```

Use something simular to this:

```
server {
        listen 80;
        server_name api.instance.domain;

        return 301 https://$host$request_uri;
}

server {
        listen 443 ssl http2;
        # listen [::]:443 ssl;

        server_name api.instance.domain;

        ssl on;
        ssl_certificate /usr/share/nginx/private/fullchain.pem;
        ssl_certificate_key /usr/share/nginx/private/privkey.pem;
        ssl_prefer_server_ciphers on;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+aRSA+SHA256 EECDH+aRSA+RC4 EECDH EDH+aRSA !aNULL !eNULL !LOW !3DES !MD5 !EXP !PSK !SRP !DSS !RC4";
        keepalive_timeout 70;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        add_header Strict-Transport-Security max-age=63072000;
        add_header X-Content-Type-Options nosniff;

        location ^~ /cryptomeetup/ {
                rewrite ^/cryptometup(/.*)$ $1 break;
                proxy_pass http://127.0.0.1:7000/; #Port number
                proxy_set_header Host $host:$server_port;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Real-PORT $remote_port;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
}
```

### try out

Use the modern web browser to access the domain you just filled in.

If you see the Welcome Page, then you are done, your API instance is online now.

## Development

Make sure you have your `data` and `cache` setup correctly.

For local development, you don't need any other configuration, edit the environment variables in `config.json` and code on your IDE. 

## API DOCUMENTATION

### GET /user/login

| Fields   | Type    | Description                                          |
| -------- | ------- | ---------------------------------------------------- |
| id       | Integer | id of this user in Matataki.io                       |
| email    | String  | email of this user in Matataki.io                    |
| nickname | String  | nickname of this user in Matataki.io                 |
| Avatar   | String  | Partial avatar imgae url of this user in Matataki.io |

#### Response

| Fields  | Type   | Description                                     |
| ------- | ------ | ----------------------------------------------- |
| message | String | Welcome message according to the users nickname |

Example:

```
https://api.instance.com/user/login?id=1&email=master@instance.com&nickname=john&avatar=avatar_url
```

Example response:

```
{ message: Welcome new user john! }
```

### GET /user/avatar

| Fields | Type    | Description                             |
| ------ | ------- | --------------------------------------- |
| id     | Integer | id of the requested user for the avatar |

#### Response

| Fields    | Type      | Description                                   |
| --------- | --------- | --------------------------------------------- |
| Image/png | Image/png | The circle image avatar of the requested user |

Example:

```
https://api.instance.com/user/avatar?id=1
```

Example response:

```
BASE64 imgae/png
```

### GET /user/update/email

| Fields | Type    | Description                                   |
| ------ | ------- | --------------------------------------------- |
| id     | Integer | id of the requested user for the email change |
| email  | String  | email address that needs to be modified       |

#### Response

| Fields  | Type   | Description                                                  |
| ------- | ------ | ------------------------------------------------------------ |
| Message | String | The message saying weither the update is success or not modified |

Example:

```
https://api.instance.com/user/update/email?id=1@email=root@instance.com
```

Example response:

```
{ "message": "success" }
```

### GET /user/update/avatar

| Fields     | Type    | Description                                    |
| ---------- | ------- | ---------------------------------------------- |
| id         | Integer | id of the requested user for the avatar change |
| avatar url | String  | Partial avatar url of the requested user       |

#### Response

| Fields  | Type   | Description                                                  |
| ------- | ------ | ------------------------------------------------------------ |
| Message | String | The message saying weither the update is success or not modified |

Example:

```
https://api.instance.com/user/update/avatar?id=1&avatar=avatar_url
```

Example response:

```
{ "message": "success" }
```

### GET /user/update/nickname

| Fields   | Type    | Description                                         |
| -------- | ------- | --------------------------------------------------- |
| id       | Integer | id of the requested user for the nickname change    |
| nickname | String  | nickname that is going to change for requested user |

#### Response

| Fields  | Type   | Description                                                  |
| ------- | ------ | ------------------------------------------------------------ |
| Message | String | The message saying weither the update is success or not modified |

Example:

```
https://api.instance.com/user/update/nickname?id=1&nickname=steve
```

Example response:

```
{ "message": "success" }
```

### GET /user/update/position

| Fields | Type    | Description                                      |
| ------ | ------- | ------------------------------------------------ |
| id     | Integer | id of the requested user for the position change |
| lng    | Float   | Longtitude for the position to update            |
| lat    | Float   | Latitude for the position to update              |

#### Response

| Fields  | Type   | Description                                                  |
| ------- | ------ | ------------------------------------------------------------ |
| Message | String | The message saying weither the update is success or not modified |

Example:

```
https://api.instance.com/user/update/position?id=1&lng=123.22&lat=32.3331
```

Example response:

```
{ "message": "success" }
```

### 
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
  - [GET /friends](#get-friends)
  - [GET /friends/update](#get-friendsupdate)
  - [GET /invite](#get-invite)
  - [GET /invite/update](#get-inviteupdate)
  - [GET /notification/push](#get-notificationpush)
  - [GET /subscribe](#get-subscribe)
  - [GET /subscribe/all](#get-subscribeall)
  - [GET /subscribe/mine](#get-subscribemine)
  - [GET /subscribe/create](#get-subscribecreate)
  - [GET /subscribe/dismiss](#get-subscribedismiss)
  - [GET /subscribe/add](#get-subscribeadd)
  - [GET /subscribe/remove](#get-subscriberemove)
  - [GET /user/login](#get-userlogin)
  - [GET /user/avatar](#get-useravatar)
  - [GET /user/position](#get-userposition)
  - [GET /user/update/email](#get-userupdateemail)
  - [GET /user/update/avatar](#get-userupdateavatar)
  - [GET /user/update/nickname](#get-userupdatenickname)
  - [GET /user/update/position](#get-userupateposition)
  - [GET /user/update/status](#get-userupdatestatus)



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

### GET /friends

| Fields | Type    | Description                   |
| ------ | ------- | ----------------------------- |
| id     | Integer | id of the user in Matataki.io |

#### Response

| Field                                    | Type  | Description                           |
| ---------------------------------------- | ----- | ------------------------------------- |
| Array of [Friend Object](#Friend-Object) | Array | array of the requested user's friends |

#### Friend Object

| Fields   | Type    | Description                     |
| -------- | ------- | ------------------------------- |
| userId   | Integer | user id of the friend           |
| nickname | String  | nickname of the user            |
| lng      | Float   | longitude of the user last seen |
| lat      | Float   | latitude of the user last seen  |
| status   | Boolean | online status of friend         |

Example:

```
https://api.instance.com/friends?id=0
```

Example response:

```
[{"userId": 2, "nickname": "Sam", "lng": 32.2338, "lat": -64.1292, status: false}]
```

### GET /friends/update

| Fields   | Type    | Description              |
| -------- | ------- | ------------------------ |
| id       | Integer | id of the user to modify |
| removeId | Integer | id of the user to remove |

#### Response

| Field   | Type   | Description                                    |
| ------- | ------ | ---------------------------------------------- |
| message | String | 'success' or 'No need to modify' based on user |

Example:

```
https://api.instance.com/subscribe/dismiss?id=0
```

Example response:

```
{ message: 'success' }
```

### GET /invite

| Fields | Type    | Description                         |
| ------ | ------- | ----------------------------------- |
| id     | Integer | id of the user to send invite       |
| email  | String  | email of the user to get the invite |

#### Response

| Field                                                 | Type                                        | Description                             |
| ----------------------------------------------------- | ------------------------------------------- | --------------------------------------- |
| Object of [Notification Object](#Notification-Object) | [Notification Object](#Notification-Object) | the invited notification object updated |

Example:

```
https://api.instance.com/invite?id=12&email=root@instance.com
```

Example response:

```
{notifyGlobalId: siw92is8, notifyId: 1, userId: 12, title: John, body: "John 希望和你共享 TA 的地图信息（这并不会暴露你的地图信息），要接受吗？", proceed: false}
```

### GET /invite/update

| Fields     | Type    | Description                      |
| ---------- | ------- | -------------------------------- |
| id         | Integer | id of the user to update         |
| result     | String  | 'accept' or 'deny' of the result |
| notifyId   | Integer | id of the notifyObject for user  |
| inviteUser | Integer | id of the user to be invited     |

#### Response

| Field   | Type   | Description                                    |
| ------- | ------ | ---------------------------------------------- |
| message | String | 'success' or 'No need to modify' based on user |

Example:

```
https://api.instance.com/invite/update?id=0&result=accept&notifyId=2&inviteUser=4
```

Example response:

```
{ message: 'success' }
```

### GET /notification/push

| Field | Type    | Description                |
| ----- | ------- | -------------------------- |
| id    | Integer | id of the user to get push |

#### Response

| Field                                               | Type  | Description                               |
| --------------------------------------------------- | ----- | ----------------------------------------- |
| Array of [Notification Object](#notificationobject) | Array | array of the request user's notifications |

#### Notification Object

| Fields         | Type    | Description                                            |
| -------------- | ------- | ------------------------------------------------------ |
| notifyGlobalId | Integer | Global Id of the notify object                         |
| notifyId       | Integer | notification id of the user                            |
| userId         | Integer | the id of user who request                             |
| title          | String  | the title of notification, nickname here               |
| body           | String  | the body of notification                               |
| proceed        | Boolean | a boolean value weither this notification is proceeded |

Example:

```
https://api.instance.com/notification/push?id=0
```

Example response:

```
[{notifyGlobalId: siw92is8, notifyId: 1, userId: 0, title: John, body: "John 希望和你共享 TA 的地图信息（这并不会暴露你的地图信息），要接受吗？", proceed: false}]
```

### GET /subscribe/all

| Field | Type | Description |
| ----- | ---- | ----------- |
| None  | N/A  | N/A         |

#### Response

| Field                                                  | Type  | Description                                      |
| ------------------------------------------------------ | ----- | ------------------------------------------------ |
| Array of [Subscription Profile](#Subscription-Profile) | Array | a array contains all the available subscriptions |

#### Subscription Profile

| Fields   | Type          | Description                                 |
| -------- | ------------- | ------------------------------------------- |
| id       | Integer       | id of the user who created the subscription |
| nickname | String        | nickname of the user                        |
| token    | Integer       | the tokenId for required token              |
| symbol   | String (CAPS) | the symbol of the token                     |
| amount   | Integer       | the required amount token to unlock         |

Example:

```
https://api.instance.com/subscribe/all
```

Example response:

```
[{"userId":"1332","nickname":"アヤカ","token":"22","symbol":"DAO","amount":"1000000"}]
```

### GET /subscribe/mine

| Field | Type    | Description                                    |
| ----- | ------- | ---------------------------------------------- |
| id    | Integer | id of the reuqested user to query subscription |

#### Response

| Field                                                   | Type                                          | Description |
| ------------------------------------------------------- | --------------------------------------------- | ----------- |
| Object of [Subscription Profile](#Subscription-Profile) | [Subscription Profile](#Subscription-Profile) |             |

Example:

```
https://api.instance.com/subscribe/mine?id=0
```

Example response:

```
{"userId":"1332","nickname":"アヤカ","token":"22","symbol":"DAO","amount":"1000000"}
```

### GET /subscribe/create

| Fields  | Type          | Description                                  |
| ------- | ------------- | -------------------------------------------- |
| id      | Integer       | id of the user who create the subscription   |
| tokenId | Integer       | tokenId of the required token                |
| symbol  | String (CAPS) | token symbol of the required token           |
| amount  | Integer       | a specified amount of token for subscription |

#### Response

| Field   | Type   | Description                                        |
| ------- | ------ | -------------------------------------------------- |
| message | String | 'create success' or 'update success' based on user |

Example:

```
https://api.instance.com/subscribe/create?id=0&tokenId=22&symbol=DAO&amount=1000000
```

Example response:

```
{ message: 'create success' }
```

### GET /subscribe/dismiss

| Field | Type    | Description                         |
| ----- | ------- | ----------------------------------- |
| id    | Integer | id of the dismiss subscription user |

#### Response

| Field   | Type   | Description                                    |
| ------- | ------ | ---------------------------------------------- |
| message | String | 'success' or 'No need to modify' based on user |

Example:

```
https://api.instance.com/subscribe/dismiss?id=0
```

Example response:

```
{ message: 'success' }
```

### GET /subscribe/add

| Fields | Type    | Description                               |
| ------ | ------- | ----------------------------------------- |
| id     | Integer | id of the requested user                  |
| addId  | Integer | id of the user who to add to subscription |

#### Response

| Field   | Type   | Description                                    |
| ------- | ------ | ---------------------------------------------- |
| message | String | 'success' or 'No need to modify' based on user |

Example:

```
https://api.instance.com/subscribe/add?id=0
```

Example response:

```
{ message: 'success' }
```

### GET /subscribe/remove

| Fields   | Type    | Description                                    |
| -------- | ------- | ---------------------------------------------- |
| id       | Integer | id of the requested user                       |
| removeId | Integer | id of the user who to remove from subscription |

#### Response

| Field   | Type   | Description                                    |
| ------- | ------ | ---------------------------------------------- |
| message | String | 'success' or 'No need to modify' based on user |

Example:

```
https://api.instance.com/subscribe/remove?id=0
```

Example response:

```
{ message: 'success' }
```

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

### GET /user/update/status

| Fields | Type    | Description                                          |
| ------ | ------- | ---------------------------------------------------- |
| id     | Integer | id of the user to update statuss                     |
| status | Boolean | a boolean value of weither the user is online or not |

#### Response

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

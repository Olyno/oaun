# Oaun

![npm](https://img.shields.io/npm/v/oaun.svg?style=for-the-badge) ![](https://img.shields.io/npm/dw/oaun.svg?style=for-the-badge) ![](https://img.shields.io/github/license/Olyno/oaun.svg?style=for-the-badge)

# Quick Start

```
npm install --save oaun
```

Import components like:

```js
import { DiscordAuth } from 'oaun'
```

# Usage

```js
import { DiscordAuth } from 'oaun';

const CLIENT_ID = 'The client id of your app';
const CLIENT_SECRET = 'The client secret of your app';
const CLIENT_SCOPES = ['identify'] // A Array of scope that you need
const CLIENT_REDIRECT = 'http://localhost:3000/login/callback'; // The redirect URL of your app

// Setup the button
const auth = new DiscordAuth({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    scopes: CLIENT_SCOPES,
    redirect_uri: CLIENT_REDIRECT
})

auth.login() // Open popup to login
    .then(user => {
        console.log(user);
    })
    .catch(error => {
        console.log(error);
    })
```

# Developpement

## Oaun plan

Here is a plan of what Oaun should contain:
 
  - [x] GoogleAuth
  - [ ] FacebookAuth
  - [ ] TwitterAuth
  - [x] DiscordAuth
  - [x] GithubAuth
  - [ ] GitlabAuth
  - [x] BitbucketAuth
  - [ ] ShareAuth

## What Oaun is supposed to be:

 - A 0 dependencies package
 - A easy and fast component to use (plug & play component)

## What Oaun is not supposed to be:

 - A server-side librairy

# Contributing

 1. Clone this repo: git clone https://github.com/Olyno/oaun.git
 2. Install dependencies: ``npm i`` or ``yarn``
 3. Add your components in the ``components`` dir
 4. Make a pull request

# License

Code released under GNU license.

Copyright ©, [Olyno](https://github.com/Olyno).

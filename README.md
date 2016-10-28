

<p align="center">
  <img src="https://raw.githubusercontent.com/S5Platform/design/master/icon.png" width="180px"/>
</p>

# STALK MESSENGER

Stalk Messenger is opensource messenger project based on react native with back-end platform


### Requirements

Node.js and react-native-cli.

Before run stalk-messenger, you need to start back-end servers.

See [S5Platform/stalk-messenger-server](https://github.com/S5Platform/stalk-messenger-server)

### Installation

```
# download project repository
git clone https://github.com/S5Platform/stalk-messenger
cd stalk-messenger

# Installation
npm install
```

### Run IOS simulator

```
react-native run-ios
```

### Or run Android emulator

> **Note:**

> - Add host mapping on your Local PC, starting Android emulator.
> (Default domain name, `local.stalk.io`, is defined in [env.js](https://github.com/S5Platform/stalk-messenger/blob/master/env.js))
> ```
> # /etc/hosts
> 127.0.0.1 local.stalk.io
> ```
> - Run channel-server with specified host name, `local.stalk.io`, see [S5Platform/stalk-messenger-server](https://github.com/S5Platform/stalk-messenger-server)
> ```
> # At stalk-messenger-server
> ./bin/start --channel --host local.stalk.io
> ```
> - Add host mapping on  Android emulator, like Genymotion.
> (You can access local PC via `10.0.3.2` from emulator)
> ```
> adb shell
> mount -o remount,rw /system
> echo "10.0.3.2 local.stalk.io" >> /etc/hosts
> ```

```
react-native run-android
```

## Configuration

Configuration file is [env.js](https://github.com/S5Platform/stalk-messenger/blob/master/env.js).

* `APP_NAME` - The application name. (Default : `STALK`)
* `APP_ID` - The unique id to connect with server. (Default : `STALK`)
* `SERVER_URL` - The connection string for session server. See [S5Platform/stalk-messenger-server](https://github.com/S5Platform/stalk-messenger-server)
* `VERSION`
* `APP_IDENTIFIER_IOS` - Application identifier for ios, store in `Installations` on mongodb
* `APP_IDENTIFIER_ANDROID` - Application identifier for android, store in `Installations` on mongodb

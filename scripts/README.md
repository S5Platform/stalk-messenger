### dataGenerator

**Insert test datas into stalk-messenger back-end system**

Before run scripts, you need to start back-end servers. See [S5Platform/stalk-messenger-server](https://github.com/S5Platform/stalk-messenger-server)

```
# Check out list of commands
./dataGenerator

# examples
./dataGenerator user:create john # create user, named 'john'
./dataGenerator users:create ally 100 # create 100 users start with 'ally' (ally1, ally2 ...)
```

#### optimizeImages.sh

> Before run this script. you have to install [pngcrush](http://pngcrush.com/).

Optimizing png image files with [pngcrush](http://pngcrush.com/)

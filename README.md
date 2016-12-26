# BahnDelays
A twitter bot which posts whenever a train of Deutsche Bahn
is delayed, it fetches a list of stations and views their DepartureBoard 
to get an insight on how much the trains are delayed.

Docs: http://blog.pascalraszyk.de/BahnDelays/docs/

# Building
Checkout the source code and run:
```
npm install
```

To compile the typescript code to javascript run:
```
tsc
(alternatively if tsc is not available run: ./node_modules/.bin/tsc)
```

To generate the docs run:
```
npm run docs
```

To get the twitter client to work you need to specify the apps consumer tokens and access tokens.
I'm using a local .env file which looks like this:

```
CONSUMER_KEY=XXX
CONSUMER_SECRET=XXX
ACCESS_TOKEN=XXX-XXX
ACCESS_TOKEN_SECRET=XXX
BAHN_API_KEY=null
```

The `BAHN_API_KEY` is not used actively at the moment since I couldn't obtain a valid API KEY in time.
This project uses the bahn.de website for data retrival. As soon as I get my API key I will rewrite parts of this bot

# Status
This is far from finished although it works quite well at the moment. 
It needs more fine grained options like a fixed amount of tweets per hour and the
train queue should reset itself every 30minutes. Unfortunately there are soooo many trains delayed 
that its impossible to post every delayed train to twitter without breaking twitter's API Guidelines.

# Copyright
The dataset 'stationdata.csv' is copyrighted by Deutsche Bahn (https://data.deutschebahn.com/dataset/data-stationsdaten)

# Contributions
Contributions are welcomed. Do whatever you want.

# License
            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 
                        Version 2, December 2004 

    Copyright (C) 2004 Sam Hocevar <sam@hocevar.net> 

    Everyone is permitted to copy and distribute verbatim or modified 
    copies of this license document, and changing it is allowed as long 
    as the name is changed. 

                DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 
    TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION 

    0. You just DO WHAT THE FUCK YOU WANT TO.
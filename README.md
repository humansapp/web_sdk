## Summary

This is the guide to the Javascript SDK of Adjust™ for web apps. You can read more about Adjust™ at [adjust.com].

## Table of contents

* [Example apps](#example-app)
* [Basic integration](#basic-integration)
   * [Recommendations](#recommendations)
   * [Basic setup](#basic-setup)
* [Additional features](#additional-features)
   * [Event tracking](#event-tracking)
      * [Revenue tracking](#revenue-tracking)
      * [Callback parameters](#callback-parameters)
      * [Partner parameters](#partner-parameters)
* [Logging](#logging)      
* [License](#license)

## <a id="example-app"></a>Example apps

You can check how SDK can be used in the web app by checking [example app][example-app] in this repository.

## <a id="basic-integration"></a>Basic integration

This SDK can be used to track installs, sessions and events. Simply add the Adjust JS SDK to your web app.

### <a id="recommendations"></a>Recommendations

There are two ways to differentiate users coming from native apps to users coming from web apps if you are not running ad campaigns for your web apps:

- Create new app(s) in your Adjust dashboard for your web app, pick one of the supported platforms during the creation and use this app token in the Adjust SDK to initialise it. As with your native apps, organic traffic from your app will then be labelled under the `Organic` tracker in your Adjust dashboard.
- Use one of your pre-existing app and hardcode a pre-installed tracker token in the Adjust SDK. All traffic from your app will then be labelled under the hardcoded tracker in your Adjust dashboard.

### <a id="basic-setup"></a>Basic setup

There are a few things to keep in mind while implementing the JS SDK:

- If your app isn't able to access or pass advertising IDs such as `gps_adid` or `idfa` or `win_adid` into their respective parameters, it is recommended that you pass a similarly built UUID for iOS and Android and a similar device ID to `win_adid` for Windows. These IDs would need to be generated by your app.

It is possible to define attribution callback method as part of the sdk initialisation.

With this in mind, initialisation of Adjust JS SDK would look like this inside your web app:

```js
Adjust.init({
  appToken: 'YourAppToken',
  environment: 'production', // or 'sandbox' in case you are testing SDK locally with your web app
  attributionCallback: function (newAttribution) {
    console.log(newAttribution) // define your attribution callback function
  }
});
```

## <a id="additional-features"></a>Additional features

Once you integrate the Adjust JS SDK into your web app, you can take advantage of the following features.

### <a id="event-tracking"></a>Event tracking

You can use adjust to track events. Lets say you want to track every tap on a particular button. You would create a new event token in your [dashboard], which has an associated event token - looking something like `abc123`. In order to track this event from your web app, you should do following:

```js
var eventConfig = {
  eventToken: 'EventToken'
};

Adjust.trackEvent(eventConfig)
```

### <a id="revenue-tracking"></a>Revenue tracking

You can attach revenue to event being tracked with Adjust JS SDK in case you would like to track some purchase that happened inside your web app. In order to that, you need to attach `revenue` and `currency` parameters when tracking event:

```js
var eventConfig = {
  eventToken: 'EventToken',
  revenue: 10,
  currency: 'EUR'
};

Adjust.trackEvent(eventConfig)
```

When you set a currency token, adjust will automatically convert the incoming revenues into a reporting revenue of your choice. Read more about [currency conversion here][currency-conversion].

You can read more about revenue and event tracking in the [event tracking guide](https://docs.adjust.com/en/event-tracking/#tracking-purchases-and-revenues).

### <a id="callback-parameters"></a>Callback parameters

You can register a callback URL for your events in your [dashboard]. We will send a GET request to that URL whenever the event is tracked. You can add callback parameters to that event by adding `callbackParams` parameter to the map object passed to `trackEvent` method. We will then append these parameters to your callback URL.

For example, suppose you have registered the URL `http://www.mydomain.com/callback` then track an event like this:

```js
var eventConfig = {
  eventToken: 'EventToken',
  callbackParams: [{
    key: 'key',
    value: 'value'
  }, {
    key: 'foo',
    value: 'bar'
  }],
};

Adjust.trackEvent(eventConfig)
```

In that case we would track the event and send a request to:

    http://www.mydomain.com/callback?key=value&foo=bar

It should be mentioned that we support a variety of placeholders like `{gps_adid}` that can be used as parameter values. In the resulting callback this placeholder would be replaced with the ID for Advertisers of the current device. Also note that we don't store any of your custom parameters, but only append them to your callbacks, thus without a callback they will not be saved nor sent to you.

You can read more about using URL callbacks, including a full list of available values, in our [callbacks guide][callbacks-guide].

### <a id="partner-parameters"></a>Partner parameters

You can also add parameters to be transmitted to network partners, which have been activated in your Adjust dashboard.

This works similarly to the callback parameters mentioned above, but can be added by adding `partnerParams` parameter to the map object passed to `trackEvent` method.

```js
var eventConfig = {
  eventToken: 'EventToken',
  partnerParams: [{
    key: 'key',
    value: 'value'
  }, {
    key: 'foo',
    value: 'bar'
  }],
};

Adjust.trackEvent(eventConfig)
```

You can read more about special partners and these integrations in our [guide to special partners][special-partners].

### <a id="logging"></a>Logging

By default sdk will log only errors in production if no explicit log level is provided. 
Here is the list of log levels which can be passed to init config through `logLevel` parameters:
- `verbose` - will print detailed messages in case of certain actions
- `info` - will print only basic info messages
- `error` - will print only error message
- `none` - won't print anything

```js
Adjust.init({
  // other stuff like appToken and environment
  logLevel: 'LogLevel' // where LogLevel is "verbose", "info", "error" or "none"
});
```


## <a id="license"></a>License

The Adjust SDK is licensed under the MIT License.

Copyright (c) 2018 Adjust GmbH, http://www.adjust.com

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


[adjust.com]:   https://adjust.com
[dashboard]:    http://adjust.com
[example-app]:  src/index.js

[callbacks-guide]:      https://docs.adjust.com/en/callbacks
[special-partners]:     https://docs.adjust.com/en/special-partners
[currency-conversion]:  https://docs.adjust.com/en/event-tracking/#tracking-purchases-in-different-currencies

# Tiny Toast

This is the first of my micro-libraries. It will show tiny messages at the bottom of a web page. That is it.

## Simple messages

Include the script in your web page (it's hosted online!):

```html
<script src="http://catdad.github.io/tiny.cdn/lib/toast/1.0.0/toast.min.js"></script>
```

Then, start sending tiny toast notifications:

```javascript
toast.success('I am a green notification.');
toast.error('I am a red notification.');
toast.warning('I am a yellow notification.');
toast.info('I am a blue notification.');
toast.log('I am a gray notification.');
toast.alert('I am a white message.');
```

It's that easy. They will disappear after a default amount of time. To customize this, add a millisecond timeout to the call.

```javascript
toast.log('I will disappear in 5 seconds.', 5000);
```

Or you can change the default timeout.

```javascript
toast.timeout = 5000;
```

To create an indefinite notification, use `-1` as the timeout:

```javascript
toast.info('Indefinite message', -1);
```

## Advanced messages

All optiosn can be supplied in an options object, as such:

```javascript
toast.success({
    message: 'You succeeded.',
    timeout: 5000
});
```

This options object has the following properties, all of which are optional:

* `message` {string} - The text to display.

* `timeout` {number} - The amount of time, in milliseconds, to display the message. The default value is the value of `toast.timeout`. Setting the timeout to `-1` causes the message to display until it is dismissed.

* `dismissible` {boolean} - Whether clicking on the message will automatically dismiss it. The default for this value is `true`. When set to `false`, the message will not automatically dismiss, and it will not dismissed when clicked on. You will need to call the function returned by `toast.[name]` (when the message is created), or the clear all function `toast.clearAll`.

* `onclick` {function} - A function to execute if the user clicks on the notification to dismiss it (or clicks on a non-dismissible notification). This function will receive the following object as a parameter:
  * `message` {string} - The message that was displayed on the notification.
  * `count` {number} - The amount of messages thta were grouped together. If grouping is enabled, clickable messages will group together, and only fire the last function when clicked on. This value will represent the amout of messages that were grouped together before the notification was dismissed.

* `action` {Object | Array.&lt;Object&gt;} - An object or array of objects. This will display clickable options that the user can use to interact with the notification.
  * `action.name` {string} - The text that is displayed as the clickable action.
  * `action.onclick` {function} - The function to execute when the user selects this action.
  * `action.dom` {HTMLElement} - A fully-formed DOM element to use as the action. This will be inserted into the notification as-is.

## Clearing and grouping messages

To clear any notification, you can simply click on the notification. However, creating a toast also returns a function to clear it, as such:

```javascript
var clearFn = toast.info('Indefinite message', -1);

//use this to clear it
clearFn();
```

To clear all notifications:

```javascript
toast.clear();
```

By default, simple messages will group. This is the equivalent to this:

```javascript
toast.group = true;
```

Toasts now display as `message (x2)`, keeping track of the amount of times a message displays before being cleared. The timeout is reset when a second instance of the message is sent, and the count clears when the notification is dismissed.

To disable this, use the following code:

```javascript
toast.group = false;
```

This will cause each message to produce its own display element. Advanced messages with actions will not group, regardless of this setting.

## About Tiny tools

These are small bits of code that aid in accomplishing common tasks using common or familiar APIs. They are minimal in the amount of code, only providing the bare necessities, have no dependencies, and are reasonably cross-browser compatible. They can be used as quick drop-in solutions during prototyping or creating demos.

All CSS rules have a `t-` prefix, to decrease the posibility of affecting other styles on the page. The necessary CSS is included in the JavaScript files -- a style element is dynamically inserted into the page to style all Tiny components. This was a design choice made in order to decrease the amount of web requests required for a Tiny module, and also to decrease the amount of files necessary for you to include in your project.

## License

This project is licensed under the [MIT X11](http://opensource.org/licenses/MIT) License.

[![Analytics](https://ga-beacon.appspot.com/UA-17159207-7/tiny-toast/readme)](https://github.com/igrigorik/ga-beacon)

# Tiny Toast

This is the first of my micro-libraries. It will show tiny messages at the bottom of a web page. That is it.

## Usage

Include the script in your web page (it's hosted online!):

	<script src="//catdad.github.io/tiny.cdn/lib/toast/latest/toast.min.js"></script>

Then, start sending tiny toast notifications:

	toastr.success('I am a green notification.');
	toastr.error('I am a red notification.');
	toastr.warning('I am a yellow notification.');
	toastr.info('I am a blue notification.');
	toastr.log('I am a gray notification.');
	
It's that easy. They will disappear after a default about of time. To customize this, add a millisecond timeout to the call.

	toastr.log('I will disappear in 5 seconds.', 5000);
	
Or you can change the default timeout.

	toastr.timeout = 5000;
	
To create an indefinite notification, use `-1` as the timeout:

	toastr.info('Indefinite message', -1);
	
To clear any notification, you can simply click on the notification. However, creating a toast also returns a function to clear it, as such:

	var clearFn = toastr.info('Indefinite message', -1);
	
	//use this to clear it
	clearFn();
	
To clear all notifications:

	toastr.clear();

## About Tiny tools

These are small bits of code that aid in accomplishing common tasks using common or familiar APIs. They are minimal in the amount of code, only providing the bare necessities, have no dependencies, and are reasonably cross-browser compatible. They can be used as quick drop-in solutions during prototyping or creating demos.

## License

This project is licensed under the [MIT X11](http://opensource.org/licenses/MIT) License.
[![Code Climate](https://codeclimate.com/github/mwiora/aws-role-editor/badges/gpa.svg)](https://codeclimate.com/github/mwiora/aws-role-editor)

# "AWS Role Editor" extension for Google Chrome

This is a Google Chrome extension to manage roles from the Amazon Web Services (AWS) Console Cross Account delegation
(More about that [here](http://docs.aws.amazon.com/IAM/latest/UserGuide/walkthru_cross-account-with-roles.html)).

Currently this extension allows the following:
* Rename the display name
* Change account and role
* Modify the background color

### Download
From the Google Chrome Webstore: https://chrome.google.com/webstore/detail/aws-role-editor/fefjjiapooggkhiicnofcmlknjgpinop

### Security
Because many people, including myself, are very sensitive using third party tools in AWS, you can check the code or compile the extension on your own.

#### Verify dependencies
To verify the dependencies, you can run:

```
curl -q -s https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css | diff -s - css/bootstrap.min.css
curl -q -s https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js | diff -s - js/bootstrap.min.js
curl -q -s https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/fonts/glyphicons-halflings-regular.woff2 | diff -s - fonts/glyphicons-halflings-regular.woff2
curl -q -s https://code.jquery.com/jquery-3.2.0.min.js | diff -s - js/jquery-3.2.0.min.js
curl -q -s https://code.jquery.com/ui/1.12.1/jquery-ui.min.js | diff -s - js/jquery-ui.min.js
curl -q -s https://raw.githubusercontent.com/bgrins/spectrum/1.8.0/spectrum.css | diff -s - css/spectrum.css
curl -q -s https://raw.githubusercontent.com/bgrins/spectrum/1.8.0/spectrum.js | diff -s - js/spectrum.js
```

last dependencies update check: 18.03.2017

### Screenshots
#### Editor
![example image](https://lh3.googleusercontent.com/_uWwbvqql457gLc2oDq5-vJ6b8pLRTkfdXDC8RkUlRUCDv4WdyhNjVMZ-OGUfyaCBPLszAwQ=s640-h400-e365-rw "AWS Role Editor")
#### As displayed in the AWS Console
![example image](https://lh3.googleusercontent.com/dhTb_FYvg7A07BR4SOR1Oopi6quBxDe-XY0iaje9aptNei-ZDhE83AGp1hqzN7juEA0JjcDV=s640-h400-e365-rw "AWS Role Editor")

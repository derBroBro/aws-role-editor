document.addEventListener("DOMContentLoaded", function() {

    $("#saved").hide();
    $("#failed").hide();
    $("#export").hide();
    $("#save").hide();

    getRoleCookieFromBrowser();

    $("#export").click(function(e) {
        var theCookieValueObj = encodeURIComponent(JSON.stringify(saveValues()));
        download("export.txt", decodeURIComponent(theCookieValueObj));
    });

    document.getElementById('file').addEventListener('change', readFile, false);

    function getRoleCookieFromBrowser() {
        var cookie;
        chrome.cookies.get({
            url: "https://console.aws.amazon.com",
            name: "noflush_awsc-roleInfo"
        }, function(cookie) {
            if (!cookie) {
                $("#failed").show();
                $("#failed").text("Could not read cookie. Either use AWS to create the first Switch Role or import an existing export.");
                return;
            }
            var theCookieValueObj = decodeCookie(cookie);
            // console.log(theCookieValueObj);
            drawForm(theCookieValueObj);
            $("#export").show();
            $("#save").show();
        });
        return cookie;
    }

    function getUserCookieFromBrowser() {
        var cookie;
        chrome.cookies.get({
            url: "https://console.aws.amazon.com",
            name: "aws-userInfo"
        }, function(cookie) {
            if (!cookie) {
                $("#failed").show();
                $("#failed").text("Could not read cookie. Either use AWS to create the first Switch Role or import an existing export.");
                return;
            }
            var theCookieValueObj = decodeCookie(cookie);
            console.log(theCookieValueObj);
            // alert(theCookieValueObj);
            $("#export").show();
            $("#save").show();
        });
        return cookie;
    }

    function decodeCookie(cookie) {
        var theCookieValue = cookie.value.replace(/\+/g, "%20"); // workaround as unclear
        theCookieValue = decodeURIComponent(theCookieValue);
        var cookievalue = JSON.parse(theCookieValue);
        return cookievalue;
    }

    function drawForm(theCookieValueObj) {
        $("tbody").empty();
        // var theCookieValueObj = {};
        
        // console.log(theCookieValueObj);

        for (var i = 0; i < 5; i++) {
            // console.log(theCookieValueObj.rl[i]);

            var account = "",
                role = "",
                displayname = "",
                color = "";

            if (theCookieValueObj.rl[i] !== undefined) {
                account = theCookieValueObj.rl[i].a;
                role = theCookieValueObj.rl[i].r;
                displayname = decodeURIComponent(theCookieValueObj.rl[i].d);
                color = theCookieValueObj.rl[i].c;
            }

            var row = $('<tr></tr>');
            row.append($('<td class="handle text-center vertical-center"><span class="glyphicon glyphicon-move"></span></td>'));
            row.append($('<td></td>').append($('<input type="text" class="form-control input-sm" name="account" size="12">').val(account)));
            row.append($('<td></td>').append($('<input type="text" class="form-control input-sm" name="role">').val(role)));
            row.append($('<td></td>').append($('<input type="text" class="form-control input-sm" name="displayname">').val(displayname)));
            row.append($('<td></td>').append($('<input type="text" name="color">').val(color)));
            row.append($('<td class="text-center vertical-center"><span class="glyphicon glyphicon-trash"></span></td>'));
            $("tbody").append(row);
        }

        // Make the enter key submit
        $("input").keypress(function(e) {
            if (e.which == 13) {
                $("form").submit();
                return false;
            }
        });

        // Make the rows draggable
        $("tbody").sortable({
            handle: ".handle",
            cursor: "move",
            placeholder: "sortable-placeholder"
        });

        // Activate color pickers
        $("[name=color]").spectrum({
            preferredFormat: "hex",
            showInput: true,
            allowEmpty: true,
            showPalette: true
        });

        // Activate trash icons
        $(".glyphicon-trash").click(function() {
            $(this).parents("tr").find("input").val("");
        });
    }

    $("#main").submit(function(e) {
        e.preventDefault();
        var newCookieValueObj = saveValues();
        var newCookie = createNewCookie(newCookieValueObj);
        chrome.cookies.set(newCookie, function(cookie) {
            if (cookie) {
                $("#saved").show();
                setTimeout(function() {
                    window.close();
                }, 1000);
            } else {
                $("#failed").show();
                $("#failed").text("Failed to save cookie.");
            }
        });
    });

    function saveValues() {
        var theCookieValueObj = {};
        theCookieValueObj.rl = [];
        $("tbody > tr").each(function() {
            var account = $("[name=account]", this).val();
            var role = $("[name=role]", this).val();
            var displayname = $("[name=displayname]", this).val();
            var color = $("[name=color]", this).val();
            if (color[0] == "#") {
                color = color.substr(1).toUpperCase();
            }

            if (account && role && displayname) {
                theCookieValueObj.rl.push({
                    a: account,
                    r: role,
                    d: displayname,
                    c: color
                });
            }
        });
        return theCookieValueObj;
    }

    function createNewCookie(cookievalue) {
        var newCookie = {
            url: "https://console.aws.amazon.com",
            domain: "aws.amazon.com",
            secure: true,
            name: "noflush_awsc-roleInfo",
            expirationDate: 3597523199,
            value: encodeURIComponent(JSON.stringify(cookievalue))
        };
        return newCookie;
    }

    function download(filename, text) {
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        pom.setAttribute('download', filename);

        if (document.createEvent) {
            var event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            pom.dispatchEvent(event);
        } else {
            pom.click();
        }
    }

    function readFile(evt) {
        var files = evt.target.files;
        var file = files[0];
        var reader = new FileReader();
        reader.onload = function() {
            localfilecontent = this.result;
            if (!isJson(localfilecontent)) {
                $("#failed").show();
                $("#failed").text("Could not find a valid export - did you select the right file?");
                return;
            }
            localfilecontentobj = JSON.parse(localfilecontent);
            if (localfilecontentobj.hasOwnProperty('rl')){
                console.log("valid export found!");
                drawForm(localfilecontentobj);
                $("#failed").hide();
                $("#export").show();
                $("#save").show();
                return;
            }
            if (localfilecontentobj.hasOwnProperty('region')){
                console.log("valid s3config found!");
                getConfigFromS3(localfilecontentobj['accessKeyId'], localfilecontentobj['secretAccessKey'], localfilecontentobj['region'], localfilecontentobj['s3bucket'], localfilecontentobj['s3key']);
                $("#failed").hide();
                $("#export").show();
                $("#save").show();
                return;
            }

        };
        reader.readAsText(file);
    }

    function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
        return true;
    }

    function getConfigFromS3(accessKeyId, secretAccessKey, region, s3bucket, s3key) {
        AWS.config.update({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            "region": region
        });
        var s3 = new AWS.S3({signatureVersion: 'v4'});
        var params = {
            Bucket: s3bucket,
            Key: s3key
        };
        s3.getObject(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else {
                remotefilecontentobj = JSON.parse(data.Body.toString());
                drawForm(remotefilecontentobj); // successful response
            }
        });
    }
}, false);
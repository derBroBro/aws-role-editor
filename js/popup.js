document.addEventListener("DOMContentLoaded", function() {

    $("#saved").hide();
    $("#failed").hide();
    $("#export").hide();
    $("#save").hide();

    cookie = getCookieFromBrowser();

    $("#import").click(function(e) {
        alert("import!");
    });

    $("#export").click(function(e) {
        theCookieValueObj = encodeURIComponent(JSON.stringify(saveValues()));
        download("export.txt", decodeURIComponent(theCookieValueObj))
    });

    document.getElementById('file').addEventListener('change', readFile, false);

    function getCookieFromBrowser() {
        var cookie;
        chrome.cookies.get({
            url: "https://console.aws.amazon.com",
            name: "noflush_awsc-roleInfo"
        }, function(cookie) {
            if (!cookie) {
                $("#failed").show();
                $("#failed").text("Could not read cookie, sure you use AWS?");
                return;
            }
            theCookieValueObj = decodeCookie(cookie);
            // console.log(theCookieValueObj);
            drawForm(theCookieValueObj);
            $("#export").show();
            $("#save").show();
        });
        return cookie;
    }

    function decodeCookie(cookie) {
        var theCookieValue = cookie.value.replace(/\+/g, "%20"); // workaround as unclear
        theCookieValue = decodeURIComponent(theCookieValue);
        cookievalue = JSON.parse(theCookieValue);
        return cookievalue;
    }

    function encodeCookie(cleartext) {
        var theCookieValue = encodeURIComponent(JSON.stringify(cleartext))
        encodedCookie = createNewCookie(theCookieValue);
        // console.log(encodedCookie);
        return encodedCookie;
    }

    function drawForm(theCookieValueObj) {
        $("tbody").empty();
        // var theCookieValueObj = {};
        
        console.log(theCookieValueObj);

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
            placeholder: "sortable-placeholder",
        });

        // Activate color pickers
        $("[name=color]").spectrum({
            preferredFormat: "hex",
            showInput: true,
            allowEmpty: true,
            showPalette: true,
        });

        // Activate trash icons
        $(".glyphicon-trash").click(function() {
            $(this).parents("tr").find("input").val("");
        })
    };

    $("#main").submit(function(e) {
        e.preventDefault();
        newCookieValueObj = saveValues();
        newCookie = createNewCookie(newCookieValueObj);
        chrome.cookies.set(newCookie, function(cookie) {
            if (cookie) {
                $("#saved").show();
                setTimeout(function() {
                    // window.close();
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
        http: //jsfiddle.net/XRZNX/#
            var files = evt.target.files;
        var file = files[0];
        var reader = new FileReader();
        reader.onload = function() {
            if (!isJson(this.result)) {
                $("#failed").show();
                $("#failed").text("Could not find a valid export - did you select the right file?");
                return;
            }
            cookievalue = JSON.parse(this.result);
            drawForm(cookievalue);
            $("#failed").hide();
            $("#export").show();
            $("#save").show();

        }
        reader.readAsText(file)
    }

    function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
        return true;
    }
}, false);
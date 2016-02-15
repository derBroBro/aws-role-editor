document.addEventListener('DOMContentLoaded', function() {
  var theCookie = {};
  var theCookieValue = {};
  var theCookieValueObj = {};

  $("#saved").hide();
  $("#failed").hide();

  $("#save").click(function() {
    theCookieValueObj.rl=[];
    for(var i = 0;i < 5;i++ ){
      var account=$("#"+i+"account").val();
      var role=$("#"+i+"role").val();
      var displayname=$("#"+i+"displayname").val();
      var color=$("#"+i+"color").val();

      if(account && role && displayname && color){
        theCookieValueObj.rl.push({
          a:account,
          r:role,
          d:displayname,
          c:color
        });
      } else {
      }
    }

    var newCookie = {
      url: "https://console.aws.amazon.com",
      domain: "aws.amazon.com",
      secure: true,
      name: "noflush_awsc-roleInfo",
      expirationDate: 3597523199,
      value: encodeURIComponent(JSON.stringify(theCookieValueObj))
    };

    chrome.cookies.set(newCookie,function(cookie){
      if(cookie){
        $("#saved").show();
        setTimeout(function(){
          window.close();
        },1000);
      } else {
        $("#failed").show();
        $("#failed").text("Failed to save cookie...");
      }
    })
  });

  chrome.cookies.get({ url: 'https://console.aws.amazon.com', name: 'noflush_awsc-roleInfo' },
    function (cookie) {
      if (cookie) {
        theCookie = cookie;
        theCookieValue = cookie.value.replace(/\+/g,"%20");// workarround as unclear
        theCookieValue = decodeURIComponent(theCookieValue);
        theCookieValueObj = JSON.parse(theCookieValue);
        $("#username").text("For user "+theCookieValueObj.bn + " @ " + theCookieValueObj.ba);


        var innerContent = ""
        for(var i = 0;i < 5;i++ ){
          var account="",
              role="",
              displayname="",
              color="";

          if(theCookieValueObj.rl[i] !== undefined){
            account = theCookieValueObj.rl[i].a;
            role = theCookieValueObj.rl[i].r;
            displayname = decodeURIComponent(theCookieValueObj.rl[i].d);
            color = theCookieValueObj.rl[i].c;
          }
          innerContent+="<tr>"
          innerContent+="<td><input type='text' class='form-control input-sm' size='12' id='"+i+"account' value='"+account+"'></td>";
          innerContent+="<td><input type='text' class='form-control input-sm' id='"+i+"role' value='"+role+"'></td>";
          innerContent+="<td><input type='text' class='form-control input-sm' id='"+i+"displayname' value='"+displayname+"'></td>";
          innerContent+="<td><input type='text' class='form-control input-sm' size='6' id='"+i+"color' value='"+color+"'></td>";
          innerContent+="</tr>"
        }
        $("#content").html(innerContent);
      }
      else {
        $("#failed").show();
        $("#failed").text("No cookie found, sure you use AWS?");
      }
    });
}, false);

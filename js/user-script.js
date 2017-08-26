$(document).ready(function() {
    generateUserLoginElement().then(function(newElement) {
        $(".main-nav").children('ul').append(newElement);
        
        $("#sign-out").click(function(x) {
            firebase.auth().signOut().then(function() {
                location.reload();
            }).catch(function(err) {
                console.log(err);
            });
        });
        $("#change-user").click(function(x) {
            var newName = prompt("Type your new username");
            newName = convertRawTextToSafeText(newName);
            firebase.auth().onAuthStateChanged(function(user) {
                if(user) {
                    var newProfileInfo = {};
                    newProfileInfo.displayName = newName;
                    user.updateProfile(newProfileInfo).then(function() {
                        location.reload();
                    }).catch(function(err) {
                        console.log(err);
                    });
                }
            });
        });
    });
    
    
});

function generateUserLoginElement() {
    $def = new $.Deferred();
    firebase.auth().onAuthStateChanged(function(user) {
        var $newElement = $("<li>", {id: "user"});
        if(user) {
            //Someone is logged in.
            var name = user.displayName;
            $newElement = $("<div>", {id:"user","class":"dropdown"});
            var newhtml = "<li><a href=\"#\">" + name + "</a></li><div class=\"dropdown-items\"><a id=\"change-user\" href=\"#\">Change Username</a><br><br><a id=\"sign-out\" href=\"#\">Sign Out</a></div>";
            $newElement.html(newhtml);
            //alert($newElement.html());
        } else {
            //We want them to be able to log in.
            $newElement.click(function() {
                var loginProvider = new firebase.auth.GoogleAuthProvider();
                firebase.auth().signInWithPopup(loginProvider).then(function(x) {
                    //x= auth token,, who cares rn
                    location.reload();
                });;
            });
            
            $newElement.html("<a href=\"#\">Login</a>");
        }
        $def.resolve($newElement);
    });
    return $def;
}


/* Not all pages have Util.js, so including this */

//Find illegal characters in string. This is mainly to be more safe when allowing uses to create posts. (Some users could add <input id="...".>> to fool people)
//This method returns the indicies of each illegal character.
function findIllegalChars(str) {
    var illegalChars = ['<','>'];
    var illegalIndicies = [];
    //As far as I can tell, these are the only illegal characters we need.
    for(var i = 0; i < str.length; i++) {
        for(var x = 0; x < illegalChars.length; x++) {
            if(str.charAt(i) === illegalChars[x]) {
                illegalIndicies.push(i);
            }
        }
    }
    return illegalIndicies;
}



function getIllegalReplacement(char) {
    var illegalChars = ['<','>'];
    var safeMatchups = ["&lt;","&gt;"];
    for(var i = 0; i < illegalChars.length; i++) {
        //This is so bad but i cant remember how to make keys / values
        if(char === illegalChars[i]) {
            return safeMatchups[i];
        }
    }
    return char;
}

function stringReplaceAt(str, index, replacement) {
    return str.substring(0,index) + replacement + str.substring(index+1, str.length);
}

function addLineBreaks(str) {
    var newLines = str.split("\n");
    if(newLines.length == 1)
        return str;
    var newStr = newLines[0]+"<br/>";
    for (var i = 1; i < newLines.length-1; i++) {
    newStr+=newLines[i];
    newStr+="<br/>";
    }
    newStr+=newLines[newLines.length-1];
    return newStr;
}

//This replaces illegal characters with the html short cuts and line breaks with <br>
function convertRawTextToSafeText(str) {
    var toChange = findIllegalChars(str);
    for(var i = toChange.length-1; i >= 0; i--) {
    		$("#t").append(i + "  " + toChange[i]);
        var badChar = str.charAt(toChange[i]);
        var newChar = getIllegalReplacement(badChar);
        str = stringReplaceAt(str, toChange[i], newChar);
    }
    str = addLineBreaks(str);
    return str;
}
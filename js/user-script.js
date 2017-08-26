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
            var newhtml = "<li><a href=\"#\">" + name + "</a></li><div class=\"dropdown-items\"><a href=\"#\">Profile</a><br><br><a id=\"sign-out\" href=\"#\">Sign Out</a></div>";
            $newElement.html(newhtml);
            //alert($newElement.html());
        } else {
            //We want them to be able to log in.
            $newElement.click(function() {
                var loginProvider = new firebase.auth.GoogleAuthProvider();
                firebase.auth().signInWithPopup(loginProvider).then(function(x) {
                    var user = x.user;
                    var userId = user.uid;
                    retriveDataPromiseAtLocation("registeredUsers").done(function(result) {
                        var userLoc = $.inArray(userId, result);
                        if(userLoc == -1) {
                            //User doesn't exist, ask to change name
                            var newName = prompt("Enter your username for this site (You can't change it):");
                            
                        } else {
                            //User exists...normal login.
                        }
                    });
                    //location.reload();
                });;
            });
            
            $newElement.html("<a href=\"#\">Login</a>");
        }
        $def.resolve($newElement);
    });
    return $def;
}

//This is included because not all pages have Util.js

/*
    A deferred function which calls the firebase database at the given location. 
    Retrieves the data from the location and returns it. It can be accessed through
    retrieveData..Location(loc).done(func (data) {}); where (data) is the data from the location.
    The data can either be an array, string, or anything else depending on the location
*/
function retriveDataPromiseAtLocation(location) {
    
    var $deferred = new $.Deferred();
    
    firebase.database().ref(location).once("value").then(function(data) {
        dataToReturn = data.val();
        $deferred.resolve(dataToReturn);
    });
    return $deferred.promise();
}

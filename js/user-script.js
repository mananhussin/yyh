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
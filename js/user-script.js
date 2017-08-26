$(document).ready(function() {
    generateUserLoginElement().then(function(newElement) {
        $(".main-nav").children('ul').append(newElement);
    });
});

function generateUserLoginElement() {
    $def = new $.Deferred();
    firebase.auth().onAuthStateChanged(function(user) {
        var $newElement = $("<li>", {id: "user"});
        if(user) {
            //Someone is logged in.
            var name = user.displayName;
            var newhtml = "<div class=\"dropdown\"><a href=\"#\">" + name + "</a><div class=\"drop-content\"><ul><li><a href=\"#\">Test</a></li></ul></div></div>";
            $newElement.html(newhtml);
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
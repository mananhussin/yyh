$(document).ready(function() {
    var newElement = generateUserLoginElement();
    $(".main-nav").children('ul').append(newElement);
});

function generateUserLoginElement() {
    $def = new $.Deferred();
    firebase.auth().onAuthStateChanged(function(user) {
        var $newElement = $("<li>", {id: "user"});
        if(user) {
            //Someone is logged in.
            var name = user.displayName;
            $newElement.html("<a href=\"#\">" + name + "</a>");
        } else {
            //We want them to be able to log in.
            $newElement.click(function() {
                var loginProvider = new firebase.auth.GoogleAuthProvider();
                firebase.auth().signInWithPopup(loginProvider);
            });
        }
        $newElement.html("<a href=\"#\">Login</a>");
    });
    return $def;
}
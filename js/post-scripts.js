//This relies on util.js, firebase, and jQuery

$(document).ready(function() {
    //Load post
    //Find post location
    var postLocation = window.location.href.split("?loc=")[1];
   
    retriveDataPromiseAtLocation(postLocation).done(function(data) {
        var postData = data;
        if(postData == null) {
            alert("Post unable to be located.");
            return;
        }
        var post = createPostFromPostData(postData);
        insertHTMLToElement(post.generatePrimaryHTML(), $("#post-original"));
        insertHTMLToElement(post.generateReplyHTML(), $("#post-replies"));
    });
    
});
//Global Vars
var queryTypes = {"g":"/web","y":"/video"};
var serverAddr = "localhost:3000";

function keyShortcut() {
    $(document).keydown(function(e){
        if (e.keyCode == 191) { //back slash 
            if (e.ctrlKey) {
                $('#searchbar').focus();
            }
            else {
                $('#cmdLine').focus();
            } 
            return false;
        }
    });
}

function visitBtn() {

}

function shareBtn() {

}

function addBtn() {
    var target = App.NextCol().add({'editable': true});
}

function downloadBtn() {

}

$(function() {
    $('#addBtn').click(addBtn);
    $('#downloadBtn').click(downloadBtn);
    
    $('.icon-search').click(function() {
        $('#searchForm').submit();
    });
    
    //settings
    $('#searchForm').submit(function() {
        var input = $('#searchbar').val();
        //SearchEngine.sendQuery(input);
        var url = "/entity/" + input;
        $.get(url, function(data) {
          console.log(data);
          var imgUrl = data.imgUrl;
          console.log(imgUrl);
          var descr = data.description;
          var entity = {
            cardTitle: data.name,
            cardContent: '<img src="' + imgUrl + '" />' +
              '<p>' + descr + '</p>'
          }
          var entityModel = new App.Card(entity);
          //var entityView = new App.CardView(entityModel);
          //entityView.render();

          App.NextCol().add(entityModel);
        });
        return false;
    });

    keyShortcut();
});

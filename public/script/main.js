//Global Vars
var queryTypes = {"g":"/web","y":"/video"};
var serverAddr = "localhost:3000";
var currentEntity = '';

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

function startEditBtn(that) {
    //enable contenteditable and allow user to add image
    var $parent = $(that.target).parents('.card');
    var $contContainer = $parent.find('.contentContainer'); 
    $contContainer.prepend(Template.static_editUI);

    //tweeting bad 
    $('.editUIBtn').click(finEditBtn);
}

function finEditBtn(that) {
    var $parent = $(that.target).parents('#col2');
    var $attrTitle = $parent.find('.attrTitle').html;

    var url = '/entity/' + currentEntity + '/attr/create?name=' + attrTitle;
    $.post(url, function(data) {
      console.log(data);
      $('#searchForm').submit();
    });
    
} 

function startAttrBtn(that) {
    //add new a new attr
    var $parent = $(that.target).parents('.card');
    var $contContainer = $parent.find('.contentContainer'); 

    var aModel = new App.Attr({
        'attrTitle': 'Enter New Attribute Name',
        'attrValue': [0, 50],
        'editable': true
    });

    var aView = new App.AttrView(aModel);
    $contContainer.prepend(aView.render().$el);

    var $parent = $(that.target).parents('#col2');
    console.log($parent);
    var $button = $parent.find('.btnplus');
    console.log($button);
    $button.html('Done');

    $button.click(finAttrBtn);
}

function finAttrBtn(that) {
    var $parent = $(that.target).parents('#col2');

    var imgSrc = $parent.find('input').val(); 
    console.log(imgSrc);
    var url = '/entity/' + currentEntity + '/edit?imgUrl=' + imgSrc;
    $.post(url, function(data) {
      console.log(data);
      $('#searchForm').submit();
    });
    
    var $contContainer = $parent.find('.contentContainer');

    var mCid = $parent.parents('.card').attr('cid');
    var model = App.Column1.getByCid(mCid);

    model.imgSrc = imgSrc;

    $parent.remove();
}

function animateAttrRating() {
    $('.progress .bar').progressbar({
        transition_delay: 1000,
        refresh_speed: 50,
        display_text: 2,
        use_percentage: true
    });
}

function addEntityBtn() {
    //add a new entity 
    var target = App.NextCol().add({'editable': true});
    $(target).click();
}

$(function() {
    $('#addEntityBtn').click(addEntityBtn);
    $('#downloadBtn').click(downloadBtn);
    
    $('.icon-search').click(function() {
        $('#searchForm').submit();
    });

    $('.editUIBtn').click(function() {
      console.log('cliiiick');
      var input = $('input.url').val();
      var url = '/entity/' + currentEntity + '/edit?imgUrl=' + input;
      $.put(url, function(data) {
        console.log(data);
      });
    });

    //settings
    $('#searchForm').submit(function() {
        var input = $('#searchbar').val();
        //SearchEngine.sendQuery(input);
        var url = "/entity/" + input;
        $.get(url, function(data) {
          console.log(data);
          if (data.error)
            return;

          currentEntity = input;
          var imgUrl = data.imgUrl;
          console.log(imgUrl);
          var descr = data.description;
          var entity = {
            cardTitle: data.name,
            cardContent: '<img src="' + imgUrl + '" />' +
              '<p>' + descr + '</p>'
          };
          var entityModel = new App.Card(entity);

          App.ClearCols();
          App.NextCol().add(entityModel);

          var cardContent = '';
          for (var key in data.attrs) {
            console.log(key);
            var attr = {
              attrTitle: key,
              //attrValue: data.attrs['Height']
              attrValue: data.attrs[key]
            };
            var attrModel = new App.Attr(attr);
            var attrView = new App.AttrView(attrModel);
            cardContent += attrView.render().$el.html();
          }
          console.log(['cardContent', cardContent]);

          App.NextCol().add({cardTitle: 'Attributes', iconType: 'plus', 'cardContent': cardContent});
        });
        return false;
    });

    keyShortcut();
});

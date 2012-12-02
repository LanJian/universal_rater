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

    var $descr = $parent.find('.entity-descr');
    console.log($descr);
    $descr.prop({contenteditable: true});
    console.log($descr.attr('contenteditable'));

    //tweeting bad 
    $('.editUIBtn').click(finEditBtn);
}

function finEditBtn(that) {
    var $parent = $(that.target).parents('.editUI');
    var imgSrc = $parent.find('input').val();
    var $descr = $($parent.parents('.card').find('.entity-descr'));

    var imgSrcQuery = '';
    if (imgSrc)
      imgSrcQuery += '&imgUrl=' + imgSrc;
    var url = '/entity/' + currentEntity + '/edit?description=' + $descr.html() + imgSrcQuery;
    $.post(url, function(data) {
      console.log(data);
      $('#searchForm').submit();
    });
    
    var $contContainer = $parent.find('.contentContainer');

    var mCid = $parent.parents('.card').attr('cid');
    var model = App.Column1.getByCid(mCid);

    model.imgSrc = imgSrc;

    $descr.prop({contenteditable: false});

    $parent.remove();
} 

function startAttrBtn(that) {
    //add new a new attr
    var $parent = $(that.target).parents('.card');
    var $contContainer = $parent.find('.contentContainer'); 

    var $button = $parent.find('.btnplus');
    console.log($button);
    if ($button.html() == 'Done')
      return;

    var aModel = new App.Attr({
        'attrTitle': 'New Attribute',
        'attrValue': [0, 50],
        'editable': true
    });

    var aView = new App.AttrView(aModel);
    $contContainer.prepend(aView.render().$el);
    var well = $($parent.find('.well')[0])
    well.css('background-color', '#e0ffc2');
    $(well.find('.attrTitle')).focus();

    $button.html('Done');

    //$button.off('click');
    $button.click(finAttrBtn);
}

function finAttrBtn(that) {
    var $parent = $(that.target).parents('.card');
    var $button = $parent.find('.btnplus');

    console.log('--------------attrTitle: ');
    console.log($($parent.find('.attrTitle')));
    var attrTitle = $($parent.find('.attrTitle')[0]).html();
    console.log(attrTitle);

    var url = '/entity/' + currentEntity + '/attr/create?name=' + attrTitle;
    $.post(url, function(data) {
      console.log(data);
      $('#searchForm').submit();
    });

    //$button.off('click');
    $button.click(startAttrBtn);
}

function animateAttrRating() {
    setTimeout(function() {
        $('.progress .bar').progressbar({
        transition_delay: 300,
        refresh_speed: 50,
        display_text: 2,
        use_percentage: true
        });

        $('.attrDiv').on('click', getComment);

    }, 1000);;
}

function addEntityBtn() {
    //add a new entity 
    var target = App.NextCol().add({'editable': true});
    $(target).click();
}

function addRating(e) {
  var slider = $(e.target);
  var attrTitle = $(slider.parent().prev().find('.attrTitle')).html();
  console.log(attrTitle);

  var val = slider.val() * 10;
  console.log(val);

  var url = '/entity/' + currentEntity + '/attr/' + attrTitle + '/rating?rating=' + val;
  $.post(url, function(data) {
    console.log(data);
    $('#searchForm').submit();
  });
}

function getComment(that) {
    var attrName = $(that.target).parents('.attrDiv').find('.attrTitle').html();

    if (!attrName) {
        return;
    }

    var url = "/entity/"+currentEntity+"/attr/"+attrName+"/comments";

    $.get(url, function(data) {
        var col3 = $('#col3');
        var cardContent = '';

        for (var i = 0; i < data.length; i++) {
            var commentM = new App.Comment({
                "comment": data[i]['comment']
            });
            var commentV = new App.CommentView(commentM);
            cardContent += commentV.render().$el.html();
        }

        if (!data.length) {
            cardContent += new App.CommentView(new App.Comment()).render().$el.html();
        }
        
        col3.add({'cardTitle':attrName+" Comments", 
                  'cardContent': cardContent,
                  'iconType': 'plus'
        });
    });
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
            cardContent: '<img src="' + imgUrl + '" /><br /><br />' +
              '<p class="entity-descr">' + descr + '</p>'
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

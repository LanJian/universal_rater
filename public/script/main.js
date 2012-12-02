//Global Vars
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

function finEditBtn(that) {
    var $parent = $(that.target).parents('.editUI');

    var imgSrc = $parent.find('input').val(); 
    var $contContainer = $parent.find('.contentContainer');

    var mCid = $parent.parents('.card').attr('cid');
    var model = App.Column1.getByCid(mCid);

    model.imgSrc = imgSrc;
} 

function finAttrBtn(that) {
}

function startEditBtn(that) {
    //enable contenteditable and allow user to add image
    var $parent = $(that.target).parents('.card');
    var $contContainer = $parent.find('.contentContainer'); 
    $contContainer.prepend(Template.static_editUI);

    //tweeting bad 
    $('.editUIBtn').click(finEditBtn);
}

function startAttrBtn(that) {
    //add new a new attr
    var $parent = $(that.target).parents('.card');
    var $contContainer = $parent.find('.contentContainer'); 

    var aModel = new App.Attr({
        'attrTitle': 'Enter New Attribute Name',
        'attrValue': [0, 50],
    });

    var aView = new App.AttrView(aModel);
    $contContainer.prepend(aView.$el);
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
    
    //settings
    $('#searchForm').submit(function() {
        var input = $('#searchbar').val();
        SearchEngine.sendQuery(input);
        return false;
    });

    keyShortcut();
});

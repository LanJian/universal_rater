//'<!--Start of Build In Javascript Template-->'
var Template = (function() {
  var cardTemplate = 
    '<div id="<%=cardId%>" class="card-header">' +
        '<legend contenteditable="<%=editable%>" class="card-title">' +
        	'<%=cardTitle%>' +
        '</legend>' +
        '<div class="pull-right" style="margin-top:-4em; padding-right: 0.5em;">' +
            '<button class="btn btn<%=iconType%>"><i class="icon-<%=iconType%>"></i></button>' +
        '</div>' +
      '</div>' +
      '<div class="contentContainer outer">' +
        '<div contenteditable="<%=editable%>" class="inner card-content">' + 
          '<%=cardContent%>' +
        '</div>' + 
      '</div>' +
      '<div class="actions outer">' +
        '<div class="inner">' +
     	'</div>' +
      '</div>';

  var attributeTemplate = 
      '<div id="<%=attrId%>" class="attrDiv">' +
        '<div class="pull-left">' +
            '<h5 class="attrTitle" contenteditable="<%=editable%>">' + 
                '<%=attrTitle%>' +
            '</h5>' +
        '</div>' +
        '<div class="">' +
            '<input type="text" class="ratingBox">' +
        '</div>' + 
        '<br><br>' + 
        '<div class="progress active" style="max-width:<%=attrValue[1]%>"%>' +
            '<div class="bar bar-success" data-percentage="<%=attrValue[1]%>"></div>' +  
        '</div>' +
      '</div>';

  var commentTemplate = 
      '<div class="commentDiv">' +
        '<p class="commentStyle">' + 
            '<%=comment%>' + 
        '</p>' + 
      '</div>';

  var static_editUI = 
      '<div class="editUI">' +
        '<input class="url" />' + 
        '<button class="btn editUIBtn"> Set</button>' +
      '</div>';

  return {
    cardTemplate: cardTemplate,
    attributeTemplate: attributeTemplate,
    commentTemplate: commentTemplate,
    static_editUI: static_editUI
  };
})();

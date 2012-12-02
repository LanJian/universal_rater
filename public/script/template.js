//'<!--Start of Build In Javascript Template-->'
var Template = (function() {
  var cardTemplate = 
    '<div id="<%=cardId%>" class="card-header">' +
        '<legend contenteditable="<%=editable%>" class="card-title">' +
        	'<%=cardTitle%>' +
        '</legend>' +
        '<div class="pull-right" style="margin-top:-4em; padding-right: 0.5em;">' +
            '<button class="btn"><i class="icon-<%=iconType%>"></i></button>' +
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
        '<h5>' + 
        	'<%=attrTitle%>' +
        '</h5>' +
        '<div class="progress active" style="max-width:90%;">' +
            '<% _.each(attrList, function(attr) { %>' +
                '<div class="bar bar-success" style="width: <%=attr[1]%> "> <%=attr[1]%> </div>' +  
            '<% }); %>' + 
        '</div>' +
      '</div>';

  var commentTemplate = 
      '<div class="commentDiv">' +
        '<p class="commentStyle">' + 
            '<%=comment%>' + 
        '</p>' + 
      '</div>';

  return {
    cardTemplate: cardTemplate,
    attributeTemplate: attributeTemplate,
    commentTemplate: commentTemplate
  };
})();

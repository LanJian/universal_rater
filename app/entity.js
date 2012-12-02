module.exports = (function (app) {
  var db = app.db;


  // ================================================================
  // Helpers
  // ================================================================
  var getEntity = function(req, res, next) {
    var key = 'entity:' + req.params.entityName;
    db.get(key, function(err, val) {
      if (err) return res.send('failed: ' + err);

      var entity = JSON.parse(val);
      req.entity = entity;
      next();
    });
  }

  var getAttr = function(req, res, next) {
    var entity = req.entity;

    var attrName = req.params.attrName;
    var attr = entity.attrs[attrName];
    console.log(attr);
    if (!attr)
      return res.send('failure: attr not found');

    req.attr = attr;
    next();
  }


  // ================================================================
  // Entities
  // ================================================================
  app.put('/entity/:entityName', function(req, res) {
    var key = 'entity:' + req.params.entityName;
    var hashes = [];
    if (req.query['hashes'])
      hashes = JSON.parse(req.query['hashes']);
    var entity = {
      name: req.params.entityName,
      hashes: hashes,
      attrs: {}
    }

    console.log(hashes);

    // process hashes

    db.set(key, JSON.stringify(entity), function(err, val) {
      if (err) return res.send('failed: ' + err);
      return res.send('success: ' + val);
    });
  });


  app.get('/entity/:entityName', getEntity, function(req, res) {
    if (req.entity)
      return res.send('success: ' + JSON.stringify(req.entity));
    return res.send('failed: to get entity');
  });


  // ================================================================
  // Entity attributes
  // ================================================================
  app.put('/entity/:entityName/attr/create', getEntity, function(req, res) {
    var entity = req.entity;
    if (!entity)
      return res.send('failed: to get entity');
    
    var name = req.query.name;
    if (entity.attrs[name])
      return res.send('failed: already exists');

    entity.attrs[name] = [0, 0];

    var key = 'entity:' + req.params.entityName;
    db.set(key, JSON.stringify(entity), function(err, val) {
      if (err) return res.send('failed: ' + err);
      return res.send('success: ' + val);
    });
  });


  app.put('/entity/:entityName/attr/:attrName/edit', getEntity, function(req, res) {
    var entity = req.entity;
    var votes = parseInt(req.query.votes);
    var rating = parseInt(req.query.rating);

    var attrName = req.params.attrName;
    var attr = entity.attrs[attrName];
    console.log(attr);
    if (!attr)
      return res.send('failure: attr not found');

    var newData = [votes, rating];
    entity.attrs[attrName] = newData;

    var key = 'entity:' + req.params.entityName;
    db.set(key, JSON.stringify(entity), function(err, val) {
      if (err) return res.send('failed: ' + err);
      return res.send('success: ' + val);
    });
  });


  // ================================================================
  // Comments
  // ================================================================
  app.post('/entity/:entityName/attr/:attrName/comment', getEntity, getAttr, function(req, res) {
    var entityName = req.params.entityName;
    var attrName = req.params.attrName;

    var entity = req.entity;
    var attr = req.attr;

    var key = 'comment:' + entityName + ':' + attrName;
    console.log(req.get('content-type'));
    var time = Date.now();
    var comment = {};
    if (!req.body.author || !req.body.comment)
      return res.send('failed: malformed data for comment');
    comment.author = req.body.author;
    comment.comment = req.body.comment;
    comment.timeStamp = time;
    db.zadd(key, Date.now(), JSON.stringify(comment), function(err, val) {
      if (err) return res.send('failed: ' + err);
      return res.send('success: ' + val);
    });
  });


  app.get('/entity/:entityName/attr/:attrName/comments', getEntity, getAttr, function(req, res) {
    var entityName = req.params.entityName;
    var attrName = req.params.attrName;

    var entity = req.entity;
    var attr = req.attr;

    var key = 'comment:' + entityName + ':' + attrName;
    db.zrangebyscore(key, -Infinity, Infinity, function(err, val) {
      if (err) return res.send('failed: ' + err);
      return res.send('success: ' + val);
    });
  });

});
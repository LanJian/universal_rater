module.exports = (function (app) {
  var db = app.db;


  // ================================================================
  // Helpers
  // ================================================================
  var getEntity = function(req, res, next) {
    var key = 'entity:' + req.params.entityName;
    db.get(key, function(err, val) {
      if (err) return res.send(500, {error: err});

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
      return res.send(404, {error: 'attr not found'});

    req.attr = attr;
    next();
  }


  var paramsToLowerCase = function(req, res, next) {
    if (req.params.entityName)
      req.params.entityName = req.params.entityName.toLowerCase();
    console.log(req.params.entityName);
    //if (req.params.attrName)
      //req.params.attrName = req.params.attrName.toLowerCase();
    next();
  }


  //app.use(paramsToLowerCase);


  // ================================================================
  // Entities
  // ================================================================
  app.put('/entity/:entityName', paramsToLowerCase, function(req, res) {
    var key = 'entity:' + req.params.entityName;
    console.log(key);
    var hashes = [];
    if (req.query['hashes'])
      hashes = JSON.parse(req.query['hashes']);
    var entity = {
      name: req.query.name,
      imgUrl: req.query.imgUrl,
      description: req.query.description,
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


  app.post('/entity/:entityName/edit', paramsToLowerCase, getEntity, function(req, res) {
    var entity = req.entity;

    if (req.query.name)
      entity.name = req.query.name;
    if (req.query.imgUrl)
      entity.imgUrl = req.query.imgUrl;
    if (req.query.description)
      entity.description = req.query.description;
    if (req.query.hashes)
      entity.hashes = JSON.pars(req.query.hashes);

    var key = 'entity:' + req.params.entityName;
    db.set(key, JSON.stringify(entity), function(err, val) {
      if (err) return res.send('failed: ' + err);
      return res.send('success: ' + val);
    });
  });


  app.get('/entity/:entityName', paramsToLowerCase, getEntity, function(req, res) {
    if (req.entity)
      return res.send(200, req.entity);
    return res.send(404, {error: 'entity not found'});
  });


  // ================================================================
  // Entity attributes
  // ================================================================
  app.post('/entity/:entityName/attr/create', paramsToLowerCase, getEntity, function(req, res) {
    var entity = req.entity;
    if (!entity)
      return res.send('failed: to get entity');
    
    var name = req.query.name;
    if (entity.attrs[name])
      return res.send('failed: already exists');

    entity.attrs[name] = [0, 50];

    var key = 'entity:' + req.params.entityName;
    db.set(key, JSON.stringify(entity), function(err, val) {
      if (err) return res.send('failed: ' + err);
      return res.send('success: ' + val);
    });
  });


  app.put('/entity/:entityName/attr/:attrName/edit', paramsToLowerCase, getEntity, function(req, res) {
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


  app.put('/entity/:entityName/attr/:attrName/rating', paramsToLowerCase, getEntity, getAttr, function(req, res) {
    var entityName = req.params.entityName;
    var attrName = req.params.attrName;
    var rating = parseFloat(req.query.rating);

    var entity = req.entity;
    var attr = req.attr;
    console.log(attr);

    var votes = attr[0];
    var avgRating = attr[1];

    var newVotes = votes + 1;
    var newRating = (avgRating*votes + rating) / newVotes;
    var newAttr = [newVotes, newRating];

    entity.attrs[attrName] = newAttr;
    console.log(entity);
    var key = 'entity:' + entityName;
    db.set(key, JSON.stringify(entity), function(err, val) {
      if (err) return res.send('failed: ' + err);
      return res.send('success: ' + val);
    });
  });


  // ================================================================
  // Comments
  // ================================================================
  app.post('/entity/:entityName/attr/:attrName/comment', paramsToLowerCase, getEntity, getAttr, function(req, res) {
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


  app.get('/entity/:entityName/attr/:attrName/comments', paramsToLowerCase, getEntity, getAttr, function(req, res) {
    var entityName = req.params.entityName;
    var attrName = req.params.attrName;

    var entity = req.entity;
    var attr = req.attr;

    var key = 'comment:' + entityName + ':' + attrName;
    db.zrangebyscore(key, -Infinity, Infinity, function(err, val) {
      if (err) return res.send('failed: ' + err);
      var ret = [];
      for (var i=0; i<val.length; i++) {
        ret.push(JSON.parse(val[i]));
      }
      console.log(ret);
      return res.send(ret);
    });
  });

});

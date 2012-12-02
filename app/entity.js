
module.exports = (function (app) {
  var db = app.db;

  var getEntity = function(req, res, next) {
    var key = 'entity:' + req.params.entityName;
    db.get(key, function(err, val) {
      if (err) return res.send('failed: ' + err);

      var entity = JSON.parse(val);
      req.entity = entity;
      next();
    });
  }


  app.put('/entity/create', function(req, res) {
    var key = 'entity:' + req.query['name'];
    var entity = {
      hashes: [],
      attrs: {}
    }

    db.set(key, JSON.stringify(entity), function(err, val) {
      if (err) return res.send('failed: ' + err);
      return res.send('success: ' + val);
    });
  });


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


  app.get('/entity/:entityName', getEntity, function(req, res) {
    if (req.entity)
      return res.send('success: ' + JSON.stringify(req.entity.attrs));
    return res.send('failed: to get entity');
  });


});

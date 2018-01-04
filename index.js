/**
 *
 *
 */

const loadAll = function loadAllDocumentsFromCollection(params, cb){
  if(!params.filter) params.filter = {};
  if(!params.options) params.options = {page:1, limit:10};
  if(!params.options.sort) params.options.sort = 'title';
  this.paginate(params.filter, params.options, (err, result)=>{
    return cb(err, result);
  });
}

//const rICallback


module.exports = function(schema) {
  schema.statics.loadAll = loadAll
}

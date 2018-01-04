/**
 *
 *
 */
let _ = require('lodash');

const loadAll = function loadAllDocumentsFromCollection(params, cb){
  if(!params.filter) params.filter = {};
  if(!params.options) params.options = {page:1, limit:10};
  if(!params.options.sort) params.options.sort = 'title';
  this.paginate(params.filter, params.options, (err, result)=>{
    return cb(err, result);
  });
}

const load = function loadOneDocumentFromCollection(params, cb){
  if(!params && _.isEmpty(params)) return cb(true); 
  this.findOne(params.query, params.fields, (err, person)=>{
    return cb(err, person);
  });  
}

const deleteOne = function deleteOneDocumentFromCollection(params, cb){
  this.remove(params.query, (err)=>{
    return cb(err);
  });
}

//const rICallback


module.exports = function(schema) {
  schema.statics.load = load,
  schema.statics.loadAll = loadAll,
  schema.statics.deleteOne = deleteOne 
}

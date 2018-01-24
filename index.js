let _ = require('lodash');

/**
 * loadAll 
 * @constructor
 * @param {Object} params - Structure of filters
 * @param {callback} cb - The callback that handle the response 
 * @return {callback}  err and Documents
 */
const loadAll = function loadAllDocumentsFromCollection(params, cb){
  if(!params.filter) params.filter = {};
  if(!params.options) params.options = {page:1, limit:10};
  if(!params.options.sort) params.options.sort = 'name';
  this.paginate(params.filter, params.options, (err, documents)=>{
    return cb(err, documents);
  });
}

/**
 * load 
 * @constructor
 * @param {Object} params - query and fileds, if no fields return all
 * @param {callback} cb - The callback that handle the response 
 * @return {callback}  err and Document
 */
const load = function loadOneDocumentFromCollection(params, cb){
  if(!params && _.isEmpty(params)) return cb(true); 
  this.findOne(params.query, params.fields, (err, documentToReturn)=>{
    return cb(err, documentToReturn);
  });  
}

/**
 * deletOne
 * @constructor
 * @param {Object} params - query 
 * @param {callback} cb - The callback that handle the response 
 * @return {callback}  err 
 */
const deleteOne = function deleteOneDocumentFromCollection(params, cb){
  this.remove(params.query, (err)=>{
    return cb(err);
  });
}


/**
 * preEdit
 * @constructor
 * @param {boolean} IsNew - Is it a new Document?
 * @param {callback} cb - The callback that handle the response 
 * @return {callback}  err 
 */
const preEdit = function dynamicallyEditsDocument(data, cb){
  this.lastEdit.date = new Date().getTime();
  let ignore = '__v roles permissions _id createdAt _v collectionName isEnable ';
  let schemaKeys = Object.keys(this.schema.tree);
  let dataKeys = Object.keys(data);
  let flag = false;
  let newThis = this;
  let newValues ={};
  if(data.ignore) ignore += data.ignore;
  let newKeys = removeParams(schemaKeys, dataKeys, ignore);
  if(data.isNew === true) this.createdAt = this.lastEdit;
  setNewObject(data, newThis, newKeys, cb);
}

//---------preEdit functions-------------------------------------
const setNewObject = function(data, newThis, keys, cb){
  keys.forEach(function(element, k){
    if(data[element] !='undefined' && data[element] != null){
      //let typeOfSchemaValue = newThis.schema.path[element].instance.toLowerCase();
      //let typeOfDataValue = typeof data[element];
      newThis[element] = data[element];
    }
  });
  return cb();
}

const removeParams = function removeKeysFromTheIgnoreList(keys, bodyKeys, ignore ){
  let ignoreArray = ignore.split(' ');
  let newKeys = [];
  keys.forEach(function(element, k){
    let ignoreIndex = ignore.indexOf(element);
    let bodyIndex = bodyKeys.indexOf(element);
    if(ignoreIndex === -1 && bodyIndex != -1) newKeys.push(element);
  });
  return  newKeys;
}
//---------------------------------------------------------------
//---------------------------------------------------------------

const setEnabled = function enablesADocumentInTheCollection(cb){
  this.isEnable = !this.isEnable;
  this.save(cb);
}
/**
 * Exports model Base Statics
 * @module modelBaseStructure
 *
 */
module.exports = function(schema) {
  schema.statics.load = load,
  schema.statics.loadAll = loadAll,
  schema.methods.preEdit = preEdit,
  schema.methods.setEnabled = setEnabled,
  schema.statics.deleteOne = deleteOne 
}



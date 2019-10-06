'use strict';

const assert = require('assert');

class Sensors {

  constructor() {
	this.sensorType={nextId : 0,
			data : []
		}
	this.sensor={
			nextId : 0,
			data : []		
		}
	this.sensorData={
			data : []		
		}
   	//this.clean();
  }

  /** Clear out all data from this object. */
  async clear() {
    //todo
  }

 
  async addSensorType(info) {
	console.log("-----Inside AddSensortype------------");
   	const sensorType = validate('addSensorType', info);
	this.sensorType.data.push(sensorType);

	//console.log("index");
	//console.log(idex);
	//console.log("             ");
	console.log(sensorType);
	
	this.sensorType.data.forEach(function(element,idex,arr){
		//console.log("------For------");		
		//console.log(element);

		//console.log(this.sensorType.data[0]);
		
		//if(arr[0]===this.sensorType.data[id]){
		
		//code to print array with index
		//var itr1 = arr.entries();
		//console.log(itr1.next().value);

		//code to access whole array
		//console.log("array");
		//console.log(arr);

		

		//console.log("sensorType id");
		//console.log(sensorType.id);
		console.log("             ");
		
		//console.log(arr[idex].id);


		if(arr[idex].id===sensorType.id){		
			//arr[idex].id=sensorType;
			//console.log("yes");
		}

		else{
			//console.log("Id does Not exist");
		}
				
  	});
   }
  	
 
  async addSensor(info) {
	console.log("-----Inside AddSensor------------");
	const sensor = validate('addSensor', info);
	this.sensor.data.push(sensor);
	console.log(sensor);

	this.sensor.data.forEach(function(element,idex,arr){

		//console.log(arr[idex].id);


		if(arr[idex].id===sensor.id){		
			//arr[idex].id=sensorType;
			//console.log("yes");
		}

		else{
			//console.log("Id does Not exist");
		}
				
  	});
  }

 
  async addSensorData(info) {
	console.log("-----Inside AddSensorData------------");
    	const sensorData = validate('addSensorData', info);
    	this.sensorData.data.push(sensorData);
	console.log(sensorData);
  
	this.sensorData.data.forEach(function(element,idex,arr){

		//console.log(arr[idex].id);


		if(arr[idex].id===sensorData.id){		
			//arr[idex].id=sensorType;
			//console.log("yes");
		}

		else{
			//console.log("Id does Not exist");
		}
				
  	});
 }

  
  async findSensorTypes(info) {
    const searchSpecs = validate('findSensorTypes', info);
    return {};
  }
  

  async findSensors(info) {
    const searchSpecs = validate('findSensors', info);
    //@TODO
    return {};
  }
  
  
  async findSensorData(info) {
    const searchSpecs = validate('findSensorData', info);
    //@TODO
    return {};
  }
  
  
}

module.exports = Sensors;



const DEFAULT_COUNT = 5;    


function validate(fn, info) {
  const errors = [];
  const values = validateLow(fn, info, errors);
  if (errors.length > 0) throw errors; 
  return values;
}

function validateLow(fn, info, errors, name='') {
  const values = Object.assign({}, info);
  for (const [k, v] of Object.entries(FN_INFOS[fn])) {
    const validator = TYPE_VALIDATORS[v.type] || validateString;
    const xname = name ? `${name}.${k}` : k;
    const value = info[k];
    const isUndef = (
      value === undefined ||
      value === null ||
      String(value).trim() === ''
    );
    values[k] =
      (isUndef)
      ? getDefaultValue(xname, v, errors)
      : validator(xname, value, v, errors);
  }
  return values;
}

function getDefaultValue(name, spec, errors) {
  if (spec.default !== undefined) {
    return spec.default;
  }
  else {
    errors.push(`missing value for ${name}`);
    return;
  }
}

function validateString(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  if (typeof value !== 'string') {
    errors.push(`require type String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
    return;
  }
  else {
    return value;
  }
}

function validateNumber(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  switch (typeof value) {
  case 'number':
    return value;
  case 'string':
    if (value.match(/^[-+]?\d+(\.\d+)?([eE][-+]?\d+)?$/)) {
      return Number(value);
    }
    else {
      errors.push(`value ${value} for ${name} is not a number`);
      return;
    }
  default:
    errors.push(`require type Number or String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
}

function validateInteger(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  switch (typeof value) {
  case 'number':
    if (Number.isInteger(value)) {
      return value;
    }
    else {
      errors.push(`value ${value} for ${name} is not an integer`);
      return;
    }
  case 'string':
    if (value.match(/^[-+]?\d+$/)) {
      return Number(value);
    }
    else {
      errors.push(`value ${value} for ${name} is not an integer`);
      return;
    }
  default:
    errors.push(`require type Number or String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
}

function validateRange(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  if (typeof value !== 'object') {
    errors.push(`require type Object for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
  return validateLow('_range', value, errors, name);
}

const STATUSES = new Set(['ok', 'error', 'outOfRange']);

function validateStatuses(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  if (typeof value !== 'string') {
    errors.push(`require type String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
  if (value === 'all') return STATUSES;
  const statuses = value.split('|');
  const badStatuses = statuses.filter(s => !STATUSES.has(s));
  if (badStatuses.length > 0) {
    errors.push(`invalid status ${badStatuses} in status ${value}`);
  }
  return new Set(statuses);
}

const TYPE_VALIDATORS = {
  'integer': validateInteger,
  'number': validateNumber,
  'range': validateRange,
  'statuses': validateStatuses,
};


/** Documents the info properties for different commands.
 *  Each property is documented by an object with the
 *  following properties:
 *     type: the type of the property.  Defaults to string.
 *     default: default value for the property.  If not
 *              specified, then the property is required.
 */
const FN_INFOS = {
  addSensorType: {
    id: { }, 
    manufacturer: { }, 
    modelNumber: { }, 
    quantity: { }, 
    unit: { },
    limits: { type: 'range', },
  },
  addSensor:   {
    id: { },
    model: { },
    period: { type: 'integer' },
    expected: { type: 'range' },
  },
  addSensorData: {
    sensorId: { },
    timestamp: { type: 'integer' },
    value: { type: 'number' },
  },
  findSensorTypes: {
    id: { default: null },  //if specified, only matching sensorType returned.
    index: {  //starting index of first result in underlying collection
      type: 'integer',
      default: 0,
    },
    count: {  //max # of results
      type: 'integer',
      default: DEFAULT_COUNT,
    },
  },
  findSensors: {
    id: { default: null }, //if specified, only matching sensor returned.
    index: {  //starting index of first result in underlying collection
      type: 'integer',
      default: 0,
    },
    count: {  //max # of results
      type: 'integer',
      default: DEFAULT_COUNT,
    },
    doDetail: { //if truthy string, then sensorType property also returned
      default: null, 
    },
  },
  findSensorData: {
    sensorId: { },
    timestamp: {
      type: 'integer',
      default: Date.now() + 999999999, //some future date
    },
    count: {  //max # of results
      type: 'integer',
      default: DEFAULT_COUNT,
    },
    statuses: { //ok, error or outOfRange, combined using '|'; returned as Set
      type: 'statuses',
      default: new Set(['ok']),
    },
    doDetail: {     //if truthy string, then sensor and sensorType properties
      default: null,//also returned
    },
  },
  _range: { //pseudo-command; used internally for validating ranges
    min: { type: 'number' },
    max: { type: 'number' },
  },
};  


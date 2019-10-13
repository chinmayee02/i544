'use strict';

const AppError = require('./app-error');
const validate = require('./validate');

const assert = require('assert');
const mongo = require('mongodb').MongoClient;

class Sensors {

	constructor(client, db) {
	    this.client = client;
	    this.db = db;
  	}

  static async newSensors(mongoDbUrl) {
	const url = 'mongodb://127.0.0.1:27017';
	const dbName = 'sensors';
   	const client = await mongo.connect(url,	{useUnifiedTopology: true,useNewUrlParser: true});
    	const db = client.db(dbName);
    return new Sensors(client,db);    
  }

  async close() {
	await this.client.close();
    //@TODO
  }

  /** Clear database */
  async clear() {
    	await this.db.collection('sensorType').remove();
	await this.db.collection('sensor').remove();
	await this.db.collection('sensorData').remove();
  }

  async addSensorType(info) {
    const sensorType = validate('addSensorType', info);
	//console.log(sensorType.id);
	
	//const dbUsers = await toDbUsers(sensorType);
	const dbTable = this.db.collection('sensorType');	
    
      	try {
		const ret = await dbTable.replaceOne({_id : sensorType.id},sensorType,{upsert : true});
		console.log(sensorType);
		
      	}
      	catch (err) {
		
	  //const err = `no model ${model} sensor type`;
          throw [ new AppError('X_ID', 'Invalid  sensor Type') ];
 
		//throw err;
      }
    
}
  async addSensor(info) {
    const sensor = validate('addSensor', info);
    const sensorDoc = this.db.collection('sensor');
	//console.log(sensor.model);

	const sensorFind = await this.db.collection('sensorType').findOne({_id : sensor.model});
	//console.log(sensorFind);	

	if(sensorFind){
	try {
		const retSensor = await sensorDoc.replaceOne({id : sensor.id},sensor,{upsert : true});
		console.log(sensor);
		
      	}
      	catch (err) {
		
		throw [ new AppError('X_ID', 'Invalid  Sensor') ];;
        }
	
	}

	else{
		//console.log("Invalid sensor Type");
		const err = `Error in adding Sensor Data`;
          	throw [ new AppError('X_ID', err) ];
	}	
	//console.log(sensorFind);

  }

  async addSensorData(info) {
    const sensorData = validate('addSensorData', info);
	//console.log(sensorData.sensorId);
    const dataDoc = this.db.collection('sensorData');
	
	//const sensorFind = await this.db.collection('sensorType').findOne({_id : sensor.model});
	const sensordataFind = await this.db.collection('sensor').findOne({id : sensorData.sensorId});
	
	if(sensordataFind != null){
	try {
		const retSensordata = await dataDoc.replaceOne({id : sensorData.id},sensorData,{upsert : true});
		console.log(sensorData);
		
      	}
      	catch (err) {
		
		throw [ new AppError('X_ID', 'Invalid Sensor Data ') ];
        }

	}

	else{
		//console.log("Invalid sensor Id");
		const err = `Error in adding Sensor Data`;
          	throw [ new AppError('X_ID', err) ];
	}	
    
  }


  async findSensorTypes(info) {
    
    const searchSpecs = validate('findSensorTypes', info);
	console.log(searchSpecs);

	const table1 = this.db.collection('sensorType');
	//const find1 = await table1.find()({_id : searchSpecs.id}).toArray();
	const find1 = await table1.find().toArray();

	const result = findInCollection(find1,searchSpecs,'sensor-type');
    return { data: result.data, nextIndex: result.nextIndex };
  }
  
 
  async findSensors(info) {
    //@TODO
    const searchSpecs = validate('findSensors', info);

	const table3 = this.db.collection('sensor');
	//const find1 = await table1.find()({_id : searchSpecs.id}).toArray();
	const find3 = await table3.find().toArray();
	
	const result = findInCollection(find3,searchSpecs,'sensor');
	//console.log(result);
	if (searchSpecs.doDetail) {
      for (const sensor of data) {
	sensor.sensorType = this.sensorTypes[sensor.model];
      }
    }

    return { data: result.data, nextIndex: result.nextIndex };

  }
  
 

  async findSensorData(info) {
    //@TODO
    const searchSpecs = validate('findSensorData', info);
	//console.log(searchSpecs.sensorId);

	const table2 = this.db.collection('sensorData');
	
	const find2 = await table2.find().toArray();
	//console.log(find2);	

	//const { sensorId, timestamp, count, statuses } = searchSpecs;
    	//const sensor = this.sensors[sensorId];

    return { find2: find2, nextIndex: -1 };
    
  }

} //class Sensors

module.exports = Sensors.newSensors;


const DEFAULT_COUNT = 5;    

function findInCollection(collection, searchSpecs, name) {
  const data = [];
	//console.log(collection);
  let nextIndex = -1;
  if (searchSpecs.id) {
    const value = collection[searchSpecs.id];
    if (value) {
      data.push(value);
    }
    else {
      throw [ `cannot find ${name} for id "${searchSpecs.id}"` ];
    }
  }
  else {
    const ids = Object.keys(collection);
    ids.sort();
    const {_index, _count} = searchSpecs;
    let i = (_index < 0) ? 0 : _index;
    nextData:
    for (i = i; i < ids.length && data.length < _count; i++) {
      const d = collection[ids[i]];
      for (var k of Object.keys(d)) {
	//console.log('K is ' + k);
	const s = searchSpecs[k];
	if (s !== undefined && s !== null && String(d[k]) !== s) {
	  continue nextData;
	}
      }
      data.push(d);
    }
    nextIndex = (i < ids.length) ? i : -1;
  }
  return { data, nextIndex };
}







//Options for creating a mongo client
const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};


function inRange(value, range) {
  return Number(range.min) <= value && value <= Number(range.max);
}

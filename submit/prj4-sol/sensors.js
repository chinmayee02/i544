'use strict';

const assert = require('assert');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const querystring = require('querystring');

const mustache = require('mustache');
const widgetView = require('./widget-view');

const STATIC_DIR = 'statics';
const TEMPLATES_DIR = 'templates';

function serve(port, model, base='') {
  //@TODO
  
  const app = express();
  app.locals.port = port;
  app.locals.base = base;
  app.locals.model = model;
  process.chdir(__dirname);
  app.use(base, express.static(STATIC_DIR));
  setupTemplates(app);
  setupRoutes(app);
  app.listen(port, function() {
    console.log(`listening on port ${port}`);
  });


}


module.exports = serve;

//@TODO

/************************** Routes ****************************/

function setupRoutes(app) {

	const base = app.locals.base;
	/****Add Sensor Type****/
	app.get(`/tst-sensor-types-add.html`, addSensorTypeForm(app));
	app.post(`/tst-sensor-types-add.html`, bodyParser.urlencoded({extended: false}),addSensorTypeUpdateUser(app));
	app.get(`/tst-sensor-types-search.html`, doSearchSenType(app));


	/****Add Sensor****/
	app.get(`/tst-sensors-add.html`, addSensorsForm(app));
	app.post(`/tst-sensors-add.html`, bodyParser.urlencoded({extended: false}),addSensorsUpdateUser(app));
	app.get(`/tst-sensors-search.html`, doSearchSen(app));

	//app.get(`${base}/tst-sensor-types-search.html`, updateUserForm(app));
	
	//app.get(`${base}/search.html`, doSearch(app));

	//app.get('/',homeRoute(app));
}


/************************** Field Definitions **************************/

const FIELDS_INFO = {
  id: {
    friendlyName: 'Sensor Type Id',
    isSearch: true,
    //isId: true,
    isSensorType : true,
    isRequired: true,
    regex: /^\w+$/,
    error: 'User Id field can only contain alphanumerics or _',
  },
  manufacturer: {
    friendlyName: 'Manufacturer',
    isSearch: true,
    //isId: true,
    isSensorType : true,
    isRequired: true,
    regex: /^\w+$/,
    error: "User Id field can only contain alphanumerics or _",
  },
  modelNumber: {
    friendlyName: 'Model Number',
    isSearch: true,
    //isId: true,
    isSensorType : true,
    isRequired: true,
    regex: /^\w+$/,
    error: 'User Id field can only contain alphanumerics or _',
  },
 quantity : {
	friendlyName: 'Quantity',
        isSearch: true,
    //isId: true,
	isSensorType : true,
	select: true,
    isRequired: true,
 },
 limits : {
 	
   	friendlyName: 'Limits',
    	//isSearch: true,
    	//isId: true,
	isSensorType : true,
	limit : true,
    	isRequired: true,
 },

 //Sensor Fields
 id1: {
    friendlyName: 'Sensor Id',
    isSearchSen: true,
    //isId: true,
    isSensor : true,
    isRequiredSen: true,
    regex: /^\w+$/,
    error: 'User Id field can only contain alphanumerics or _',
  },
  model: {
    friendlyName: 'Model',
    isSearchSen: true,
    //isId: true,
    isSensor : true,
    isRequiredSen: true,
    regex: /^\w+$/,
    error: 'User Id field can only contain alphanumerics or _',
  },
  period: {
    friendlyName: 'Period',
    isSearchSen: true,
    //isId: true,
    isSensor : true,
    isRequiredSen: true,
  },
  expected : {
   	friendlyName: 'Expected',
    	//isSearch: true,
    	//isId: true,
	isSensor : true,
	expected : true,
    	isRequiredSen: true,
 },
};

const FIELDS =
  Object.keys(FIELDS_INFO).map((n) => Object.assign({name: n}, FIELDS_INFO[n]));



/*************************** Action Routines ***************************/

function updateUserForm(app) {
  return async function(req, res) {
    let user = getNonEmptyValues(req.query);
    let errors = validate(user, ['id']);
    if (!errors) {
      try {
	const users = await app.locals.model.get(user.id);
	user = users[0];
      }
      catch (err) {
	console.error(err);
	errors = wsErrors(err);
      }
    }
    const model = errorModel(app, user, errors);
    const html = doMustache(app, 'update', model);
    res.send(html);
  };
};



function addSensorTypeForm(app) {
  return async function(req, res) {
    const model = { base: app.locals.base, fields: FIELDS };
    const html = doMustache(app, 'createSenType', model);
    res.send(html);
  };
};

function addSensorTypeUpdateUser(app) {
  return async function(req, res) {
    const user = getNonEmptyValues(req.body);
    let errors = validate(user, ['id']);
    const isUpdate = req.body.submit === 'update';
    if (!errors) {
      try {
	if (isUpdate) {
	  await app.locals.model.update('sensor-types', user);
	}
	else {
	  await app.locals.model.create('sensor-types', user);
	}
	res.redirect(`/tst-sensor-types-search.html`);		//From add sensor type redirect tosearch sesor type
      }
      catch (err) {
	console.error(err);
	errors = wsErrors(err);
      }
    }
    if (errors) {
      const model = errorModel(app, user, errors);
      const html = doMustache(app, 'search', model);
      res.send(html);
    }
  };
};

function doSearchSenType(app) {
  return async function(req, res) {
    const isSubmit = req.query.submit !== undefined;
    let users = [];
    let errors = undefined;
    const search = getNonEmptyValues(req.query);
    //if (isSubmit) {
      errors = validate(search);
      if (Object.keys(search).length == 0) {
	const msg = 'at least one search parameter must be specified';
	errors = Object.assign(errors || {}, { _: msg });
      }
      //if (!errors) {
	const q = querystring.stringify(search);
	try {
	  users = await app.locals.model.list('sensor-types',search);
	}
	catch (err) {
          console.error(err);
	  errors = wsErrors(err);
	}
	if (users.length === 0) {
	  errors = {_: 'no users found for specified criteria; please retry'};
	}
      //}
    //}
    let model, template;
    
      const fields1 =
	users.data.map((u) => ({id: u.id, fields: fieldsWithValues(u)}));
      model = { base: app.locals.base, users: fields1,fields: FIELDS };
    
   
      //template =  'search';
      //model = errorModel(app, search, errors);
    
    const html = doMustache(app, 'search', model);
    res.send(html);
  };
};



		//Add sensor
function addSensorsForm(app) {
  return async function(req, res) {
    const model = { base: app.locals.base, fields: FIELDS };
    const html = doMustache(app, 'createSensors', model);
    res.send(html);
  };
};

function addSensorsUpdateUser(app) {
  return async function(req, res) {
    const user = getNonEmptyValues(req.body);
    let errors = validate(user, ['id1']);
    const isUpdate = req.body.submit === 'update';
    if (!errors) {
      try {
	if (isUpdate) {
	  await app.locals.model.update('sensors', user);
	}
	else {
	  await app.locals.model.create('sensors', user);
	}
	res.redirect(`${app.locals.base}/tst-sensors-search.html`);		//From add sensor type redirect tosearch sesor type
      }
      catch (err) {
	console.error(err);
	errors = wsErrors(err);
      }
    }
    if (errors) {
      const model = errorModel(app, user, errors);
      const html = doMustache(app, 'search', model);
      res.send(html);
    }
  };
};


function doSearchSen(app) {
  return async function(req, res) {
    const isSubmit = req.query.submit !== undefined;
    let users = [];
    let errors = undefined;
    const search = getNonEmptyValues(req.query);
    //if (isSubmit) {
      errors = validate(search);
      if (Object.keys(search).length == 0) {
	const msg = 'at least one search parameter must be specified';
	errors = Object.assign(errors || {}, { _: msg });
      }
      //if (!errors) {
	const q = querystring.stringify(search);
	try {
	  users = await app.locals.model.list('sensors',search);
	}
	catch (err) {
          console.error(err);
	  errors = wsErrors(err);
	}
	if (users.length === 0) {
	  errors = {_: 'no users found for specified criteria; please retry'};
	}
      //}
    //}
    let model, template;
    
      const fields1 =
	users.data.map((u) => ({id: u.id, fields: fieldsWithValues(u)}));
      model = { base: app.locals.base, users: fields1,fields: FIELDS };
    
   
      //template =  'search';
      //model = errorModel(app, search, errors);
    
    const html = doMustache(app, 'searchSensor', model);
    res.send(html);
  };
};



/************************** Field Utilities ****************************/

/** Return copy of FIELDS with values and errors injected into it. */
function fieldsWithValues(values, errors={}) {
  return FIELDS.map(function (info) {
    const name = info.name;
    const extraInfo = { value: values[name] };
    if (errors[name]) extraInfo.errorMessage = errors[name];
    return Object.assign(extraInfo, info);
  });
}

/** Given map of field values and requires containing list of required
 *  fields, validate values.  Return errors hash or falsy if no errors.
 */
function validate(values, requires=[]) {
  const errors = {};
  requires.forEach(function (name) {
    if (values[name] === undefined) {
      errors[name] =
	`A value for '${FIELDS_INFO[name].friendlyName}' must be provided`;
    }
  });
  for (const name of Object.keys(values)) {
    const fieldInfo = FIELDS_INFO[name];
    const value = values[name];
    if (fieldInfo.regex && !value.match(fieldInfo.regex)) {
      errors[name] = fieldInfo.error;
    }
  }
  return Object.keys(errors).length > 0 && errors;
}

function getNonEmptyValues(values) {
  const out = {};
  Object.keys(values).forEach(function(k) {
    if (FIELDS_INFO[k] !== undefined) {
      const v = values[k];
      if (v && v.trim().length > 0) out[k] = v.trim();
    }
  });
  return out;
}

/** Return a model suitable for mixing into a template */
function errorModel(app, values={}, errors={}) {
  return {
    base: app.locals.base,
    errors: errors._,
    fields: fieldsWithValues(values, errors)
  };
}

/************************ General Utilities ****************************/

/** Decode an error thrown by web services into an errors hash
 *  with a _ key.
 */
function wsErrors(err) {
  const msg = (err.message) ? err.message : 'web service error';
  console.error(msg);
  return { _: [ msg ] };
}

function doMustache(app, templateId, view) {
  const templates = { footer: app.templates.footer };
  return mustache.render(app.templates[templateId], view, templates);
}

function errorPage(app, errors, res) {
  if (!Array.isArray(errors)) errors = [ errors ];
  const html = doMustache(app, 'errors', { errors: errors });
  res.send(html);
}

function isNonEmpty(v) {
  return (v !== undefined) && v.trim().length > 0;
}

function setupTemplates(app) {
  app.templates = {};
  for (let fname of fs.readdirSync(TEMPLATES_DIR)) {
    const m = fname.match(/^([\w\-]+)\.ms$/);
    if (!m) continue;
    try {
      app.templates[m[1]] =
	String(fs.readFileSync(`${TEMPLATES_DIR}/${fname}`));
    }
    catch (e) {
      console.error(`cannot read ${fname}: ${e}`);
      process.exit(1);
    }
  }
}



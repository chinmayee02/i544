<!DOCTYPE html>
<html>
  <head>
    <title>Create a User</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
  </head>
  <body>
    <h1>Create / Update Sensor Types</h1>
    <ul>
      {{#errors}}
        <li class="error">{{.}}</li>
      {{/errors}}
    </ul>
    <form method="POST" action="{{{base}}}/tst-sensor-types-add.html">
	{{#fields}}
	{{#isSensorType}}
	    <label>
	    <span class="label">
	      {{#isRequired}} {{/isRequired}}{{friendlyName}}*:
	    </span>
	
	{{#select}} <select name="quantity"
     id="quantity" class="tst-quantity">
      <option value="" selected>
        Select
      </option>
      <option value="temperature">
        Temperature
      </option>
      <option value="pressure">
        Pressure
      </option>
      <option value="flow">
        Flow Rate
      </option>
      <option value="humidity">
        Relative Humidity
      </option>
  </select>{{/select}}
{{^select}}
	{{#limit}}
		<div id="limits" class="numeric interval">
 		   <label for="limits-min">Min</label>
 	       <div><input name="limits[min]" id="limits-min" value=""
           		class="tst-limits-min numeric"></div>
    		<label for="limits-max">Max</label>
    		<div><input name="limits[max]" id="limits-max" value=""
           		class="tst-limits-max numeric"></div>
  		</div>
	{{/limit}}

	{{^limit}}
	    <input name="{{name}}" {{#type}}type="{{type}}"{{/type}}
	           value="{{value}}">
	{{/limit}}
{{/select}}
{{/isSensorType}}
	    </label>
	    <br/>
	    {{#errorMessage}}
	      <span class="error">{{errorMessage}}</span><br/>
	    {{/errorMessage}}
	 {{/fields}}
      <input name="submit" type="submit" value="Submit" class="control">
    </form> 
	{{#users}}
    <p>
      <strong>{{id}}</strong>: {{firstName}} {{lastName}}
      <a href="{{id}}.html">details</a>
    </p>
    {{/users}}
    {{>footer}}
  </body>
</html>

<!DOCTYPE html>
<html>
  <head>
    <title>Create a User</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
  </head>
  <body>
    <h1>Create / Update Sensor </h1>
    <ul>
      {{#errors}}
        <li class="error">{{.}}</li>
      {{/errors}}
    </ul>
    <form method="POST" action="{{{base}}}/tst-sensors-add.html">
	{{#fields}}
	{{#isSensor}}
	    <label>
	    <span class="label">
	      {{#isRequiredSen}} {{/isRequiredSen}}{{friendlyName}}*:
	    </span>
	
	
	{{#expected}}
		<div id="expected" class="numeric interval">
    		<label for="expected-min">Min</label>
    		<div><input name="expected[min]" id="expected-min" value=""
           		class="tst-expected-min numeric"></div>
    		<label for="expected-max">Max</label>
    		<div><input name="expected[max]" id="expected-max" value=""
           		class="tst-expected-max numeric"></div>
  		</div>
	{{/expected}}

	{{^expected}}
	    <input name="{{name}}" {{#type}}type="{{type}}"{{/type}}
	           value="{{value}}">
	{{/expected}}
{{/isSensor}}
	    </label>
	    <br/>
	    {{#errorMessage}}
	      <span class="error">{{errorMessage}}</span><br/>
	    {{/errorMessage}}
	 {{/fields}}
      <input name="submit" type="submit" value="create" class="control">
    </form> 
    {{>footer}}
  </body>
</html>

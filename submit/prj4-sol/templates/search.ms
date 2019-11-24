<!DOCTYPE html>
<html>
  <head>
    <title>User Search</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
  </head>
  <body>
    <h1>Search Sensor Type</h1>
    <ul>
      {{#errors}}
        <li class="error">{{.}}</li>
      {{/errors}}
    </ul>
    <form method="GET" action="{{{base}}}/tst-sensor-types-search.html">
       
	{{#fields}}
	  {{#isSearch}}
	    <label>
	    <span class="label">{{friendlyName}}:</span>
	    <input name="{{name}}" {{#type}}type="{{type}}"{{/type}}
	           value="{{value}}">
	    </label>
	    <br/>
	    {{#errorMessage}}
	      <span class="error">{{errorMessage}}</span><br/>
	    {{/errorMessage}}
	  {{/isSearch}}
	 {{/fields}}
      <input name="submit" type="submit" value="search" class="control">
    </form> 
	<h2>Results Summary</h2>

    <table class="summary">
        <thead>
    	   <tr>
                  <th>Manufacturer</th>
                  <th>Sensor Type ID</th>
                  <th>Model Number</th>
                  <th>Measure</th>
                  <th colspan="2">Limits</th>
    	   </tr>
    	   <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>Min</th>
                  <th>Max</th>
    	   </tr>
         </thead>
         <tbody>
           {{#users}}
		<tr>
		{{#fields}}
		{{#value}}    
		<td>
		{{value}}
		</td>
		{{/value}}
		{{/fields}}
		</tr>
		{{/users}}
	</tbody>
	</table>
	
	<div class="scroll">
    <a class="tst-next" href="?_index&#x3D;5" rel="next">&gt;&gt;</a>
    </div>

    {{>footer}}
  </body>
</html>

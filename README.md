karma-timemap
=============

<p>Visualization for spatio-temporal data. It integrates the <a href="https://code.google.com/p/timemap/">TimeMap</a> with Karma using visualization ontology.</p>
<p>This allows user to just model the data using GML and visualization ontology and get the visualization of the spacio temporal data</p>
<p>Steps to integrate the code with Karma repository:</p>
 - Copy JS files to "Web-Karma\karma-web\src\main\webapp\js" folder
 - Copy CSS files to "Web-Karma\karma-web\src\main\webapp\css" folder
 - Copy image files to "Web-Karma\karma-web\src\main\webapp\images" folder
 - Copy visualization ontology to your "preloaded-ontologies" folder
 - Replace index.jsp file at "Web-Karma\karma-web\src\main\webapp\"

</br>
<p>Steps to model Test data and visualize it:</p>
 - Start Karma using <code>mvn jetty:run</code>
 - Import data file, Polygon.csv
 - Model using gml and visualization ontology, model is shown in Polygon-Model.png
 - Publish RDF to Triple store in karma_data repository
 - Click on Google Earth icon
 
<p>Samples of using TimeMap are available <a href="http://timemap.googlecode.com/svn/tags/2.0.1/examples/index.html">here</a></p>

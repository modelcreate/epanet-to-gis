(this["webpackJsonpepanet-to-gis"]=this["webpackJsonpepanet-to-gis"]||[]).push([[0],{145:function(e,t){},147:function(e,t){},200:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),r=n(16),i=n.n(r),c=n(64),s=n.n(c),l=n(103),d=n(13),u=n(30),b=n(104),p=n.n(b),j=n(229),f=n(106),h=n(231),m=n(111),g=n(4),x=Object(j.a)((function(e){return{dropzone:function(e){return{flex:"1",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px",borderWidth:"2px",borderRadius:"2px",borderColor:e.borderColor,borderStyle:"dashed",textAlign:"center",backgroundColor:"#f5f5f5",color:"#5d5d5d",outline:"none",transition:"border .24s ease-in-out",minHeight:e.minHeight,fontSize:"20px",fontFamily:"'Montserrat','Roboto', 'Helvetica', 'Arial', sans-serif",fontWeight:700,lineHeight:1.2,letterSpacing:"-0.24px"}},dropContainer:{}}}));var O=function(e){var t=e.setEpanetInp,n=e.setModelFilename,a=Object(m.a)({maxFiles:1,multiple:!1,onDrop:function(e){var a=new FileReader;a.onabort=function(){return console.log("file reading was aborted")},a.onerror=function(){return console.log("file reading has failed")},a.onload=function(){var e=a.result;t(e)},a.readAsText(e[0]),n(e[0].name.replace(/\.[^/.]+$/,""))}}),o=a.isDragAccept,r=a.isDragActive,i=a.getRootProps,c=a.getInputProps,s=Object(f.a)(),l=Object(h.a)(s.breakpoints.up("md")),d=x({borderColor:r?o?"#2196f3":"#ff1744":"#eeeeee",minHeight:l?"450px":"200px"});return Object(g.jsx)("section",{className:d.dropContainer,children:Object(g.jsxs)("div",Object(u.a)(Object(u.a)({className:d.dropzone},i()),{},{children:[Object(g.jsx)("input",Object(u.a)({},c())),Object(g.jsx)("p",{children:"Drop an EPANET model here, or click to select a file"})]}))})},v=n(233),y=n(237),w=n(236),k=n(202),E=n(240),N=n(239),C=n(234),I=n(65),S=n.n(I),A=n(235),T=n(112),P=n(107),L=n.n(P),F=n(108),z=n.n(F),D=n(48);function B(e,t,n,a){var o=e.features.filter((function(e){return e.properties.category===t}));if(o.length>0){var r=o.map((function(e){return"POLYLINE"===n?[e.geometry.coordinates]:e.geometry.coordinates})),i=o.map((function(e){return e.properties}));L.a.write(i,n,r,function(e,t){return function(n,a){t.file(e+".shp",a.shp.buffer,{binary:!0}),t.file(e+".shx",a.shx.buffer,{binary:!0}),t.file(e+".dbf",a.dbf.buffer,{binary:!0})}}(t.toLowerCase(),a))}}var H=n(110);function J(){return new Worker(n.p+"static/js/runToGeoJson.worker.ada4edee.worker.js")}var G=Object(j.a)((function(e){return{root:{"& > *":{margin:e.spacing(1)}},modelName:{textAlign:"center"},loadingDataLabel:{paddingTop:"10px"},button:{margin:e.spacing(1)}}}));function M(e){return Object(g.jsx)(N.a,Object(u.a)({elevation:6,variant:"filled"},e))}var R=function(){var e=Object(a.useState)(void 0),t=Object(d.a)(e,2),n=t[0],r=t[1],i=Object(a.useState)(void 0),c=Object(d.a)(i,2),u=c[0],b=c[1],j=Object(a.useState)(""),f=Object(d.a)(j,2),h=f[0],m=f[1],x=Object(a.useState)(!1),N=Object(d.a)(x,2),I=N[0],P=N[1],L=o.a.useState(!1),F=Object(d.a)(L,2),R=F[0],W=F[1],Y=function(e,t){"clickaway"!==t&&W(!1)},_=G();Object(a.useEffect)((function(){(function(){var e=Object(l.a)(s.a.mark((function e(){var t,a,o;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!n){e.next=15;break}return P(!0),t=new J,a=H.a(t),e.prev=4,e.next=7,a(n);case 7:o=e.sent,b(o),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(4),W(!0);case 14:P(!1);case 15:case"end":return e.stop()}}),e,null,[[4,11]])})));return function(){return e.apply(this,arguments)}})()()}),[n]);var V=Object(a.useMemo)((function(){if(u){var e=Object(T.a)(u),t=Object(d.a)(e,4),n=t[0],a=t[1],o=t[2],r=t[3];return p()({viewportSize:{width:800,height:800},attributes:{style:"stroke:#000000; stroke-width:1px;","vector-effect":"non-scaling-stroke"},explode:!1,mapExtent:{left:n,right:o,bottom:a,top:r}}).convert(u)}}),[u]);return Object(g.jsxs)(v.a,{maxWidth:"md",children:[Object(g.jsx)(E.a,{open:R,autoHideDuration:6e3,onClose:Y,children:Object(g.jsx)(M,{onClose:Y,severity:"error",children:"There was an error loading the INP file"})}),Object(g.jsxs)(C.a,{spacing:3,container:!0,children:[Object(g.jsxs)(C.a,{item:!0,xs:12,children:[Object(g.jsx)(k.a,{variant:"h3",component:"h1",gutterBottom:!0,children:"EPANET to GIS"}),Object(g.jsx)(k.a,{variant:"body1",gutterBottom:!0,children:"Convert an EPANET hydraulic model to shapefiles or a GeoJSON file. Either drag an INP into the drop zone below or click the area to open a prompt to select the file. All geoprocessing is done locally and no data is sent to the server."}),Object(g.jsxs)(k.a,{variant:"body1",gutterBottom:!0,children:["This app is open-source and you can find the source code on GitHub, if you have any problems, please submit as an ",Object(g.jsx)(A.a,{href:"https://github.com/modelcreate/epanet-to-gis/issues",children:"issue on GitHub"}),". The app was created by ",Object(g.jsx)(A.a,{href:"https://www.linkedin.com/in/lukepbutler/",children:"Luke Butler"})," and uses epanet-js, a javascript conversion of the owa-epanet library, links to both projects are below."]}),Object(g.jsx)(w.a,{variant:"contained",color:"default",size:"small",className:_.button,startIcon:Object(g.jsx)(S.a,{}),href:"https://github.com/modelcreate/epanet-to-gis",children:"epanet-to-gis"}),Object(g.jsx)(w.a,{variant:"contained",color:"default",size:"small",className:_.button,startIcon:Object(g.jsx)(S.a,{}),href:"https://github.com/modelcreate/epanet-js",children:"epanet-js"})]}),Object(g.jsx)(C.a,{item:!0,xs:12,md:6,children:Object(g.jsx)(O,{setEpanetInp:r,setModelFilename:m})}),Object(g.jsxs)(C.a,{container:!0,xs:12,md:6,justifyContent:"center",alignItems:"center",children:[I&&Object(g.jsxs)(C.a,{container:!0,direction:"column",justifyContent:"center",alignItems:"center",children:[Object(g.jsx)(y.a,{}),Object(g.jsx)(k.a,{variant:"caption",display:"block",className:_.loadingDataLabel,children:"Loading data..."})]}),u&&V&&!1===I&&Object(g.jsxs)(g.Fragment,{children:[Object(g.jsx)(k.a,{className:_.modelName,variant:"h5",component:"h2",gutterBottom:!0,children:h}),Object(g.jsxs)(C.a,{container:!0,justifyContent:"center",className:_.root,children:[Object(g.jsx)(w.a,{variant:"contained",size:"small",color:"primary",onClick:function(){!function(e,t){var n=new z.a;["Pipe","Valve","Pump"].forEach((function(t){B(e,t,"POLYLINE",n)})),["Junction","Tank","Reservior"].forEach((function(t){B(e,t,"POINT",n)})),n.generateAsync({type:"blob",compression:"DEFLATE"}).then((function(e){console.log(e),Object(D.saveAs)(e,"".concat(t,".zip"))}))}(u,h)},children:"Export as Shapefiles"}),Object(g.jsx)(w.a,{variant:"contained",size:"small",color:"primary",onClick:function(){!function(e,t){var n=new Blob([JSON.stringify(e)],{type:"text/plain;charset=utf-8"});Object(D.saveAs)(n,"".concat(t,".json"))}(u,h)},children:"Export as GeoJSON"})]}),Object(g.jsx)("div",{id:"mapArea",children:Object(g.jsx)("div",{dangerouslySetInnerHTML:{__html:'<svg id="map" xmlns="http://www.w3.org/2000/svg" width="100%" height="350" viewBox="0 0 800 800">'.concat(V,"</svg>")}})})]})]})]})]})},W=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,241)).then((function(t){var n=t.getCLS,a=t.getFID,o=t.getFCP,r=t.getLCP,i=t.getTTFB;n(e),a(e),o(e),r(e),i(e)}))},Y=n(238);i.a.render(Object(g.jsxs)(o.a.StrictMode,{children:[Object(g.jsx)(Y.a,{}),Object(g.jsx)(R,{})]}),document.getElementById("root")),W()}},[[200,1,2]]]);
//# sourceMappingURL=main.76180d3e.chunk.js.map
(this["webpackJsonpnew-app"]=this["webpackJsonpnew-app"]||[]).push([[0],{77:function(e,t,a){e.exports=a(90)},82:function(e,t,a){},89:function(e,t,a){},90:function(e,t,a){"use strict";a.r(t);var n=a(0),o=a.n(n),c=a(10),r=a.n(c),i=(a(82),a(26)),l=a(30),s=a.n(l),m=a(144),d=a(131),u=a(134),p=a(64),f=a.n(p),g=a(149),y=a(146),b=Object(d.a)((function(e){return{root:{display:"flex","background-color":"#fff",border:"1px solid #ccc","border-radius":5,"max-width":364,position:"relative","padding-right":4,height:42},menuButton:{margin:0,padding:7},verticalDivider:{display:"block",width:1,height:28,"margin-top":7,backgroundColor:"#ccc",content:""},searchInputContainer:{position:"absolute",left:48,"flex-grow":1},searchInput:{height:40,width:312,padding:1,margin:"0px 8px"}}}));function h(e){var t=b();return o.a.createElement("div",{className:t.root},o.a.createElement(u.a,{edge:"start",color:"inherit","aria-label":"menu",className:t.menuButton,onClick:e.onOpenSettingsPane},o.a.createElement(f.a,{style:{fontSize:"1.8rem"}})),o.a.createElement("span",{className:t.verticalDivider}),o.a.createElement(y.a,{id:"omnibox-search-input",freeSolo:!0,selectOnFocus:!0,handleHomeEndKeys:!0,disableClearable:!0,onChange:function(t){var a;(a=t.target.textContent)&&e.onSelectCompany(a)},options:e.companies?e.companies.map((function(e){return e.properties.company})):[],renderInput:function(e){return o.a.createElement(g.a,Object.assign({},e,{placeholder:"Search",className:t.searchInput,margin:"dense",variant:"outlined"}))}}))}var v=a(140),E=a(152),C=a(145),S=a(91),O={sf:{id:"sf",title:"Silicon Valley Energy Ecosystem, 2019",shortName:"San Francisco Bay Area",datasetId:"ck901ssdl1sxn2mmnj56s9ibm",center:[-121,36.5],flyTo:[-122.21,37.65]},chicago:{id:"chicago",title:"Chicago Energy Ecosystem",shortName:"Chicago",datasetId:"ckbz9iagz0jjv29qrzry2ogtj",center:[-88.5,41.1],flyTo:[-87.829,41.879]}},x=function(e){return{label:O[e].shortName,value:e}},j=Object(d.a)((function(e){return{container:{display:"flex","flex-direction":"row"},formControl:{margin:e.spacing(.5),minWidth:120,width:"100%","flex-direction":"row"},locationSelectorDropdown:{"flex-grow":1,"font-family":"Open Sans","font-size":"10pt"},divider:{height:22,width:2,content:""},goButton:{height:"100%"}}}));function N(e){var t=Object(n.useState)(x(e.selectedMapId)),a=Object(i.a)(t,2),c=a[0],r=a[1],l=j(),s=Object.keys(O).map(x);return o.a.createElement("div",{className:l.container},o.a.createElement(v.a,{variant:"outlined",className:l.formControl},o.a.createElement(C.a,{value:c.value,className:l.locationSelectorDropdown,onChange:function(e){return r(x(e.target.value))}},s.map((function(e,t){return o.a.createElement(E.a,{key:t,value:e.value},e.label)}))),o.a.createElement("div",{className:l.divider}),o.a.createElement(S.a,{color:"primary",variant:"contained",className:l.goButton,onClick:function(){return e.onSelectMap(c.value)}},"Go")))}var k=a(4),w=a(150),T=a(143),I=a(151),M=a(147),P=a(142),z=a(141),A={"Academia/Research":"#07a4bc","Accelerator/Incubator":"#c30",Biofuels:"#7cc908",Buildings:"#036",Chemistry:"#c94208","Circular Economy":"#5a8925",Construction:"#603e1e","Enabling Technology/Components":"#603e1e","Energy Systems/Management":"#40a22a",Engineering:"#603e1e","Environmental Remediation":"#89256e","Evaluation/Compliance":"#9e4e16",Finance:"#269e11","Generation/Transmission":"#f80",Geology:"#9e4e16",Hydrogen:"#2cf","IIoT/IoT":"#a92278",Lighting:"#f4f390",Manufacturing:"#7b16ce",Materials:"#7b16ce",Media:"#d11265","Mobility as a Service":"#b75e35",Nuclear:"#f0f","Oil and Gas":"#ce3b16",Policy:"#660","Professional Services":"#164d82","Security/Cybersecurity":"#2c86f4",Sensors:"#dd4465",Solar:"#fce119",Storage:"#093","Sustainable Agriculture":"#898925","Thermal Energy":"#bc6d4b","Utility/Grid":"#f4a41a","Wave/Water/Hydro":"#20dbdb",Wind:"#167d7f"},L=Object.keys(A),W=Object.entries(A).flat().concat(["#ccc"]),B=function(e){return e.toLowerCase().replace(/[/ ]/g,"-")},D=Object(d.a)((function(e){return{settingsPane:{background:"rgba(244, 244, 244, 0.93)","max-width":320},settingsPaneHeader:{"background-color":"#02346d",color:"#ffffff",border:0,"text-align":"center","font-size":"14pt",padding:8},settingsPaneContent:{padding:4},settingsPaneSubheader:{"font-family":"Roboto","font-size":"12pt",padding:6},categoryLabel:{display:"flex","flex-direction":"row","verical-align":"middle","font-family":"Open Sans","font-size":"10pt"},categoryLegend:{content:"",width:15,height:15,margin:4,padding:0,"border-radius":3},formControl:{margin:e.spacing(.1)},selectAllNone:{"text-transform":"none"}}})),F=Object(k.a)({root:{color:"#666","&$checked":{color:"#50a2b2"}},checked:{}})((function(e){return o.a.createElement(M.a,Object.assign({color:"default"},e))}));function H(e){var t=D(),a=L.map((function(a,n){var c=B(a),r=e.selectedCategories.has(c);return o.a.createElement(I.a,{key:n,control:o.a.createElement(F,{checked:r,onChange:e.onToggleCategory,name:c}),label:o.a.createElement("div",{className:t.categoryLabel},o.a.createElement("span",{className:t.categoryLegend,style:{background:A[a]}}),a)})}));return o.a.createElement(w.a,{open:e.settingsPaneOpen,onClose:function(){return e.onToggleOpen(!1)}},o.a.createElement("div",{className:t.settingsPane},o.a.createElement("div",{className:t.settingsPaneHeader},o.a.createElement("span",null,"Options")),o.a.createElement("div",{className:t.settingsPaneContent},o.a.createElement("div",{className:t.settingsPaneSubheader},o.a.createElement("span",null,"Select a location")),o.a.createElement(N,{onSelectMap:e.onSelectMap,selectedMapId:e.selectedMapId}),o.a.createElement(z.a,null),o.a.createElement("div",{className:t.settingsPaneSubheader},o.a.createElement("span",null,"Filter by category")),o.a.createElement("div",null,o.a.createElement(P.a,{color:"primary",variant:"contained"},o.a.createElement(S.a,{id:"select-all",className:t.selectAllNone,onClick:e.onSelectAllCategories},"Select all"),o.a.createElement(S.a,{id:"select-none",className:t.selectAllNone,onClick:e.onDeselectAllCategories},"Clear all"))),o.a.createElement(v.a,{component:"fieldset",className:t.formControl},o.a.createElement(T.a,null,a)))))}var J=a(67),G=a(66),Y=a.n(G),R=Object(J.a)({palette:{primary:{main:"#02346d"},secondary:{main:Y.a[500]}}}),_=(a(89),"energy-companies-point-layer"),V=new Set(L.map(B));function Z(e,t){var a=t.geometry.coordinates.slice(),n=document.getElementsByClassName("mapboxgl-popup");n[0]&&n[0].remove(),new s.a.Popup({}).setLngLat(a).setHTML(function(e){var t=["tax1","tax2","tax3"].map((function(t){return e[t]})).filter((function(e){return e})).join(" | ");return'\n    <div class="popup">\n      <h3 class="company-name">'.concat(e.company,'</h3>\n      <span class="category-info">').concat(t,'</span><br />\n      <span class="city-info">').concat(e.city,"</span><br />\n      <span>\n        <a href=").concat(e.website,' target="blank">').concat(e.website,"</a>\n      </span>\n    </div>")}(t.properties)).setMaxWidth("300px").addTo(e)}function Q(e,t,a){a.then((function(a){e.addSource("companies",{type:"geojson",data:a}),e.addLayer({id:_,type:"circle",source:"companies",paint:{"circle-radius":{stops:[[7,5],[14,12],[20,50]]},"circle-opacity":.85,"circle-color":["match",["get","tax1"]].concat(W),"circle-stroke-color":"#fff","circle-stroke-width":.4}}),e.on("mouseenter",_,(function(t){e.getCanvas().style.cursor="pointer"})),e.on("mouseleave",_,(function(){e.getCanvas().style.cursor=""})),e.on("click",_,(function(t){return Z(e,t.features[0])})),e.flyTo({center:O[t].flyTo,zoom:8,speed:.5})}))}function X(){var e=Object(n.useState)(null),t=Object(i.a)(e,2),a=t[0],c=t[1],r=Object(n.useState)("sf"),l=Object(i.a)(r,2),d=l[0],u=l[1],p=Object(n.useState)({}),f=Object(i.a)(p,2),g=f[0],y=f[1],b=Object(n.useState)(V),v=Object(i.a)(b,2),E=v[0],C=v[1],S=Object(n.useState)(!1),x=Object(i.a)(S,2),j=x[0],N=x[1];function k(e){return function(e){var t="".concat("https://api.mapbox.com/datasets/v1","/").concat("energysocietymaps","/").concat(e,"/features?access_token=").concat(s.a.accessToken);return fetch(t).then((function(e){return e.json()})).then((function(e){return e.features.forEach((function(e){["tax1","tax2","tax3"].forEach((function(t){var a="".concat(t,"sanitized");e.properties[a]=B(e.properties[t])}))})),e}))}(O[e].datasetId).then((function(e){return y(e),w(),e}))}function w(){C(V)}return Object(n.useEffect)((function(){if(a||function(){var e=new s.a.Map({container:"map-container",style:"mapbox://styles/mapbox/dark-v10",center:O[d].center,zoom:6,minZoom:6}),t=k(d);e.on("load",(function(){e.addControl(new s.a.FullscreenControl,"bottom-right"),e.addControl(new s.a.NavigationControl,"bottom-right"),Q(e,d,t)})),c(e)}(),a&&a.getLayer(_)){var e=["any"];[1,2,3].forEach((function(t){var a=["in","tax".concat(t,"sanitized")];E.forEach((function(e){return a.push(e)})),e.push(a)})),a.setFilter(_,e)}})),o.a.createElement("div",{id:"app-container"},o.a.createElement(m.a,{theme:R},o.a.createElement(H,{selectedMapId:d,settingsPaneOpen:j,selectedCategories:E,onToggleOpen:N,onSelectMap:function(e){e!==d&&(a.removeLayer(_),a.removeSource("companies"),u(e),N(!1),Q(a,e,k(e)))},onSelectAllCategories:w,onDeselectAllCategories:function(){C(new Set)},onToggleCategory:function(e){var t=new Set(E);t.has(e.target.name)?t.delete(e.target.name):t.add(e.target.name),C(t)}}),o.a.createElement("div",{id:"map-container"}),o.a.createElement("div",{className:"map-overlay"},o.a.createElement("div",{className:"map-title-and-search"},o.a.createElement("div",{className:"map-title"},O[d].title),o.a.createElement(h,{companies:g.features,onSelectCompany:function(e){var t=g.features.find((function(t){return t.properties.company===e}));Z(a,t),a.flyTo({center:t.geometry.coordinates,zoom:14})},onOpenSettingsPane:function(){return N(!0)}})))))}s.a.accessToken="pk.eyJ1IjoiZW5lcmd5c29jaWV0eW1hcHMiLCJhIjoiY2s4dWJxZXo1MDlmcTNtcXFyYWVuYTlzdCJ9.YS__mAp13-uA_yQlRcOYQw",r.a.render(o.a.createElement(X,null),document.getElementById("root"))}},[[77,1,2]]]);
//# sourceMappingURL=main.9ead477a.chunk.js.map
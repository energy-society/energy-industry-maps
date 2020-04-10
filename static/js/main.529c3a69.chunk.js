(this["webpackJsonpnew-app"]=this["webpackJsonpnew-app"]||[]).push([[0],{15:function(e,t,a){e.exports=a(24)},20:function(e,t,a){},23:function(e,t,a){},24:function(e,t,a){"use strict";a.r(t);var n=a(1),o=a.n(n),c=a(9),l=a.n(c),i=(a(20),a(2)),r=a(3),s=a(4),p=a(5),d=a(0),m=a(6),u=a(8),h=a.n(u),g={"Academia/Research":"#07a4bc","Accelerator/Incubator":"#c30",Biofuels:"#7cc908",Buildings:"#036",Chemistry:"#c94208","Circular Economy":"#5a8925",Construction:"#603e1e","Enabling Technology/Components":"#603e1e","Energy Systems/Management":"#40a22a",Engineering:"#603e1e","Environmental Remediation":"#89256e","Evaluation/Compliance":"#9e4e16",Finance:"#269e11","Generation/Transmission":"#f80",Geology:"#9e4e16",Hydrogen:"#2cf","IIoT/IoT":"#a92278",Lighting:"#f4f390",Manufacturing:"#7b16ce",Materials:"#7b16ce",Media:"#d11265","Mobility as a Service":"#b75e35",Nuclear:"#f0f","Oil and Gas":"#ce3b16",Policy:"#660","Professional Services":"#164d82","Security/Cybersecurity":"#2c86f4",Sensors:"#dd4465",Solar:"#fce119",Storage:"#093","Sustainable Agriculture":"#898925","Thermal Energy":"#bc6d4b","Utility/Grid":"#f4a41a","Wave/Water/Hydro":"#20dbdb",Wind:"#167d7f"},y=Object.keys(g),f=Object.entries(g).flat().concat(["#ccc"]),b=function(e){return e.toLowerCase().replace(/[/ ]/g,"-")},C=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(s.a)(this,Object(p.a)(t).call(this,e))).state={displayCategories:!0},a.handleSelectCategory=a.handleSelectCategory.bind(Object(d.a)(a)),a.selectAll=a.selectAll.bind(Object(d.a)(a)),a.deselectAll=a.deselectAll.bind(Object(d.a)(a)),a.toggleDisplayCategoryList=a.toggleDisplayCategoryList.bind(Object(d.a)(a)),a}return Object(m.a)(t,e),Object(r.a)(t,[{key:"selectAll",value:function(){this.props.onSelectAllCategories()}},{key:"deselectAll",value:function(){this.props.onDeselectAllCategories()}},{key:"handleSelectCategory",value:function(e){this.props.onToggleCategory(e)}},{key:"toggleDisplayCategoryList",value:function(){var e=this.state.displayCategories;this.setState({displayCategories:!e})}},{key:"render",value:function(){var e=this,t=y.map((function(t){var a=b(t),n="".concat(a,"-checkbox"),c=e.props.selectedCategories.has(a);return o.a.createElement("tr",{key:a},o.a.createElement("td",null,o.a.createElement("input",{type:"checkbox",id:n,name:a,checked:c,onChange:e.handleSelectCategory})),o.a.createElement("td",null,o.a.createElement("i",{className:"category-legend",style:{background:g[t]}})),o.a.createElement("td",null,o.a.createElement("label",{htmlFor:n},t)))}));return o.a.createElement("div",{id:"company-filter",className:this.state.displayCategories?null:"hidden"},o.a.createElement("button",{id:"filter-toggle",onClick:this.toggleDisplayCategoryList},o.a.createElement("div",{className:"flex-row"},o.a.createElement("div",{className:"flex-grow"},o.a.createElement("span",{className:"header"},"Filter by category")),o.a.createElement("div",{className:"hamburger-menu"},o.a.createElement("div",null),o.a.createElement("div",null),o.a.createElement("div",null)))),o.a.createElement("div",{className:"content"},o.a.createElement("div",null,o.a.createElement("button",{id:"select-all",className:"select-all",onClick:this.selectAll},"Select all"),o.a.createElement("button",{id:"select-none",className:"select-all",onClick:this.deselectAll},"Clear all"),o.a.createElement("table",{id:"categories"},o.a.createElement("tbody",null,t)))))}}]),t}(o.a.Component),v=a(14),E=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(s.a)(this,Object(p.a)(t).call(this,e))).state={option:""},a.handleChange=a.handleChange.bind(Object(d.a)(a)),a}return Object(m.a)(t,e),Object(r.a)(t,[{key:"handleChange",value:function(e){this.setState({option:e}),this.props.onSelectCompany(e.value)}},{key:"render",value:function(){var e=[];this.props.companies&&(e=this.props.companies.map((function(e){return e.properties.company})).map((function(e){return{value:e,label:e}})));return o.a.createElement("div",{id:"place-search"},o.a.createElement(v.a,{options:e,placeholder:"Search...",onChange:this.handleChange,value:this.state.option}))}}]),t}(o.a.Component),S="https://api.mapbox.com/datasets/v1",j="sjespersen",k="ck8ial4n30lew2zp4xon151jl";a(23);var x="energy-companies-point-layer";function O(e){var t=new Set(e.features.map((function(e){return e.properties.tax1})));return Object.values(Array.from(t)).sort()}h.a.accessToken="pk.eyJ1IjoiZW5lcmd5c29jaWV0eW1hcHMiLCJhIjoiY2s4dWJxZXo1MDlmcTNtcXFyYWVuYTlzdCJ9.YS__mAp13-uA_yQlRcOYQw";var A=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(s.a)(this,Object(p.a)(t).call(this,e))).state={center:[-121,36.5],zoom:6,minZoom:6,companiesGeojson:{},selectedCategories:new Set},a.handleToggleCategory=a.handleToggleCategory.bind(Object(d.a)(a)),a.handleSelectAllCategories=a.handleSelectAllCategories.bind(Object(d.a)(a)),a.handleDeselectAllCategories=a.handleDeselectAllCategories.bind(Object(d.a)(a)),a.handleSelectCompany=a.handleSelectCompany.bind(Object(d.a)(a)),a.displayPopup=a.displayPopup.bind(Object(d.a)(a)),a}return Object(m.a)(t,e),Object(r.a)(t,[{key:"displayPopup",value:function(e){var t=e.geometry.coordinates.slice(),a=document.getElementsByClassName("mapboxgl-popup");a[0]&&a[0].remove(),new h.a.Popup({}).setLngLat(t).setHTML(function(e){var t=["tax1","tax2","tax3"].map((function(t){return e[t]})).filter((function(e){return e})).join(" | ");return'\n    <div class="popup">\n      <h3 class="company-name">'.concat(e.company,'</h3>\n      <span class="category-info">').concat(t,'</span><br />\n      <span class="city-info">').concat(e.city,"</span><br />\n      <span><a href=").concat(e.website,' target="blank">').concat(e.website,"</a></span>\n    </div>")}(e.properties)).setMaxWidth("40vw").addTo(this.map)}},{key:"componentDidMount",value:function(){var e=this;this.map=new h.a.Map({container:this.mapContainer,style:"mapbox://styles/mapbox/dark-v10",center:this.state.center,zoom:this.state.zoom,minZoom:this.state.minZoom}),this.map.on("move",(function(){e.setState({lng:e.map.getCenter().lng.toFixed(4),lat:e.map.getCenter().lat.toFixed(4),zoom:e.map.getZoom().toFixed(2)})})),this.map.on("load",(function(){e.map.addControl(new h.a.FullscreenControl,"bottom-left"),e.map.addControl(new h.a.NavigationControl,"bottom-left"),fetch("".concat(S,"/").concat(j,"/").concat(k,"/features?access_token=").concat(h.a.accessToken)).then((function(e){return e.text()})).then((function(e){return JSON.parse(e)})).then((function(e){return e.features.forEach((function(e){e.properties={company:e.properties.company,city:e.properties.city,tax1:e.properties.tax1,tax2:e.properties.tax2,tax3:e.properties.tax3,website:e.properties.website},["tax1","tax2","tax3"].forEach((function(t){var a="".concat(t,"sanitized");e.properties[a]=b(e.properties[t])}))})),e})).then((function(t){e.setState({companiesGeojson:t,categories:O(t)}),e.handleSelectAllCategories(),e.map.addSource("companies",{type:"geojson",data:t}),e.map.addLayer({id:x,type:"circle",source:"companies",paint:{"circle-radius":{stops:[[7,5],[14,12],[20,50]]},"circle-opacity":.85,"circle-color":["match",["get","tax1"]].concat(f),"circle-stroke-color":"#fff","circle-stroke-width":.4}}),e.map.on("mouseenter",x,(function(t){e.map.getCanvas().style.cursor="pointer"})),e.map.on("mouseleave",x,(function(){e.map.getCanvas().style.cursor=""})),e.map.on("click",x,(function(t){return e.displayPopup(t.features[0])}))})),e.map.flyTo({center:[-122.21,37.65],zoom:8,speed:.5})}))}},{key:"handleToggleCategory",value:function(e){var t=this.state.selectedCategories;t.has(e.target.name)?t.delete(e.target.name):t.add(e.target.name),this.setState({selectedCategories:t})}},{key:"handleSelectAllCategories",value:function(){var e=y.map(b);this.setState({selectedCategories:new Set(e)})}},{key:"handleDeselectAllCategories",value:function(){this.setState({selectedCategories:new Set})}},{key:"handleSelectCompany",value:function(e){var t=this.state.companiesGeojson.features.find((function(t){return t.properties.company===e}));this.displayPopup(t),this.map.flyTo({center:t.geometry.coordinates,zoom:14})}},{key:"componentDidUpdate",value:function(){if(this.map.getLayer(x)){var e=["any"],t=this.state.selectedCategories;[1,2,3].forEach((function(a){var n=["in","tax".concat(a,"sanitized")];t.forEach((function(e){return n.push(e)})),e.push(n)})),this.map.setFilter(x,e)}}},{key:"render",value:function(){var e=this;return o.a.createElement("div",{id:"app-container"},o.a.createElement("div",{ref:function(t){return e.mapContainer=t},id:"map-container"}),o.a.createElement("div",{id:"map-overlay"},o.a.createElement("div",{id:"title-and-search"},o.a.createElement("div",{id:"map-title"},"Silicon Valley Energy Ecosystem, 2019"),o.a.createElement(E,{companies:this.state.companiesGeojson.features,onSelectCompany:this.handleSelectCompany})),o.a.createElement(C,{selectedCategories:this.state.selectedCategories,onSelectAllCategories:this.handleSelectAllCategories,onDeselectAllCategories:this.handleDeselectAllCategories,onToggleCategory:this.handleToggleCategory})))}}]),t}(o.a.Component);l.a.render(o.a.createElement(A,null),document.getElementById("root"))}},[[15,1,2]]]);
//# sourceMappingURL=main.529c3a69.chunk.js.map
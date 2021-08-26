(this["webpackJsonpzesp-ui-app"]=this["webpackJsonpzesp-ui-app"]||[]).push([[0],{107:function(e,t,n){var c={"./config":51,"./config.js":51,"./locales/en/common":59,"./locales/en/common.json":59,"./locales/en/nav":60,"./locales/en/nav.json":60,"./locales/en/pages/setup-mqtt":61,"./locales/en/pages/setup-mqtt.json":61,"./locales/en/pages/setup-wifi":62,"./locales/en/pages/setup-wifi.json":62,"./locales/en/pages/welcome":63,"./locales/en/pages/welcome.json":63};function s(e){var t=a(e);return n(t)}function a(e){if(!n.o(c,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return c[e]}s.keys=function(){return Object.keys(c)},s.resolve=a,e.exports=s,s.id=107},108:function(e,t,n){},109:function(e,t,n){},110:function(e,t,n){},124:function(e,t,n){},133:function(e,t,n){},136:function(e,t,n){"use strict";n.r(t);var c,s,a,o,r=n(0),i=n.n(r),l=n(20),d=n.n(l),u=(n(84),n(85),n(86),n(51),n(2)),b=n(6),j=n(13),p=n(8),m=(n(108),n(109),n(149)),h=(n(110),n(1)),f=function(){var e=Object(m.a)("nav").t;return Object(h.jsxs)("nav",{className:"nav nav-masthead justify-content-center",children:[Object(h.jsx)(j.b,{className:"nav-link",to:"/",exact:!0,children:e("home")}),Object(h.jsx)(j.b,{className:"nav-link",to:"/devices",children:e("devices")}),Object(h.jsx)(j.b,{className:"nav-link",to:"/setup",children:e("setup")})]})},v=n(18),O=n.n(v),g=(n(124),n(141)),x=Object(r.createContext)({state:{},setState:{}}),w=function(e){var t=e.children,n=e.value,c=void 0===n?{}:n;Object.assign(c,{spinnerLoadingShow:!1,zespConnected:!1,appInitialized:!1,zespSettings:void 0,selectedServerIndex:null});var s=Object(r.useState)(c),a=Object(b.a)(s,2),o=a[0],i=a[1];return Object(h.jsx)(x.Provider,{value:{state:o,setState:i},children:t})},S=function(){var e=Object(r.useContext)(x);if(!e)throw new Error("useGlobalState must be used within a GlobalStateContext");return e},y=function(){return S().state.spinnerLoadingShow?(setTimeout((function(){return O()(".loading-overlay").removeClass("hidden")}),0),Object(h.jsx)("div",{className:"loading-overlay hidden",children:Object(h.jsx)(g.a,{animation:"border",variant:"light"})})):Object(h.jsx)(r.Fragment,{})},N=n(71),k={ConnectionStartTimeout:500,VerifyConnectionTimeout:5e3,DefaultRequestTimeoutSeconds:5},_=n(39),C=n(40),I=n(46),T=n(79),E="zesp-data-received",z=function(e){Object(C.a)(n,e);var t=Object(I.a)(n);function n(e,c,s){var a;return Object(_.a)(this,n),(a=t.call(this,E)).dataType=void 0,a.response=void 0,a.dataParts=void 0,a.dataType=e,a.dataParts=c,a.response=s,a}return n}(Object(T.a)(Event));!function(e){e[e.Restart=1012]="Restart"}(c||(c={}));var A,q,L,P,V=new EventTarget,Z={connectAsync:function(e,t){return new Promise((function(n,c){return a&&o?(console.warn("ZespConnector already initialized"),void n(L.ZespConnector)):(a=e,o=t,setTimeout((function(){return Z.reconnectAsync(!0).then((function(){return n(L.ZespConnector)})).catch((function(e){a.setState((function(e){return Object(u.a)(Object(u.a)({},e),{zespConnected:!1})})),c(e)}))}),k.ConnectionStartTimeout),A=setInterval((function(){return Z.reconnectAsync(!1).then((function(){return n(L.ZespConnector)})).catch((function(e){console.warn("Reconnection is failed: ".concat(e)),a.setState((function(e){return Object(u.a)(Object(u.a)({},e),{zespConnected:!1})})),c(e)}))}),k.VerifyConnectionTimeout),Z)}))},disconnect:function(){A&&(clearInterval(A),A=null),o=null,a.setState((function(e){return Object(u.a)(Object(u.a)({},e),{zespConnected:!1})}));try{var e,t,n,c,r,i,l;if(3===(null===(e=s)||void 0===e||null===(t=e.underlyingWebsocket)||void 0===t?void 0:t.readyState)||null==(null===(n=s)||void 0===n||null===(c=n.underlyingWebsocket)||void 0===c?void 0:c.readyState))return void console.debug("zesp connection already closed");if(1===(null===(r=s)||void 0===r||null===(i=r.underlyingWebsocket)||void 0===i?void 0:i.readyState))return console.debug("zesp connection closing..."),void s.close(1e3);null===(l=s)||void 0===l||l.close(1e3)}catch(d){}},reconnectAsync:function(e){return new Promise((function(t,n){var r,i,l,d;if(a||n("ZespConnector is not initialized yet"),o||n("Server configuration missed"),0!==(null===(r=s)||void 0===r||null===(i=r.underlyingWebsocket)||void 0===i?void 0:i.readyState))if(1!==(null===(l=s)||void 0===l||null===(d=l.underlyingWebsocket)||void 0===d?void 0:d.readyState)||e){console.debug("Start ws connection...");try{s.close(c.Restart)}catch(j){}a.setState((function(e){return Object(u.a)(Object(u.a)({},e),{zespConnected:!1})}));var b="https:"===document.location.protocol?"wss":"ws";s=new N.WebsocketBuilder("".concat(b,"://").concat(o.address,":81")).onOpen((function(){F(),t()})).onClose(M).onError((function(){D(),n("zesp connection error")})).onMessage(J).build()}else t();else n("Already connecting")}))},send:function(e){if(!a)throw new Error("ZespConnector is not initialized yet");s.send(e)},requestAsync:function(e){var t=e.data,n=e.responseValidator,c=e.timeoutSeconds;return new Promise((function(e,s){(!c||c<=0)&&(c=k.DefaultRequestTimeoutSeconds);var a=!1,o=n,r=function t(n){var c=n;o.isValid(c)&&(a=!0,V.removeEventListener(E,t),e(c))};try{V.addEventListener(E,r),Z.send(t),setTimeout((function(){a||(V.removeEventListener(E,r),console.warn("zesp response did not received (timeout: ".concat(c," seconds)")),s("timeout"))}),1e3*c)}catch(i){s("exception: ".concat(i))}}))},request:function(e){return new Promise((function(t,n){Z.requestAsync(e).then((function(n){e.onSuccess?e.onSuccess(n):console.debug("zesp request completed (".concat(e.responseValidator.name,")")),t(L.ZespConnector)})).catch((function(t){var c="".concat(t," (").concat(e.responseValidator.name,"; ").concat(e.data,")");e.onError?e.onError(c):console.warn("zesp request failed: ".concat(c)),n(c)}))}))},subscribe:function(e,t){var n=function(n){var c=n;e.isValid(c)&&t(c)};return V.addEventListener(E,n),n},unsubscribe:function(e){return V.removeEventListener(E,e)}},F=function(){console.debug("Zesp connection opened"),a.setState((function(e){return Object(u.a)(Object(u.a)({},e),{zespConnected:!0})}))},M=function(){console.debug("Zesp connection closed"),a.setState((function(e){return Object(u.a)(Object(u.a)({},e),{zespConnected:!1})}))},D=function(){console.debug("Zesp connection error happened )=")},J=function(e,t){var n=t.data.replace(/\|(?=([^"]*"[^"]*")*[^"]*$)/gi,"\0").split("\0");if(0!=n.length){var c=n.shift();/\/(.+)\.json/gi.exec(c)&&(n.unshift(c),c="json");var s=new z(c,n,t.data);V.dispatchEvent(s)}else console.warn("Received empty message from zesp")},Q=Z,W={init:function(e){q?console.warn("Loader spinner already initialized"):q=e},show:function(){return H(!0)},hide:function(){return H(!1)}},H=function(e){return q.setState((function(t){return Object(u.a)(Object(u.a)({},t),{spinnerLoadingShow:e})}))};(P=L||(L={})).ZespConnector=Q,P.ZespConnectorPromise=new Promise((function(e){return e(L.ZespConnector)})),P.Spinner=W;var R=function e(t){return{name:e.name,isValid:function(e){if("json"!==e.dataType)return!1;var n=e.dataParts[0];return/\/(.+)\.json/gi.exec(n)[1]===t}}},B=function e(t){return{name:e.name,isValid:function(e){return e.dataType===t}}},G=!1;function U(e){console.log("groups received")}function $(e){console.log("locations received")}function Y(e){console.log("MI Lamp data received")}function K(e){console.log("List of devices received")}function X(e){console.log("Device update received: ".concat(e.dataParts[1]))}var ee={initAsync:function(){return new Promise((function(e,t){if(G)return console.warn("zesp service already initialized"),void e();G=!0,console.debug("Load initial data from zesp..."),L.ZespConnectorPromise.then((function(e){return e.request({data:"LoadJson|/groups.json",responseValidator:R("groups"),onSuccess:U})})).then((function(e){return e.request({data:"LoadJson|/location.json",responseValidator:R("location"),onSuccess:$})})).then((function(e){return e.request({data:"get_Mi_lamp",responseValidator:B("Mi_lamp"),onSuccess:Y})})).then((function(e){return e.request({data:"getDeviceList",responseValidator:B("alldev"),onSuccess:K})})).then((function(e){return e.subscribe(B("rep"),X)})).then((function(){return e()})).catch((function(e){console.error("Cannot complete zesp service initialization: ".concat(e)),t(e)}))}))},ping:function(){return e="ping",L.ZespConnector.send(e);var e}},te={getAsync:function(){return new Promise((function(e,t){L.ZespConnector.requestAsync({data:"loadConfig",responseValidator:B("jsconfig")}).then((function(e){return function(e){var t=JSON.parse(e),n={};return Object.assign(n,t),n}(e.dataParts[0])})).then((function(t){return e(t)})).catch((function(e){return t(e)}))}))},setAsync:function(e){var t=["SaveJson","/jsconfig.txt",JSON.stringify(e)].join("|");return new Promise((function(e,n){L.ZespConnector.requestAsync({data:t,responseValidator:B("ZD_RSP")}).then((function(t){"ok"===t.dataParts[1].toLocaleLowerCase()?e():n("Settings was not saved: ".concat(t.response))})).catch((function(e){return n(e)}))}))}},ne=n(35),ce=function(e){return Object(h.jsx)("div",{className:"cover text-center d-flex content-light align-self-center flex-grow-1 align-items-center",children:Object(h.jsx)("div",{className:"",children:e.children})})},se=(n(133),function(e){var t=Object(r.useState)("show-transition hidden"),n=Object(b.a)(t,2),c=n[0],s=n[1];return setTimeout((function(){return s("show-transition")}),0),Object(h.jsx)("div",{className:c,children:e.children})}),ae=function(){return Object(h.jsx)(ce,{children:Object(h.jsxs)(se,{children:[Object(h.jsx)("h1",{className:"cover-heading",children:"Quite soon, here will be useful info"}),Object(h.jsx)("p",{className:"lead",children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ultricies ipsum porttitor, aliquet enim eu, congue nulla. Nulla luctus ante sit amet sodales convallis. Aliquam lectus nisl, semper eget aliquam et, malesuada ut orci."}),Object(h.jsx)("p",{className:"lead",children:Object(h.jsx)("a",{href:"https://t.me/zesp32",target:"_blank",rel:"noreferrer",className:"btn btn-lg btn-secondary",children:"Get more"})})]})})},oe=function(){return Object(h.jsx)(ce,{children:Object(h.jsxs)(se,{children:[Object(h.jsx)("h1",{className:"cover-heading",children:"Not implemented yet!"}),Object(h.jsxs)("p",{className:"lead",children:["Hello, my dear friend! Just imagine how awesome this feature can be and share it with developers ~_~ ",Object(h.jsx)("br",{}),Object(h.jsx)("br",{}),"Or you can even implement it yourself, everything you need is just to jump to source codes, made some magic, test it and that's it!"]})]})})},re=n(142),ie=n(146),le=n(77),de=function(e,t,n){var c=Object(u.a)(Object(u.a)({},t.state.zespSettings),e),s=te.setAsync(c).then((function(){return t.setState((function(e){return Object(u.a)(Object(u.a)({},e),{},{zespSettings:c})}))}));return ne.b.promise(s,{loading:n("common:saving_progress"),success:n("common:saving_success"),error:n("common:saving_error")}),s},ue=function(){var e=S();return Object(r.useEffect)((function(){L.Spinner.show(),te.getAsync().then((function(t){e.setState((function(e){return Object(u.a)(Object(u.a)({},e),{zespSettings:t})})),L.Spinner.hide()})).catch((function(e){alert(e)}))}),[]),e.state.zespSettings?Object(h.jsxs)(se,{children:[Object(h.jsx)("div",{className:"aaa",children:"..."}),Object(h.jsx)(re.a,{className:"p-0",children:Object(h.jsxs)(ie.a,{variant:"pills",children:[Object(h.jsx)(ie.a.Item,{children:Object(h.jsx)(j.b,{className:"nav-link",to:"/setup",exact:!0,children:"Wifi client"})}),Object(h.jsx)(ie.a.Item,{children:Object(h.jsx)(j.b,{className:"nav-link",to:"/setup/zigbee",children:"Zigbee settings"})}),Object(h.jsx)(ie.a.Item,{children:Object(h.jsx)(j.b,{className:"nav-link",to:"/setup/mqtt",children:"MQTT client"})}),Object(h.jsx)(ie.a.Item,{children:Object(h.jsx)(j.b,{className:"nav-link",to:"/setup/telegram",children:"Telegram bot"})}),Object(h.jsx)(ie.a.Item,{children:Object(h.jsx)(j.b,{className:"nav-link",to:"/setup/z2m",children:"Zigbee2MQTT client"})}),Object(h.jsx)(ie.a.Item,{className:"ms-auto",children:Object(h.jsxs)(j.b,{className:"nav-link",to:"/setup/zesp-ui",children:[Object(h.jsx)(le.a,{style:{marginTop:"-3px"}})," ZESP:UI"]})})]})})]}):Object(h.jsx)(r.Fragment,{})},be=n(148),je=n(143),pe=n(74),me=n(144),he=n(147),fe=function(e){var t=e.controlId,n=e.label,c=e.placeholder,s=e.defaultValue,a=e.type,o=void 0===a?"text":a,r=e.value,i={placeholder:c,type:o};return s&&(i=Object(u.a)(Object(u.a)({},i),{defaultValue:s.toString()})),r&&(i=Object(u.a)(Object(u.a)({},i),{value:r.toString()})),Object(h.jsxs)(he.a.Group,{as:je.a,className:"mb-3",controlId:t,children:[Object(h.jsx)(he.a.Label,{column:!0,md:"3",lg:"2",children:n}),Object(h.jsx)(pe.a,{children:Object(h.jsx)(he.a.Control,Object(u.a)({},i))})]})},ve=function(e){var t=e.controlId,n=e.label,c=e.defaultChecked,s=e.checkedValue,a=void 0===s?"true":s,o=e.uncheckedValue,r="true"===c||"1"===c||1===c||!0===c||!1,i={checked_value:a,unchecked_value:void 0===o?"false":o};return c&&(i=Object(u.a)(Object(u.a)({},i),{defaultChecked:r})),Object(h.jsx)(he.a.Group,{controlId:t,className:"d-inline-block",children:Object(h.jsxs)(he.a.Label,{className:"d-flex",children:[Object(h.jsx)(he.a.Check,Object(u.a)({className:"pe-2"},i)),Object(h.jsx)("span",{children:n})]})})},Oe=n(3),ge=n(28),xe={handleSubmit:function(e,t){e.preventDefault();var n,c={},s=Object(ge.a)(O()(e.target).find("input"));try{for(s.s();!(n=s.n()).done;){var a=n.value,o=O()(a).prop("id");if(null==o)return;"checkbox"===O()(a).prop("type")?!0===O()(a).prop("checked")?c[o]=O()(a).attr("checked_value")||"true":c[o]=O()(a).attr("unchecked_value")||"false":c[o]=O()(a).val()}}catch(r){s.e(r)}finally{s.f()}t(c)}},we=["onSubmit"],Se=function(e){var t=e.onSubmit,n=Object(Oe.a)(e,we);return Object(h.jsx)(he.a,Object(u.a)(Object(u.a)({onSubmit:function(e){return xe.handleSubmit(e,t)}},n),{},{children:e.children}))},ye=function(){var e,t,n=S(),c=Object(m.a)(["pages.setup-mqtt","common"]).t,s=null===(e=n.state.zespSettings)||void 0===e?void 0:e.MQTT;if(!s)return Object(h.jsx)(r.Fragment,{});return Object(h.jsx)(se,{children:Object(h.jsx)(be.a,{children:Object(h.jsxs)(Se,{onSubmit:function(e){return de({MQTT:e},n,c)},children:[Object(h.jsxs)(be.a.Body,{children:[Object(h.jsx)(fe,{controlId:"mqttup",defaultValue:s.mqttup,label:c("topic.label"),placeholder:c("topic.placeholder")}),Object(h.jsx)(fe,{controlId:"mqtt",defaultValue:s.mqtt,label:c("server.label"),placeholder:c("server.placeholder")}),Object(h.jsx)(fe,{controlId:"mqttPort",defaultValue:null===(t=s.mqttPort)||void 0===t?void 0:t.toString(),label:c("port.label"),placeholder:c("port.placeholder")}),Object(h.jsx)(fe,{controlId:"mqttLogin",defaultValue:s.mqttLogin,label:c("login.label"),placeholder:c("login.placeholder")}),Object(h.jsx)(fe,{controlId:"mqttPassw",defaultValue:s.mqttPassw,label:c("password.label"),placeholder:c("password.placeholder")}),Object(h.jsxs)(je.a,{children:[Object(h.jsx)(pe.a,{md:"3",lg:"2"}),Object(h.jsxs)(pe.a,{className:"space-between-4",children:[Object(h.jsx)(ve,{controlId:"mqttEnable",defaultChecked:s.mqttEnable,label:c("is_enabled.label"),checkedValue:1,uncheckedValue:0}),Object(h.jsx)(ve,{controlId:"Home_Assistant",defaultChecked:s.Home_Assistant,label:c("is_ha_enabled.label"),checkedValue:1,uncheckedValue:0})]})]})]}),Object(h.jsx)(be.a.Footer,{children:Object(h.jsx)(me.a,{variant:"primary",type:"submit",children:c("common:save_button")})})]})})})},Ne=function(){return Object(h.jsx)(se,{children:Object(h.jsx)("div",{className:"px-4 py-5 bg-light rounded-3",children:Object(h.jsxs)("div",{className:"container-fluid",children:[Object(h.jsx)("h1",{className:"display-5 fw-bold",children:"Not implemented yet!"}),Object(h.jsxs)("p",{className:"col-md-8 fs-4",children:["Hello, my dear friend! Just imagine how awesome this feature can be and share it with developers ~_~ ",Object(h.jsx)("br",{}),Object(h.jsx)("br",{}),"Or you can even implement it yourself, everything you need is just to jump to source codes, made some magic, test it and that's it!"]}),Object(h.jsx)("hr",{className:"my-4"}),Object(h.jsxs)("p",{children:["This feature is under contruction. You can find latest verion on ",Object(h.jsx)("a",{href:"#",children:"github project page"})," or just click this big blue button bellow."]}),Object(h.jsx)("a",{href:"#",target:"_blank",rel:"noreferrer",className:"btn btn-primary btn-lg",type:"button",children:"Learn more"})]})})})},ke=function(){var e,t=S(),n=Object(m.a)(["pages.setup-wifi","common"]).t,c=null===(e=t.state.zespSettings)||void 0===e?void 0:e.Wifi;if(!c)return Object(h.jsx)(r.Fragment,{});return Object(h.jsx)(r.Fragment,{children:Object(h.jsx)(se,{children:Object(h.jsx)(Se,{onSubmit:function(e){return de({Wifi:e},t,n)},children:Object(h.jsxs)(be.a,{children:[Object(h.jsxs)(be.a.Body,{children:[Object(h.jsx)(fe,{controlId:"ssid",defaultValue:null===c||void 0===c?void 0:c.ssid,label:n("ssid.label"),placeholder:n("ssid.placeholder")}),Object(h.jsx)(fe,{controlId:"pass",defaultValue:null===c||void 0===c?void 0:c.pass,label:n("pass.label"),placeholder:n("pass.placeholder")}),Object(h.jsx)(fe,{controlId:"ip",defaultValue:null===c||void 0===c?void 0:c.ip,label:n("ip.label"),placeholder:n("ip.placeholder")}),Object(h.jsx)(fe,{controlId:"mask",defaultValue:null===c||void 0===c?void 0:c.mask,label:n("mask.label"),placeholder:n("mask.placeholder")}),Object(h.jsx)(fe,{controlId:"gw",defaultValue:null===c||void 0===c?void 0:c.gw,label:n("gw.label"),placeholder:n("gw.placeholder")})]}),Object(h.jsx)(be.a.Footer,{children:Object(h.jsx)(me.a,{variant:"primary",type:"submit",children:n("common:save_button")})})]})})})})},_e=function(){return Object(h.jsxs)(r.Fragment,{children:[Object(h.jsx)(p.a,{exact:!0,path:"/",component:ae}),Object(h.jsx)(p.a,{path:"/devices",component:oe}),Object(h.jsx)(p.a,{path:"/setup",component:ue}),Object(h.jsx)(p.a,{exact:!0,path:"/setup",component:ke}),Object(h.jsx)(p.a,{path:"/setup/mqtt",component:ye}),Object(h.jsx)(p.a,{path:"/setup/zigbee",component:Ne}),Object(h.jsx)(p.a,{path:"/setup/telegram",component:Ne}),Object(h.jsx)(p.a,{path:"/setup/z2m",component:Ne}),Object(h.jsx)(p.a,{path:"/setup/zesp-ui",component:Ne})]})},Ce=(n(52),function(e){var t=Object(m.a)("pages.welcome").t,n=e.servers.map((function(e,t){return{server:e,index:t}})).sort((function(e,t){return e.server.name>t.server.name?1:-1}));return Object(h.jsx)("div",{className:"container welcome-page h-100",children:Object(h.jsx)(se,{children:Object(h.jsxs)(be.a,{className:"text-start",children:[Object(h.jsx)(be.a.Header,{children:t("list.title")}),Object(h.jsxs)(be.a.Body,{children:[0==e.servers.length&&Object(h.jsx)("div",{children:t("list.add_message")}),e.servers.length>0&&Object(h.jsx)("nav",{className:"servers-list",children:n.map((function(t,n){return Object(h.jsxs)("div",{className:"item",children:[Object(h.jsxs)(j.b,{className:"server-button",to:"/",onClick:function(n){e.openServerAction(t.index),n.preventDefault()},activeClassName:"none",children:[Object(h.jsx)("i",{className:"bi bi-caret-right-fill"})," ",t.server.name]}),Object(h.jsx)("button",{type:"button",onClick:function(){return e.openEditAction(t.server)},className:"edit-button",children:Object(h.jsx)("i",{className:"bi bi-pencil-fill"})})]},"item-".concat(n))}))})]}),Object(h.jsx)(be.a.Footer,{className:"text-right",children:Object(h.jsx)("button",{type:"button",onClick:e.openAddServer,className:"btn btn-primary",children:t("list.add_button")})})]})})})}),Ie=n(78),Te=n(73),Ee=n(150),ze=n(145),Ae=function(e){var t,n,c=Object(m.a)("pages.welcome").t,s=Object(r.useState)(!1),a=Object(b.a)(s,2),o=a[0],i=a[1],l=Object(h.jsxs)(Ie.a,{id:"popover-basic",children:[Object(h.jsx)(Ie.a.Header,{as:"h3",children:c("edit.delete_title")}),Object(h.jsx)(Ie.a.Body,{children:Object(h.jsx)("span",{dangerouslySetInnerHTML:{__html:c("edit.delete_message")}})})]});return Object(h.jsx)("div",{className:"container welcome-page h-100",children:Object(h.jsx)(se,{children:Object(h.jsx)(Se,{onSubmit:function(t){return e.editServer?e.updateAction(t):e.addAction(t),Promise.resolve()},children:Object(h.jsxs)(be.a,{className:"text-start",children:[Object(h.jsxs)(be.a.Header,{className:"d-flex justify-content-between",children:[Object(h.jsx)("span",{className:"modal-title",children:c("edit.title")}),Object(h.jsx)("button",{type:"button",className:"btn-close","aria-label":"Close",onClick:e.closeAction})]}),Object(h.jsxs)(be.a.Body,{children:[Object(h.jsx)(Te.a,{className:"mb-2",id:"name",defaultValue:null===(t=e.editServer)||void 0===t?void 0:t.name,placeholder:c("edit.name_input_placeholder")}),Object(h.jsxs)(Ee.a,{children:[Object(h.jsxs)(Ee.a.Text,{id:"basic-addon3",children:["https:"===document.location.protocol?"wss":"ws","://"]}),Object(h.jsx)(Te.a,{id:"address",defaultValue:null===(n=e.editServer)||void 0===n?void 0:n.address,"aria-describedby":"basic-addon3",placeholder:c("edit.address_input_placeholder")})]})]}),e.editServer&&Object(h.jsxs)(be.a.Footer,{className:"d-flex justify-content-between",children:[Object(h.jsx)("div",{children:Object(h.jsx)(ze.a,{trigger:"click",placement:"top",overlay:l,rootClose:!0,onToggle:i,children:Object(h.jsx)("button",{onClick:function(){o&&e.deleteAction()},type:"button",className:"btn btn-outline-danger",children:c("edit.delete_button")})})}),Object(h.jsx)("button",{type:"submit",className:"btn btn-primary",children:c("edit.save_button")})]}),!e.editServer&&Object(h.jsx)(be.a.Footer,{className:"text-right",children:Object(h.jsx)("button",{type:"submit",className:"btn btn-primary",children:c("edit.add_button")})})]})})})})};function qe(e,t){var n=function(){if("undefined"===typeof window)return t;try{var n=window.localStorage.getItem(e);return n?JSON.parse(n):t}catch(c){return console.warn("Error reading localStorage key \u201c".concat(e,"\u201d:"),c),t}},c=Object(r.useState)(n),s=Object(b.a)(c,2),a=s[0],o=s[1];return Object(r.useEffect)((function(){o(n())}),[]),Object(r.useEffect)((function(){var e=function(){o(n())};return window.addEventListener("storage",e),window.addEventListener("local-storage",e),function(){window.removeEventListener("storage",e),window.removeEventListener("local-storage",e)}}),[]),[a,function(t){"undefined"==typeof window&&console.warn("Tried setting localStorage key \u201c".concat(e,"\u201d even though environment is not a client"));try{var n=t instanceof Function?t(a):t;window.localStorage.setItem(e,JSON.stringify(n)),o(n),window.dispatchEvent(new Event("local-storage"))}catch(c){console.warn("Error setting localStorage key \u201c".concat(e,"\u201d:"),c)}}]}var Le=function(){var e=S(),t=Object(r.useState)("welcome"),n=Object(b.a)(t,2),c=n[0],s=n[1],a=Object(r.useState)(),o=Object(b.a)(a,2),i=o[0],l=o[1],d=qe("servers",[]),j=Object(b.a)(d,2),p=j[0],m=j[1],f=function(){l(void 0),s("welcome")};return"edit"===c?Object(h.jsx)(Ae,{editServer:i,addAction:function(e){p.push(e),m(p),f()},updateAction:function(e){var t=p.indexOf(i);p[t]=e,m(p),console.log(p),f()},closeAction:f,deleteAction:function(){m(p.filter((function(e){return e!==i}))),f()}}):Object(h.jsx)(Ce,{servers:p,openAddServer:function(){l(void 0),s("edit")},openEditAction:function(e){l(e),s("edit")},openServerAction:function(t){e.setState((function(e){return Object(u.a)(Object(u.a)({},e),{selectedServerIndex:t})}))}})},Pe=function(){var e=S(),t=qe("servers",[]),n=Object(b.a)(t,1)[0],c=null===e.state.selectedServerIndex||n.length<=e.state.selectedServerIndex?null:n[e.state.selectedServerIndex];return c?Object(h.jsx)(Ve,{server:c}):Object(h.jsx)(Le,{})},Ve=function(e){var t=S();return Object(r.useEffect)((function(){console.log(t.state),L.Spinner.init(t),L.Spinner.show(),L.ZespConnectorPromise.then((function(n){return n.connectAsync(t,e.server)})).then((function(){return ee.initAsync()})).then((function(){t.setState((function(e){return Object(u.a)(Object(u.a)({},e),{appInitialized:!0})})),L.Spinner.hide()})).catch((function(n){t.setState((function(e){return Object(u.a)(Object(u.a)({},e),{appInitialized:!1,selectedServerIndex:null})})),L.ZespConnector.disconnect(),L.Spinner.hide(),ne.b.error("Ooops, cannot connect to the server (".concat(e.server.address,"). ").concat(n))}))}),[]),t.state.appInitialized?Object(h.jsxs)("div",{className:"container-md d-flex w-100 h-100 p-3 mx-auto flex-column",children:[Object(h.jsxs)("header",{className:"masthead",children:[Object(h.jsx)("a",{href:"/",children:Object(h.jsx)("h3",{className:"masthead-brand",children:"ZESP:UI"})}),Object(h.jsx)(f,{})]}),Object(h.jsx)("main",{role:"main",className:"text-start d-flex flex-grow-1 flex-column",children:Object(h.jsx)(_e,{})}),Object(h.jsx)("footer",{className:"mastfoot mt-3",children:Object(h.jsxs)("p",{children:["ZESP UI application, by ",Object(h.jsx)("a",{href:"https://t.me/NickRimmer",target:"_blank",rel:"noreferrer",children:"@NickRimmer"}),". (0.0.0 version, ",Object(h.jsx)("span",{children:"dev build"}),")"]})})]}):Object(h.jsx)(r.Fragment,{})},Ze=function(){return Object(h.jsx)(j.a,{children:Object(h.jsx)(p.c,{children:Object(h.jsxs)(w,{children:[Object(h.jsx)(Pe,{}),Object(h.jsx)(y,{}),Object(h.jsx)(ne.a,{})]})})})},Fe=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,151)).then((function(t){var n=t.getCLS,c=t.getFID,s=t.getFCP,a=t.getLCP,o=t.getTTFB;n(e),c(e),s(e),a(e),o(e)}))};d.a.render(Object(h.jsx)(i.a.StrictMode,{children:Object(h.jsx)(Ze,{})}),document.getElementById("root")),Fe()},51:function(e,t,n){"use strict";n.r(t);var c=n(47),s=n(29),a=["en"],o=["common","nav","pages.setup-mqtt","pages.setup-wifi","pages.welcome"];c.a.use(s.e).init({fallbackLng:a[0],lng:a[0],resources:function(){for(var e={},t=0,c=a;t<c.length;t++){var s=c[t];e[s]={};for(var r=0,i=o;r<i.length;r++){var l=i[r],d="./locales/".concat(s,"/").concat(l.replace(".","/"),".json");try{e[s][l]=n(107)(""+d),console.debug("".concat(d," (ok)"))}catch(u){console.debug("".concat(d," (error)"))}}}return e}(),ns:o,defaultNS:"common"}),c.a.languages=a,t.default=c.a},52:function(e,t,n){},59:function(e){e.exports=JSON.parse('{"save_button":"Save changes","saving_success":"Saving successful","saving_error":"Oops... we cannot complete it )=","saving_progress":"Saving in progress..."}')},60:function(e){e.exports=JSON.parse('{"home":"Home","devices":"Devices","setup":"Settings"}')},61:function(e){e.exports=JSON.parse('{"topic":{"label":"Topic name","placeholder":"Enter MQTT topic name (e.g. zesp32)"},"server":{"label":"Server address","placeholder":"Enter MQTT server address (e.g. 192.168.1.1)"},"port":{"label":"Server port","placeholder":"Enter MQTT server port (e.g. 1883)"},"login":{"label":"MQTT Login","placeholder":"Enter MQTT user login (e.g. mqtt)"},"password":{"label":"MQTT Password","placeholder":"Enter MQTT user password (e.g. pa$vv0rd)"},"is_enabled":{"label":"Client is enable"},"is_ha_enabled":{"label":"Home Assistant"}}')},62:function(e){e.exports=JSON.parse('{"ssid":{"label":"WIFI SSID","placeholder":"Enter SSID of your wifi AP (e.g. MySecretWifi)"},"pass":{"label":"WIFI Password","placeholder":"Enter your connection password (e.g. super-duper-password)"},"ip":{"label":"Local address","placeholder":"Enter static IP address and port of device with ZESP (e.g. 192.168.1.2:8082)"},"mask":{"label":"Local mask address","placeholder":"Enter device network mask (e.g. 255.255.255.0)"},"gw":{"label":"Gateway address","placeholder":"Enter gateway address (e.g. 192.168.1.1)"}}')},63:function(e){e.exports=JSON.parse('{"list":{"title":"Welcome here, stranger!","add_button":"Add a new server","add_message":"There is no servers added. Please, click this big blue button bellow to add your awesome server."},"edit":{"title":"Connection settings","delete_button":"Delete","delete_title":"Delete confirmation","delete_message":"Are you <strong>sure</strong> you want to delete it?<br/>Just asking, no pressure... if you want to continue, smash <span class=\'badge bg-danger\'>Delete</span> button bellow one more time.","save_button":"Save changes","add_button":"Add server","name_input_placeholder":"Enter display name (e.g. My hub4fun)","address_input_placeholder":"Your server address (e.g. 192.168.1.1)"}}')},84:function(e,t,n){},85:function(e,t,n){window.$=window.jQuery=n(18),console.debug=function(){console.log("Debug logs are disabled")}}},[[136,1,2]]]);
//# sourceMappingURL=main.72dbd18e.chunk.js.map
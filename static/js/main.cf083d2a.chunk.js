(this["webpackJsonpnavgurukul-admin"]=this["webpackJsonpnavgurukul-admin"]||[]).push([[0],{371:function(e,a,t){e.exports=t(510)},510:function(e,a,t){"use strict";t.r(a);var r=t(0),n=t.n(r),s=t(18),o=t.n(s),i=t(271),c=t(605),l=t(604),u=t(175),m=t(93),d={login:function(e){var a=e.base_url,t=e.username,r=e.password;console.log("login ");var n={method:"POST",body:JSON.stringify({type:"m.login.password",user:t,password:r})};localStorage.setItem("base_url",a);var s=window.decodeURIComponent(a)+"/_matrix/client/r0/login";return m.a.fetchJson(s,n).then((function(e){var a=e.json;localStorage.setItem("home_server",a.home_server),localStorage.setItem("user_id",a.user_id),localStorage.setItem("access_token",a.access_token),localStorage.setItem("device_id",a.device_id)}))},logout:function(){return console.log("logout "),localStorage.removeItem("access_token"),Promise.resolve()},checkError:function(e){var a=e.status;return console.log("checkError "+a),401===a||403===a?Promise.reject():Promise.resolve()},checkAuth:function(){var e=localStorage.getItem("access_token");return console.log("checkAuth "+e),"string"==typeof e?Promise.resolve():Promise.reject()},getPermissions:function(){return Promise.resolve()}},b=t(151),v=t(21),f=t(70),g=function(e){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},t=localStorage.getItem("access_token");return console.log("httpClient "+e),null!=t&&(a.user={authenticated:!0,token:"Bearer ".concat(t)}),m.a.fetchJson(e,a)},p=function(e,a){return e.indexOf("navgurukul.org")>-1?e:"users"===a||"connections"===a?"@"+e+":navgurukul.org":"rooms"===a?"#"+e+":navgurukul.org":e},h=function(e){var a=localStorage.getItem("base_url"),t=/^mxc:\/\/([^/]+)\/(\w+)/.exec(e);if(console.log("mxcClient "+t),null==t)return null;var r=t[1],n=t[2];return"".concat(a,"/_matrix/media/r0/thumbnail/").concat(r,"/").concat(n,"?width=24&height=24&method=scale")},_={users:{path:"/_synapse/admin/v2/users",map:function(e){return Object(v.a)(Object(v.a)({},e),{},{id:e.name.split(":")[0].slice(1),avatar_src:h(e.avatar_url),is_guest:!!e.is_guest,admin:!!e.admin,deactivated:!!e.deactivated,creation_ts_ms:1e3*e.creation_ts})},data:"users",total:function(e){return e.total},create:function(e){return{endpoint:"/_synapse/admin/v2/users/".concat(e.id),body:e,method:"PUT"}},delete:function(e){return{endpoint:"/_synapse/admin/v1/deactivate/".concat(p(e,"users")),body:{erase:!0,id:e},method:"POST"}}},rooms:{path:"/_synapse/admin/v1/rooms",map:function(e){return Object(v.a)(Object(v.a)({},e),{},{id:e.room_id,alias:e.canonical_alias,members:e.joined_members,is_encrypted:!!e.encryption,federatable:!!e.federatable,public:!!e.public})},data:"rooms",total:function(e){return e.total_rooms}},connections:{path:"/_synapse/admin/v1/whois",map:function(e){return Object(v.a)(Object(v.a)({},e),{},{id:p(e.user_id)})},data:"connections"},servernotices:{map:function(e){return{id:e.event_id}},create:function(e){return{endpoint:"/_synapse/admin/v1/send_server_notice",body:{user_id:e.id,content:{msgtype:"m.text",body:e.body}},method:"POST"}}}};function E(e,a){if(null!==a)return a}function y(e){return"DESC"===e?"b":"f"}var j={getList:function(e,a){console.log("getList "+e);var t=a.filter,r=t.user_id,n=t.guests,s=t.deactivated,o=a.pagination,i=o.page,c=o.perPage,l=a.sort,u=l.field,m=l.order,d=(i-1)*c,b={from:d,limit:c,user_id:r,guests:n,deactivated:s,order_by:u,dir:y(m)},v=localStorage.getItem("base_url");if(!v||!(e in _))return Promise.reject();var p=_[e],h=v+p.path,E="".concat(h,"?").concat(Object(f.stringify)(b));return g(E).then((function(e){var a=e.json;return{data:a[p.data].map(p.map),total:p.total(a,d,c)}}))},getOne:function(e,a){console.log("getOne "+e);var t=localStorage.getItem("base_url");if(!t||!(e in _))return Promise.reject();var r=_[e];a.id=p(a.id,e);var n=t+r.path;return g("".concat(n,"/").concat(a.id)).then((function(e){var a=e.json;return{data:r.map(a)}}))},getMany:function(e,a){console.log("getMany "+e);var t=localStorage.getItem("base_url");if(!t||!(e in _))return Promise.reject();var r=_[e],n=t+r.path;return Promise.all(a.ids.map((function(a){return console.log(a),g("".concat(n,"/").concat(p(a,e)))}))).then((function(e){return{data:e.map((function(e){var a=e.json;return r.map(a)}))}}))},getManyReference:function(e,a){console.log("getManyReference "+e);var t=a.pagination,r=t.page,n=t.perPage,s=a.sort,o=s.field,i=s.order,c={sort:JSON.stringify([o,i]),range:JSON.stringify([(r-1)*n,r*n-1]),filter:JSON.stringify(Object(v.a)(Object(v.a)({},a.filter),{},Object(b.a)({},a.target,a.id)))},l=localStorage.getItem("base_url");if(!l||!(e in _))return Promise.reject();var u=l+_[e].path,m="".concat(u,"?").concat(Object(f.stringify)(c));return g(m).then((function(e){var a=e.headers;return{data:e.json,total:parseInt(a.get("content-range").split("/").pop(),10)}}))},update:function(e,a){console.log("update "+e);var t=localStorage.getItem("base_url");if(!t||!(e in _))return Promise.reject();var r=_[e],n=t+r.path;return g("".concat(n,"/").concat(p(a.data.id,e)),{method:"PUT",body:JSON.stringify(a.data,E)}).then((function(e){var a=e.json;return{data:r.map(a)}}))},updateMany:function(e,a){console.log("updateMany "+e);var t=localStorage.getItem("base_url");if(!t||!(e in _))return Promise.reject();var r=t+_[e].path;return Promise.all(a.ids.map((function(a){return g("".concat(r,"/").concat(p(a,e)))}),{method:"PUT",body:JSON.stringify(a.data,E)})).then((function(e){return{data:e.map((function(e){return e.json}))}}))},create:function(e,a){console.log("create "+e);var t=localStorage.getItem("base_url");if(!t||!(e in _))return Promise.reject();var r=_[e];if(!("create"in r))return Promise.reject();a.data.id=p(a.data.id,e),a.data.threepids=[],a.data.email&&a.data.threepids.push({medium:"email",address:a.data.email}),a.data.msisdn&&a.data.threepids.push({medium:"msisdn",address:a.data.msisdn});var n=r.create(a.data),s=t+n.endpoint;return g(s,{method:n.method,body:JSON.stringify(n.body,E)}).then((function(e){var a=e.json;return{data:r.map(a)}}))},createMany:function(e,a){console.log("createMany "+e);var t=localStorage.getItem("base_url");if(!t||!(e in _))return Promise.reject();var r=_[e];return"create"in r?Promise.all(a.ids.map((function(e){a.data.id=e;var n=r.create(a.data),s=t+n.endpoint;return g(s,{method:n.method,body:JSON.stringify(n.body,E)})}))).then((function(e){return{data:e.map((function(e){return e.json}))}})):Promise.reject()},delete:function(e,a){console.log("delete "+e);var t=localStorage.getItem("base_url");if(!t||!(e in _))return Promise.reject();var r=_[e];if("delete"in r){var n=r.delete(a.id),s=t+n.endpoint;return console.log(23,n.body),g(s,{method:n.method,body:JSON.stringify(n.body)}).then((function(e){return{data:e.json}}))}console.log(12,a);var o=t+r.path;return g("".concat(o,"/").concat(a.id),{method:"DELETE",body:JSON.stringify(a.data,E)}).then((function(e){return{data:e.json}}))},deleteMany:function(e,a){console.log("deleteMany "+e,a);var t=localStorage.getItem("base_url");if(!t||!(e in _))return Promise.reject();var r=_[e];if("delete"in r)return Promise.all(a.ids.map((function(e){var a=r.delete(e),n=t+a.endpoint;return console.log(n),g(n,{method:a.method,body:JSON.stringify(a.body)})}))).then((function(e){return{data:e.map((function(e){return e.json}))}}));var n=t+r.path;return console.log(n),Promise.all(a.ids.map((function(t){return console.log(t),g("".concat(n,"/").concat(p(t,e)),{method:"DELETE",body:JSON.stringify(a.data,E)})}))).then((function(e){return{data:e.map((function(e){return e.json}))}}))}},O=t(619),S=t(299),k=t.n(S),w=t(300),P=t.n(w),N=t(303),A=t.n(N),I=t(323),z=t(613),C=t(614),M=t(35),x=t(325),B=t(607),D=t(606),T=t(588),R=t(589),J=t(165),L=t(179),V=t(572),U=t(612),G=t(621),Z=t(620),F=t(287),W=t(591),H=t(615),q=t(622),$=t(595),K=t(596),Q=t(618),X=t(616),Y=t(597),ee=t(611),ae=t(598),te=t(89),re=t(29),ne=t(210),se=t(257),oe=t(576),ie=t(69),ce=t(215),le=t.n(ce),ue=t(285),me=t.n(ue),de=t(578),be=t(580),ve=t(581),fe=t(579),ge=function(e){var a=e.open,t=e.loading,r=e.onClose,s=e.onSend,o=Object(M.a)(),i=function(e){return n.a.createElement(L.a,e,n.a.createElement(V.a,{label:"resources.servernotices.action.send"}),n.a.createElement(re.a,{label:"ra.action.cancel",onClick:r},n.a.createElement(me.a,null)))};return n.a.createElement(de.a,{open:a,onClose:r,loading:t},n.a.createElement(fe.a,null,o("resources.servernotices.action.send")),n.a.createElement(be.a,null,n.a.createElement(ve.a,null,o("resources.servernotices.helper.send")),n.a.createElement(Z.a,{toolbar:n.a.createElement(i,null),submitOnEnter:!1,redirect:!1,save:s},n.a.createElement(F.a,{source:"body",label:"resources.servernotices.fields.body",fullWidth:!0,multiline:!0,rows:"4",resettable:!0,validate:Object(J.c)()}))))},pe=function(e){var a=e.record,t=Object(r.useState)(!1),s=Object(te.a)(t,2),o=s[0],i=s[1],c=Object(ne.a)(),l=Object(se.a)("servernotices"),u=Object(te.a)(l,2),m=u[0],d=u[1].loading,b=function(){return i(!1)};return n.a.createElement(r.Fragment,null,n.a.createElement(re.a,{label:"resources.servernotices.send",onClick:function(){return i(!0)},disabled:d},n.a.createElement(le.a,null)),n.a.createElement(ge,{open:o,onClose:b,onSend:function(e){m({payload:{data:Object(v.a)({id:a.id},e)}},{onSuccess:function(){c("resources.servernotices.action.send_success"),b()},onFailure:function(){return c("resources.servernotices.action.send_failure","error")}})}}))},he=function(e){var a=e.selectedIds,t=Object(r.useState)(!1),s=Object(te.a)(t,2),o=s[0],i=s[1],c=Object(ne.a)(),l=Object(oe.a)(),u=Object(ie.a)(),m=Object(te.a)(u,2),d=m[0],b=m[1].loading,v=function(){return i(!1)};return n.a.createElement(r.Fragment,null,n.a.createElement(re.a,{label:"resources.servernotices.send",onClick:function(){return i(!0)},disabled:b},n.a.createElement(le.a,null)),n.a.createElement(ge,{open:o,onClose:v,onSend:function(e){d({type:"createMany",resource:"servernotices",payload:{ids:a,data:e}},{onSuccess:function(e){e.data;c("resources.servernotices.action.send_success"),l("users"),v()},onFailure:function(e){return c("resources.servernotices.action.send_failure","error")}})}}))},_e=t(90),Ee=Object(_e.a)({small:{height:"40px",width:"40px"},large:{height:"120px",width:"120px",float:"right"}}),ye=function(e){return n.a.createElement(I.a,Object.assign({},e,{rowsPerPageOptions:[10,25,50,100,500,1e3]}))},je=function(e){return n.a.createElement(z.a,e,n.a.createElement(C.a,{source:"guests",alwaysOn:!0}),n.a.createElement(C.a,{label:"resources.users.fields.show_deactivated",source:"deactivated",alwaysOn:!0}))},Oe=function(e){var a=Object(M.a)();return n.a.createElement(r.Fragment,null,n.a.createElement(he,e),n.a.createElement(x.a,Object.assign({},e,{label:"resources.users.action.erase",title:a("resources.users.helper.erase")})))},Se=function(e){var a=e.source,t=e.className,r=e.record,s=void 0===r?{}:r;return n.a.createElement(O.a,{src:s[a],className:t})},ke=function(e){var a=Ee();return n.a.createElement(B.a,Object.assign({},e,{filters:n.a.createElement(je,null),filterDefaultValues:{guests:!0,deactivated:!1},bulkActionButtons:n.a.createElement(Oe,null),pagination:n.a.createElement(ye,null)}),n.a.createElement(D.a,{rowClick:"edit"},n.a.createElement(Se,{source:"avatar_src",sortable:!1,className:a.small}),n.a.createElement(T.a,{source:"id",sortable:!1}),n.a.createElement(T.a,{source:"displayname",sortable:!1}),n.a.createElement(R.a,{source:"is_guest",sortable:!1}),n.a.createElement(R.a,{source:"admin",sortable:!1}),n.a.createElement(R.a,{source:"deactivated",sortable:!1})))},we=Object(J.b)(/^[a-z0-9._=\-/][a-z0-9._=\-/][a-z0-9._=\-/][a-z0-9._=\-/][a-z0-9._=\-/]+/,"synapseadmin.users.invalid_user_id"),Pe=Object(J.b)(/^[a-zA-Z0-9.!#$%&\u2019*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.+([a-zA-Z0-9-][a-zA-Z0-9-]+)*$/,"Enter Proper Email Address"),Ne=function(e){var a=Object(M.a)();return n.a.createElement(L.a,e,n.a.createElement(V.a,{submitOnEnter:!0}),n.a.createElement(U.a,{label:"resources.users.action.erase",title:a("resources.users.helper.erase")}),n.a.createElement(pe,null))},Ae=function(e){return n.a.createElement(G.a,e,n.a.createElement(Z.a,null,n.a.createElement(F.a,{source:"id",autoComplete:"off",validate:we}),n.a.createElement(F.a,{source:"displayname"}),n.a.createElement(W.a,{source:"password",autoComplete:"new-password"}),n.a.createElement(C.a,{source:"admin"}),n.a.createElement(F.a,{source:"email",autoComplete:"off",validate:Pe}),n.a.createElement(F.a,{source:"msisdn",autoComplete:"off"})))},Ie=function(e){var a=e.record,t=Object(M.a)();return n.a.createElement("span",null,t("resources.users.name",{smart_count:1})," ",a?'"'.concat(a.displayname,'"'):"")},ze=function(e){var a=Ee();return n.a.createElement(H.a,Object.assign({},e,{title:n.a.createElement(Ie,null)}),n.a.createElement(q.a,{toolbar:n.a.createElement(Ne,null)},n.a.createElement($.a,{label:"resources.users.name",icon:n.a.createElement(k.a,null)},n.a.createElement(Se,{source:"avatar_src",sortable:!1,className:a.large}),n.a.createElement(F.a,{source:"id",disabled:!0}),n.a.createElement(F.a,{source:"displayname"}),n.a.createElement(W.a,{source:"password",autoComplete:"new-password"}),n.a.createElement(C.a,{source:"admin"}),n.a.createElement(C.a,{source:"deactivated",helperText:"resources.users.helper.deactivate"}),n.a.createElement(K.a,{source:"creation_ts_ms",showTime:!0,options:{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}}),n.a.createElement(T.a,{source:"consent_version"})),n.a.createElement($.a,{label:"resources.users.threepid",icon:n.a.createElement(P.a,null),path:"threepid"},n.a.createElement(Q.a,{source:"threepids"},n.a.createElement(X.a,null,n.a.createElement(Y.a,{source:"medium",choices:[{id:"email",name:"resources.users.email"},{id:"msisdn",name:"resources.users.msisdn"}],key:"SelectInput"}),n.a.createElement(F.a,{source:"address",key:"TextInput"})))),n.a.createElement($.a,{label:"resources.connections.name",icon:n.a.createElement(A.a,null),path:"connections"},n.a.createElement(ee.a,{reference:"connections",source:"id",addLabel:!1,link:!1},n.a.createElement(ae.a,{source:"devices[].sessions[0].connections",label:"resources.connections.name"},n.a.createElement(D.a,{style:{width:"100%"}},n.a.createElement(T.a,{source:"ip",sortable:!1}),n.a.createElement(K.a,{source:"last_seen",showTime:!0,options:{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"},sortable:!1}),n.a.createElement(T.a,{source:"user_agent",sortable:!1,style:{width:"100%"}})))))))},Ce=t(8),Me=t(617),xe=t(623),Be=t(599),De=t(600),Te=t(12),Re=t.n(Te),Je=t(45),Le=t(336),Ve=t(624),Ue=t(220),Ge=t.n(Ue),Ze=t(307),Fe=t.n(Ze),We=t(309),He=t.n(We),qe=t(113),$e=t.n(qe),Ke=t(172),Qe=t.n(Ke),Xe=function(e){return n.a.createElement(I.a,Object.assign({},e,{rowsPerPageOptions:[10,25,50,100,500,1e3]}))},Ye=function(e){var a=e.source,t=e.record,r=void 0===t?{}:t,s=e.emptyText,o=Object(M.a)(),i=Re()(r,a),c=!1===i?"ra.boolean.false":"ra.boolean.true";return!1===i||!0===i?n.a.createElement(Je.a,{component:"span",variant:"body2"},n.a.createElement(Le.a,{title:o(c,{_:c})},!0===i?n.a.createElement(Ge.a,{"data-testid":"true",htmlColor:"limegreen"}):n.a.createElement(Fe.a,{"data-testid":"false",color:"error"}))):n.a.createElement(Je.a,{component:"span",variant:"body2"},s)},ea=function(e){var a=e.record,t=Object(M.a)(),r="";return a&&(r=""!==a.name?a.name:a.id),n.a.createElement("span",null,t("resources.rooms.name",1)," ",r)},aa=function(e){var a=Object(M.a)();return n.a.createElement(Me.a,Object.assign({},e,{title:n.a.createElement(ea,null)}),n.a.createElement(xe.a,null,n.a.createElement(Be.a,{label:"synapseadmin.rooms.tabs.basic",icon:n.a.createElement($e.a,null)},n.a.createElement(T.a,{source:"room_id"}),n.a.createElement(T.a,{source:"name"}),n.a.createElement(T.a,{source:"canonical_alias"}),n.a.createElement(T.a,{source:"creator"})),n.a.createElement(Be.a,{label:"synapseadmin.rooms.tabs.detail",icon:n.a.createElement(He.a,null),path:"detail"},n.a.createElement(T.a,{source:"joined_members"}),n.a.createElement(T.a,{source:"joined_local_members"}),n.a.createElement(T.a,{source:"state_events"}),n.a.createElement(T.a,{source:"version"}),n.a.createElement(T.a,{source:"encryption",emptyText:a("resources.rooms.enums.unencrypted")})),n.a.createElement(Be.a,{label:"synapseadmin.rooms.tabs.permission",icon:n.a.createElement(Qe.a,null),path:"permission"},n.a.createElement(R.a,{source:"federatable"}),n.a.createElement(R.a,{source:"public"}),n.a.createElement(De.a,{source:"join_rules",choices:[{id:"public",name:"resources.rooms.enums.join_rules.public"},{id:"knock",name:"resources.rooms.enums.join_rules.knock"},{id:"invite",name:"resources.rooms.enums.join_rules.invite"},{id:"private",name:"resources.rooms.enums.join_rules.private"}]}),n.a.createElement(De.a,{source:"guest_access",choices:[{id:"can_join",name:"resources.rooms.enums.guest_access.can_join"},{id:"forbidden",name:"resources.rooms.enums.guest_access.forbidden"}]}),n.a.createElement(De.a,{source:"history_visibility",choices:[{id:"invited",name:"resources.rooms.enums.history_visibility.invited"},{id:"joined",name:"resources.rooms.enums.history_visibility.joined"},{id:"shared",name:"resources.rooms.enums.history_visibility.shared"},{id:"world_readable",name:"resources.rooms.enums.history_visibility.world_readable"}]}))))},ta=function(e){var a=Object.assign({},e),t=Object(M.a)();return n.a.createElement(z.a,a,n.a.createElement(Ve.a,{label:t("resources.rooms.fields.joined_local_members"),source:"joined_local_members",defaultValue:!1,style:{marginBottom:8}}),n.a.createElement(Ve.a,{label:t("resources.rooms.fields.state_events"),source:"state_events",defaultValue:!1,style:{marginBottom:8}}),n.a.createElement(Ve.a,{label:t("resources.rooms.fields.version"),source:"version",defaultValue:!1,style:{marginBottom:8}}),n.a.createElement(Ve.a,{label:t("resources.rooms.fields.federatable"),source:"federatable",defaultValue:!1,style:{marginBottom:8}}))};var ra=Object(Ce.c)((function(e){return{roomfilters:e.admin.resources.rooms.list.params.displayedFilters}}))((function(e){var a=Object.assign({},e),t=a.roomfilters,r=!(!t||!t.joined_local_members),s=!(!t||!t.state_events),o=!(!t||!t.version),i=!(!t||!t.federatable);return n.a.createElement(B.a,Object.assign({},a,{pagination:n.a.createElement(Xe,null),sort:{field:"name",order:"ASC"},filters:n.a.createElement(ta,null)}),n.a.createElement(D.a,{rowClick:"show"},n.a.createElement(Ye,{source:"is_encrypted",sortBy:"encryption",label:n.a.createElement(Ge.a,null)}),n.a.createElement(T.a,{source:"name"}),n.a.createElement(T.a,{source:"joined_members"}),r&&n.a.createElement(T.a,{source:"joined_local_members"}),s&&n.a.createElement(T.a,{source:"state_events"}),o&&n.a.createElement(T.a,{source:"version"}),i&&n.a.createElement(R.a,{source:"federatable"}),n.a.createElement(R.a,{source:"public"})))})),na=t(326),sa=t(601),oa=t(602),ia=t(178),ca=t(23),la=t(517),ua=t(587),ma=t(603),da=t(329),ba=t(514),va=t(173),fa=t.n(va),ga=Object(_e.a)((function(e){return{main:{display:"flex",flexDirection:"column",minHeight:"calc(100vh - 1em)",alignItems:"center",justifyContent:"flex-start",background:"url(./images/floating-cogs.svg)",backgroundColor:"#f9f9f9",backgroundRepeat:"no-repeat",backgroundSize:"cover"},card:{minWidth:"30em",marginTop:"6em",marginBottom:"6em"},avatar:{margin:"1em",display:"flex",justifyContent:"center"},icon:{backgroundColor:e.palette.secondary.main},hint:{marginTop:"1em",display:"flex",justifyContent:"center",color:e.palette.grey[500]},form:{padding:"0 1em 1em 1em"},input:{marginTop:"1em"},actions:{padding:"0 1em 1em 1em"},serverVersion:{color:"#9e9e9e",fontFamily:"Roboto, Helvetica, Arial, sans-serif",marginBottom:"1em",marginLeft:"0.5em"}}})),pa=function(e){var a=e.theme,t=ga({theme:a}),s=Object(sa.a)(),o=Object(ne.a)(),i=Object(r.useState)(!1),c=Object(te.a)(i,2),l=c[0],u=c[1],d=Object(M.a)(),b=function(e){var a=e.meta,t=(a=void 0===a?{}:a).touched,r=a.error,s=Object.assign({},e.input),o=Object(na.a)(e,["meta","input"]);return n.a.createElement(la.a,Object.assign({error:!(!t||!r),helperText:t&&r},s,o,{fullWidth:!0}))},v=function(e){var a=e.formData,s=Object(ca.e)(),o=Object(r.useState)(""),i=Object(te.a)(o,2),c=i[0],u=i[1];return Object(r.useEffect)((function(e){if(a.base_url&&a.base_url.match(/^(http|https):\/\/[a-zA-Z0-9\-.]+$/)){var t="".concat(a.base_url,"/_synapse/admin/v1/server_version");m.a.fetchJson(t,{method:"GET"}).then((function(e){var a=e.json;u("".concat(d("synapseadmin.auth.server_version")," ").concat(a.server_version))})).catch((function(e){u("")}))}}),[a.base_url]),n.a.createElement("div",null,n.a.createElement("div",{className:t.input},n.a.createElement(F.a,{autoFocus:!0,name:"username",component:b,label:d("ra.auth.username"),disabled:l,onBlur:function(e){if(!a.base_url){var t=function(e){if(!e)return null;var a=e.match(/@[a-zA-Z0-9._=\-/]+:([a-zA-Z0-9\-.]+\.[a-zA-Z]+)/);return a?a[1]:null}(a.username),r="https://".concat(t,"/.well-known/matrix/client");t&&m.a.fetchJson(r,{method:"GET"}).then((function(e){var a=e.json;s.change("base_url",a["m.homeserver"].base_url)})).catch((function(e){s.change("base_url","https://".concat(t))}))}},fullWidth:!0})),n.a.createElement("div",{className:t.input},n.a.createElement(W.a,{name:"password",component:b,label:d("ra.auth.password"),type:"password",disabled:l,fullWidth:!0})),n.a.createElement("div",{className:t.input},n.a.createElement(F.a,{name:"base_url",component:b,label:d("synapseadmin.auth.base_url"),disabled:l,fullWidth:!0})),n.a.createElement("div",{className:t.serverVersion},c))};return n.a.createElement(ca.b,{initialValues:{base_url:"https://m.navgurukul.org"},onSubmit:function(e){u(!0),s(e).catch((function(e){u(!1),o("string"===typeof e?e:"undefined"!==typeof e&&e.message?e.message:"ra.auth.sign_in_error","warning")}))},validate:function(e){var a={};return e.username||(a.username=d("ra.validation.required")),e.password||(a.password=d("ra.validation.required")),e.base_url?e.base_url.match(/^(http|https):\/\//)?e.base_url.match(/^(http|https):\/\/[a-zA-Z0-9\-.]+(:\d{1,5})?$/)||(a.base_url=d("synapseadmin.auth.url_error")):a.base_url=d("synapseadmin.auth.protocol_error"):a.base_url=d("ra.validation.required"),a},render:function(e){var a=e.handleSubmit;return n.a.createElement("form",{onSubmit:a,noValidate:!0},n.a.createElement("div",{className:t.main},n.a.createElement(ua.a,{className:t.card},n.a.createElement("div",{className:t.avatar},n.a.createElement(O.a,{className:t.icon},n.a.createElement(fa.a,null))),n.a.createElement("div",{className:t.hint},d("synapseadmin.auth.welcome")),n.a.createElement("div",{className:t.form},n.a.createElement(oa.a,null,(function(e){return n.a.createElement(v,e)}))),n.a.createElement(ma.a,{className:t.actions},n.a.createElement(da.a,{variant:"contained",type:"submit",color:"primary",disabled:l,className:t.button,fullWidth:!0},l&&n.a.createElement(ba.a,{size:25,thickness:2}),d("ra.auth.sign_in")))),n.a.createElement(ia.a,null)))}})},ha=t(321),_a=t.n(ha),Ea=t(101),ya=t.n(Ea),ja=Object(v.a)(Object(v.a)({},ya.a),{},{synapseadmin:{auth:{base_url:"Heimserver URL",welcome:"Willkommen bei Synapse-admin",server_version:"Synapse Version",username_error:"Bitte vollst\xe4ndigen Nutzernamen angeben: '@user:domain'",protocol_error:"Die URL muss mit 'http://' oder 'https://' beginnen",url_error:"Keine g\xfcltige Matrix Server URL"},users:{invalid_user_id:"Muss eine vollst\xe4ndige Matrix Benutzer-ID sein, z.B. @benutzer_id:homeserver"},rooms:{details:"Raumdetails",tabs:{basic:"Allgemein",members:"Mitglieder",detail:"Details",permission:"Berechtigungen"}}},resources:{users:{backtolist:"Zur\xfcck zur Liste",name:"Benutzer",email:"E-Mail",msisdn:"Telefon",threepid:"E-Mail / Telefon",fields:{avatar:"Avatar",id:"Benutzer-ID",name:"Name",is_guest:"Gast",admin:"Admin",deactivated:"Deaktiviert",guests:"Zeige G\xe4ste",show_deactivated:"Zeige deaktivierte Benutzer",user_id:"Suche Benutzer",displayname:"Anzeigename",password:"Passwort",avatar_url:"Avatar URL",avatar_src:"Avatar",medium:"Medium",threepids:"3PIDs",address:"Adresse",creation_ts_ms:"Zeitpunkt der Erstellung",consent_version:"Zugestimmte Gesch\xe4ftsbedingungen"},helper:{deactivate:"Deaktivierte Nutzer k\xf6nnen nicht wieder aktiviert werden.",erase:"DSGVO konformes L\xf6schen der Benutzerdaten"},action:{erase:"L\xf6sche Benutzerdaten"}},rooms:{name:"Raum |||| R\xe4ume",fields:{room_id:"Raum-ID",name:"Name",canonical_alias:"Alias",joined_members:"Mitglieder",joined_local_members:"Lokale Mitglieder",state_events:"Ereignisse",version:"Version",is_encrypted:"Verschl\xfcsselt",encryption:"Verschl\xfcsselungs-Algorithmus",federatable:"F\xf6\xadde\xadrierbar",public:"\xd6ffentlich",creator:"Ersteller",join_rules:"Beitrittsregeln",guest_access:"Gastzugriff",history_visibility:"Historie-Sichtbarkeit"},enums:{join_rules:{public:"\xd6ffentlich",knock:"Auf Anfrage",invite:"Nur auf Einladung",private:"Privat"},guest_access:{can_join:"G\xe4ste k\xf6nnen beitreten",forbidden:"G\xe4ste k\xf6nnen nicht beitreten"},history_visibility:{invited:"Ab Einladung",joined:"Ab Beitritt",shared:"Ab Setzen der Einstellung",world_readable:"Jeder"},unencrypted:"Nicht verschl\xfcsselt"}},connections:{name:"Verbindungen",fields:{last_seen:"Datum",ip:"IP-Adresse",user_agent:"User Agent"}},servernotices:{name:"Serverbenachrichtigungen",send:"Servernachricht versenden",fields:{body:"Nachricht"},action:{send:"Sende Nachricht",send_success:"Nachricht erfolgreich versendet.",send_failure:"Beim Versenden ist ein Fehler aufgetreten."},helper:{send:'Sendet eine Serverbenachrichtigung an die ausgew\xe4hlten Nutzer. Hierf\xfcr muss das Feature "Server Notices" auf dem Server aktiviert sein.'}}},ra:Object(v.a)(Object(v.a)({},ya.a.ra),{},{auth:Object(v.a)(Object(v.a)({},ya.a.ra.auth),{},{auth_check_error:"Anmeldung fehlgeschlagen"}),input:Object(v.a)(Object(v.a)({},ya.a.ra.input),{},{password:Object(v.a)(Object(v.a)({},ya.a.ra.input.password),{},{toggle_hidden:"Anzeigen",toggle_visible:"Verstecken"})}),notification:Object(v.a)(Object(v.a)({},ya.a.ra.notifiaction),{},{logged_out:"Abgemeldet"})})}),Oa=t(174),Sa={de:ja,en:Object(v.a)(Object(v.a)({},Oa.a),{},{synapseadmin:{auth:{homeserver:"Homeserver",welcome:"Welcome to Navgurukul Admin",base_url:"Homeserver URL",username_error:"Please enter fully qualified user ID: '@user:domain'",protocol_error:"URL has to start with 'http://' or 'https://'",url_error:"Not a valid Matrix server URL"},users:{invalid_user_id:"Please enter a proper username."},rooms:{tabs:{basic:"Basic",members:"Members",detail:"Details",permission:"Permissions"}}},resources:{users:{backtolist:"Back to list",name:"User |||| Users",email:"Email",msisdn:"Phone",threepid:"Email / Phone",fields:{avatar:"Avatar",id:"User-ID",name:"Name",is_guest:"Guest",admin:"Admin",deactivated:"Deactivated",guests:"Show guests",show_deactivated:"Show deactivated members",user_id:"Search Member",displayname:"Displayname",password:"Password",avatar_url:"Avatar URL",avatar_src:"Avatar",medium:"Medium",threepids:"3PIDs",address:"Address",creation_ts_ms:"Creation timestamp",consent_version:"Consent version"},helper:{deactivate:"Deactivated members cannot be reactivated",erase:"Mark the member as GDPR-erased"},action:{erase:"Erase member data"}},rooms:{name:"Room |||| Rooms",fields:{room_id:"Room-ID",name:"Name",canonical_alias:"Alias",joined_members:"Members",joined_local_members:"local members",state_events:"State events",version:"Version",is_encrypted:"Encrypted",encryption:"Encryption",federatable:"Federatable",public:"Public",creator:"Creator",join_rules:"Join rules",guest_access:"Guest access",history_visibility:"History visibility"},enums:{join_rules:{public:"Public",knock:"Knock",invite:"Invite",private:"Private"},guest_access:{can_join:"Guests can join",forbidden:"Guests can not join"},history_visibility:{invited:"Since invited",joined:"Since joined",shared:"Since shared",world_readable:"Anyone"},unencrypted:"Unencrypted"}},connections:{name:"Connections",fields:{last_seen:"Date",ip:"IP address",user_agent:"User agent"}},servernotices:{name:"Server Notices",send:"Send server notices",fields:{body:"Message"},action:{send:"Send note",send_success:"Server notice successfully sent.",send_failure:"An error has occurred."},helper:{send:'Sends a server notice to the selected users. The feature "Server Notices" has to be activated at the server.'}}}})},ka=Object(u.a)((function(e){return Sa[e]?Sa[e]:Sa.en}),Object(i.a)()),wa=function(){return n.a.createElement(c.a,{loginPage:pa,authProvider:d,dataProvider:j,i18nProvider:ka},n.a.createElement(l.a,{name:"users",list:ke,create:Ae,edit:ze,icon:_a.a}),n.a.createElement(l.a,{name:"rooms",list:ra,show:aa,icon:qe.ViewListIcon}),n.a.createElement(l.a,{name:"connections"}),n.a.createElement(l.a,{name:"servernotices"}))};o.a.render(n.a.createElement(wa,null),document.getElementById("root"))}},[[371,1,2]]]);
//# sourceMappingURL=main.cf083d2a.chunk.js.map
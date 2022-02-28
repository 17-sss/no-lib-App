(()=>{"use strict";const t={NOT_FOUND_TARGET:"지정하려는 타켓을 찾을 수 없습니다.",NOT_FOUND_ROUTER_INFO:"페이지 정보를 담고 있는 RouterInfo를 불러올 수 없습니다.",RESPONSE_IS_NULL:"서버에서 요청에 대한 응답 값을 가져올 수 없습니다."};class e extends Error{constructor({msgType:e,customMessage:n="",name:s=""}){super(`${s&&`[${s}] `}${n||e&&`${t[e]}`||""}`)}}const n=e,s=class{constructor(t,e){this.setStateCallback=e,this._notExec=!1,this._recentChangedKeys={prevKeys:[],currKeys:[],largeKeySet:new Set},this._observers=new Set,this._state=t,this._prevState=t}get state(){return this._state}get recentChangedKeys(){return this._recentChangedKeys}set state(t){this._state=Object.assign({},t),this.setStateCallback&&this.setStateCallback(),this.updateRecentChangedKeys(),this._notExec?this._notExec=!1:this.exec()}setState(t,e){e&&void 0!==e.notExec&&(this._notExec=e.notExec),this._prevState=Object.assign({},this._state),this.state=Object.assign(Object.assign({},this._state),t)}exec(){this._observers.forEach((t=>t()))}add(t){this._observers.add(t)}remove(t){this._observers.delete(t)}clear(){this._observers.clear()}clearLargeKeySet(){this._recentChangedKeys.largeKeySet.clear()}updateRecentChangedKeys(){var t;Object.values(this._recentChangedKeys).every((t=>!t.length))||(this._recentChangedKeys.prevKeys=[...this._recentChangedKeys.currKeys]),this._recentChangedKeys.currKeys=null!==(t=this.getRecentKeys())&&void 0!==t?t:[];const{largeKeySet:e,currKeys:n}=this._recentChangedKeys;[...e,...n].forEach((t=>this._recentChangedKeys.largeKeySet.add(t)))}getRecentKeys(){if(!this._state||!this._prevState)return null;const t=Object.entries(this._state),e=Object.entries(this._prevState),n=[];for(let s=0;s<t.length;s++){const[a,i]=t[s],[o,r]=e[s];a===o&&JSON.stringify(i)!==JSON.stringify(r)&&n.push(a)}return n}};function a(t){const e=(t=>localStorage.getItem(t))(t);return e?JSON.parse(e):null}function i(t,e){return((t,e)=>localStorage.setItem(t,e))(t,JSON.stringify(e))}var o,r=function(t,e,n,s){return new(n||(n=Promise))((function(a,i){function o(t){try{c(s.next(t))}catch(t){i(t)}}function r(t){try{c(s.throw(t))}catch(t){i(t)}}function c(t){var e;t.done?a(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(o,r)}c((s=s.apply(t,e||[])).next())}))};function c({type:t,options:e}={type:"getPost"}){return r(this,void 0,void 0,(function*(){try{const n=((t,e)=>{const n="http://localhost:4000/api",s="getPost"===t?"post":t;return void 0!==e&&"getPost"===t?`${n}/${s}/${e}`:`${n}/${s}`})(t,null==e?void 0:e.id),s=yield fetch(n,e);if(!(200<=s.status&&s.status<400))throw new Error(`[!] API : status - ${s.status}`);return yield s.json()}catch(t){return console.error(t.message),null}}))}function l(t){return r(this,void 0,void 0,(function*(){try{const e=yield c();if(!e||!e.data)throw new n({msgType:"RESPONSE_IS_NULL",customMessage:t});const{data:s}=e;return s.forEach(((t,e)=>{const{createdDate:n}=t;n&&"string"==typeof n&&(s[e].createdDate=new Date(n))})),s.sort(((t,e)=>t.id&&e.id?e.id-t.id:0)),{data:s}}catch(t){const{message:e}=t;return console.error(t),{message:e}}}))}const d={postData:[],editId:-1,isInit:!1,isRefresh:!1,filterOptions:{author:"",searchWord:"",isDesc:void 0,numPost:5,pageNum:1},numPostList:[5,10,20,30,50,100]},u="board_main",h=new s(null!==(o=function(){const t=a(u);return t?(t.postData.forEach(((e,n)=>{const{createdDate:s}=e;s&&"string"==typeof s&&(t.postData[n].createdDate=new Date(s))})),t):null}())&&void 0!==o?o:Object.assign({},d),(()=>i(u,h.state)));function p({filterOptions:t,postData:e,isFullData:n}){const{author:s,isDesc:a,numPost:i,pageNum:o,searchWord:r}=t,c=function(...t){return e=>t.reduce(((t,e)=>e(t)),e)}(function(t){return e=>t?e.filter((e=>e.author===t)):e}(s),function(t){return e=>{if(!t)return e;const n=t.replace(/\s+/g,"");return e.filter((({subject:t})=>{if(null!==t)return t.replace(/\s+/g,"").indexOf(n)>-1}))}}(r),function(t){return e=>void 0===t?e:[...e].sort(((e,n)=>null===e.createdDate||null===n.createdDate?0:t?n.createdDate.valueOf()-e.createdDate.valueOf():e.createdDate.valueOf()-n.createdDate.valueOf()))}(a),function(t,e,n){return s=>{if(n)return s;const a=Math.ceil(s.length/t);e>a&&(e=a);const i=(e-1)*t,o=e*t;return s.slice(i,o)}}(i,o,n))(e);return c}var g;const f={editData:{id:null,subject:null,author:null,createdDate:null,contents:null},isEdited:!1},m="board_edit";const b=new s(null!==(g=function(){if(function(){const{pathname:t}=new URL(window.location.href),e=a(u),n=null==e?void 0:e.editId,s=!n||n===d.editId||"/edit"!==t;return s&&localStorage.removeItem("board_edit"),s}())return null;const t=a(m);if(!t)return null;const{createdDate:e}=t.editData;return"string"==typeof e&&(t.editData.createdDate=new Date(e)),t}())&&void 0!==g?g:Object.assign({},f),(()=>i(m,b.state))),v=(t,e)=>Math.floor(Math.random()*(e-t+1))+t;function O(t){return Array.from(t.childNodes)}function S(t,e,n,s){const a=Math.max(e.length,n.length);let i=0;for(s&&(n=function(t,e){const n=[...t];return e.forEach((e=>{const s=t.findIndex((t=>{const n=e.nodeName===t.nodeName,s=t instanceof HTMLElement&&e instanceof HTMLElement;if(!s)return;const a=t.dataset.componentId,i=e.dataset.componentId;return n&&s&&a===i}));-1!==s&&(n[s]=e)})),n}(e,n));a>i;){const s=e[i],a=n[i];if(y(t,s,a)){i++;continue}C(s,a);const o=O(s),r=O(a);(o.length||r.length)&&S(s,o,r),i++}}function y(t,e,n){const s=e&&!n,a=!e&&n;if(s?t.removeChild(e):a&&t.appendChild(n),s||a)return!0;const i=e.nodeName!==n.nodeName,o=[e,n].every((t=>t instanceof Text))&&e.nodeValue!==n.nodeValue;return i?t.replaceChild(n,e):o&&(e.nodeValue=n.nodeValue),!(!i&&!o)}function C(t,e){if(!(t instanceof Element&&e instanceof Element))return;const n=Array.from(e.attributes),s=Array.from(t.attributes);n.forEach((({name:e,value:n})=>{var a;return null!==(a=s.find((({name:t,value:s})=>e===t&&n===s)))&&void 0!==a?a:t.setAttribute(e,n)})),s.forEach((({name:e})=>{var s;return null!==(s=n.find((({name:t})=>t===e)))&&void 0!==s?s:t.removeAttribute(e)}))}const E=["isNotKeepAdding","initInsertPosition"],j=class{constructor(t,e={}){this.$target=t,this.props=e,this._renderState="adding",this.componentId=function(t=16){const[e,n]=["a".charCodeAt(0),"z".charCodeAt(0)];let s="";for(;s.length<t;)s+=Boolean(Math.round(Math.random()))?v(0,9):String.fromCharCode(v(e,n));return`__${s}`}();try{if("string"==typeof t&&(this.$target=document.querySelector(t)),null===this.$target)throw new n({msgType:"NOT_FOUND_TARGET",name:this.constructor.name});this.init(),this.initSubscriber(),this.render()}catch(t){console.error(t)}}init(){}initSubscriber(){}registerSubscriberFunction(t,e){this._subscriber||(this._subscriber=new class{constructor(t){this.func=t}registerFunc(t){this.func&&t.add(this.func)}removeFunc(t){this.func&&t.remove(this.func)}}),this._subscriber.func=e,this._subscriber.registerFunc(t)}setState(t,e){var n;this._state=Object.assign(Object.assign({},this._state),t),(null==e?void 0:e.noRender)||this.render(null===(n=null==e?void 0:e.isSetEvents)||void 0===n||n)}get state(){return this._state}setBeforeRender(){}render(t=!0){const{$target:e,props:n}=this;if(null===e||"string"==typeof e)return;this.setBeforeRender();const{isNotKeepAdding:s,initInsertPosition:a}=n;s&&(this._renderState="disabled");const{_renderState:i}=this;if("adding"===i){const t=null!=a?a:"beforeend";e.insertAdjacentHTML(t,this.setTemplate()),this._renderState="done"}else this.updateComponentNodes(e,"done"===i);this.setChildren(),t&&this.setEvents()}updateComponentNodes(t,e){S(t,O(t),function(t){const e=document.createElement("div");return e.innerHTML=t,Array.from(e.childNodes)}(this.setTemplate()),e)}setTemplate(){return""}setChildren(){}setEvents(){}getEventTarget(){let t=null;const{$target:e,componentId:n}=this;return t=n?document.querySelector(`[data-component-id=${n}]`):"string"==typeof e?document.querySelector(e):e,t}createStringAttribute(...t){const e=[...E,...t];return Object.entries(this.props).reduce(((t,[n,s])=>e.includes(n)?t:t+=`${n}="${s}" `),"")}},_=class extends j{constructor(t,e){super(t,e),this.$target=t,this.props=e}setTemplate(){const{componentId:t,props:e}=this,{arrPostData:n}=e,s=(null==n?void 0:n.length)?Object.keys(n[0]):[],a=this.createTDStrings(n);return`<table class="app-board" data-component-id=${t}>\n    <thead>\n      <tr>\n      ${[["번호",15],["제목",55],["작성자",15],["작성일",15]].map((([t,e],n)=>`<th style=width:${e}%; ${s[n]?`class=${s[n]}`:""}>${t}</th>`)).join("")}\n      </tr>\n    </thead>\n      ${a.length?`<tbody>${a.map((t=>`${t}`)).join("")}</tbody>`:""}\n    </table>\n    `}setChildren(){const{props:{arrPostData:t}}=this;t.forEach((({id:t,subject:e})=>{const n=document.querySelector(`tr[data-id="${t}"] td.subject`);n&&new W(n,{href:`/detail?id=${t}`,text:null!=e?e:"제목 없음",componentInfo:{Component:F},publisherList:[h,b]})}))}createTDStrings(t){const e=[];return t.length?(t.forEach((t=>{const{id:n}=t,s=Object.entries(t).reduce(((t,[e,n])=>{if("contents"===e)return t;const s="subject"!==e;return n=n instanceof Date?n.toLocaleDateString():n,t+`<td class=${e}>${s?n:""}</td>`}),"");e.push(`<tr data-id=${n}>${s}</tr>`)})),e):[]}},w=class extends j{constructor(t,e){super(t,e),this.$target=t,this.props=e}setTemplate(){const{componentId:t,props:e}=this,{color:n,size:s}=e;return`<button class="app-button ${n?`color--${n}`:"color--normal"} ${s?`size--${s}`:"size--small"}"\n      ${this.createStringAttribute("text","color","size")} data-component-id=${t}>\n      ${e.text}</button>`}},x=class extends j{constructor(t,e){super(t,e),this.$target=t,this.props=e}setTemplate(){const{componentId:t}=this;return`<input class="app-input" ${this.createStringAttribute()} data-component-id=${t}></input>`}},T=class extends j{constructor(t,e){super(t,e),this.$target=t,this.props=e}setTemplate(){const{componentId:t}=this;return`\n    <div class="app-pagination" data-component-id=${t}>\n      <ul class="list">\n        ${this.createLiItemStrings().join("")}\n      </ul>\n    </div>\n    `}createLiItemStrings(){let{pageNum:t,max:e}=this.props;t>e&&1!==t&&(t=e);const n=t%5==0?5:t%5,s=t-n,a=t+(5-n),i=[];let o=s;for(;o<a&&!(o+1>e);){const e=o+1===t?'class="current"':"";i.push(`<li ${e}>${o+1}</li>`),o++}const r=`<li class="next${e===o?" disabled":""}">&rarr;</li>`;return[`<li class="prev${0===s?" disabled":""}">&larr;</li>`,...i,r]}},$=class extends j{constructor(t,e){super(t,e),this.$target=t,this.props=e}setTemplate(){const{componentId:t,props:e}=this,{numPostList:n,selectedValue:s}=e;return n.length?`\n    <select class="app-selectbox" data-component-id=${t}>\n      ${n.map((t=>`<option value=${t} ${s===t?"selected":""}>${t}</option>`)).join("")}\n    </select>\n    `:""}},D=class extends j{constructor(t,e){super(t,e),this.$target=t,this.props=e}setTemplate(){const{componentId:t,props:e}=this,{text:n,isBold:s}=e;let a=e.fontSize;return a&&(a<10?a=10:a>50&&(a=50)),`<span class="app-span ${a?`fontSize--${a}`:""} ${s?"bold":""}" data-component-id=${t}>${n}</span>`}},I=class extends j{constructor(t,e){super(t,e),this.$target=t,this.props=e}setTemplate(){const{componentId:t,props:e}=this,{value:n,isFullSize:s}=e;return`<textarea class="app-textarea ${s?"fullsize":""}"  ${this.createStringAttribute("value","isFullSize")} data-component-id=${t}>${n||""}</textarea>`}},L=class extends j{constructor(t,e){super(t,e),this.$target=t,this.props=e}init(){this.props.showButtons||(this.props.showButtons="CONFIRM")}setTemplate(){const{componentId:t}=this;return`\n    <div class="app-error-modal" data-component-id=${t}>\n      <div class="inner">\n        <div class="buttons"></div>\n      </div>\n    </div>`}setChildren(){var t,e;const{noticeText:n,showButtons:s,buttonTexts:a}=this.props;new D(".app-error-modal .inner",{text:n,fontSize:16,initInsertPosition:"afterbegin"});const i=".app-error-modal .inner .buttons";"ALL"!==s&&"CANCEL"!==s||new w(i,{text:null!==(t=null==a?void 0:a.cancel)&&void 0!==t?t:"취소",name:"cancel",color:"red",size:"small"}),"ALL"!==s&&"CONFIRM"!==s||new w(i,{text:null!==(e=null==a?void 0:a.confirm)&&void 0!==e?e:"확인",name:"confirm",color:"blue",size:"small"})}setEvents(){this.registerButtonsClick()}registerButtonsClick(){var t;null===(t=this.getEventTarget())||void 0===t||t.addEventListener("click",(t=>this.handleButtonsClick(t)))}handleButtonsClick(t){const e=t.target;if(!e.closest(".buttons"))return;if("BUTTON"!==e.nodeName)return;const n=e.name,{clickHandler:{handleConfirmClick:s,handleCancelClick:a}}=this.props;"confirm"===n&&s?s():"cancel"===n&&a&&a()}};const N=class extends j{setTemplate(){const{componentId:t}=this;return`<div class="detail__page--bottombar" data-component-id=${t}></div>`}setChildren(){const{props:t}=this,e={isButton:!0,publisherList:[h,b]},n=t.dataId?+t.dataId:-1;new W(".detail__page--bottombar",Object.assign(Object.assign({},e),{href:"/edit",text:"수정",componentInfo:{Component:H},callbackOption:{func:()=>h.setState(Object.assign(Object.assign({},h.state),{editId:n})),runPosition:"afterRenderPath"}})),new w(".detail__page--bottombar",{name:"delete",text:"삭제"}),new W(".detail__page--bottombar",Object.assign(Object.assign({},e),{href:"/",text:"목록",componentInfo:{Component:z}})),this.setDetailBottomModal()}setEvents(){this.registerDetailBottomBarClick()}setDetailBottomModal(){if(!this.state||!this.state.errMessage&&!this.state.deleteStatus)return;const t=this.createDeleteModalProps(),{errMessage:e}=this.state;e&&(t.noticeText=e,t.clickHandler.handleConfirmClick=()=>{this.setState(Object.assign(Object.assign({},this.state),{errMessage:void 0}),{isSetEvents:!1}),G({href:"/",componentInfo:{Component:z}})}),new L(".detail__page--bottombar",Object.assign(Object.assign({},t),{showButtons:e?"CONFIRM":"ALL",buttonTexts:e?{confirm:"목록으로"}:void 0}))}createDeleteModalProps(){const t=()=>this.setState(Object.assign(Object.assign({},this.state),{deleteStatus:void 0}),{isSetEvents:!1});return{noticeText:"정말 삭제하시겠습니까?",clickHandler:{handleCancelClick:t,handleConfirmClick:()=>{t(),this.requestDeleteData()}}}}registerDetailBottomBarClick(){var t;null===(t=this.getEventTarget())||void 0===t||t.addEventListener("click",(t=>this.handleDetailBottomBarClick(t)))}handleDetailBottomBarClick(t){const e=t.target;e.classList.contains("app-button")&&e instanceof HTMLButtonElement&&"delete"===e.name&&this.setState(Object.assign(Object.assign({},this.state),{deleteStatus:!0}),{isSetEvents:!1})}requestDeleteData(){return t=this,e=void 0,a=function*(){try{const{dataId:t}=this.props,e={method:"DELETE",body:JSON.stringify({id:t}),headers:{"Content-Type":"application/json"}},s=yield c({type:"delete",options:e});if(!s)throw new n({msgType:"RESPONSE_IS_NULL",name:"DetailPage, DELETE"});const{message:a,statusCode:i}=s;if(!(i>=200&&i<400))throw new n({customMessage:a,name:"DetailPage, DELETE"});b.setState(Object.assign(Object.assign({},b.state),{isEdited:!0})),G({href:"/",componentInfo:{Component:z}})}catch(t){const{message:e}=t;console.error(t),this.setState(Object.assign(Object.assign({},this.state),{errMessage:e}),{isSetEvents:!1})}},new((s=void 0)||(s=Promise))((function(n,i){function o(t){try{c(a.next(t))}catch(t){i(t)}}function r(t){try{c(a.throw(t))}catch(t){i(t)}}function c(t){var e;t.done?n(t.value):(e=t.value,e instanceof s?e:new s((function(t){t(e)}))).then(o,r)}c((a=a.apply(t,e||[])).next())}));var t,e,s,a}},P={id:"번호",subject:"제목",author:"작성자",createdDate:"작성일",contents:"내용"},k=["author","contents","subject"];const M=class extends j{init(){const{dataId:t}=this.props;this.setState(Object.assign(Object.assign({},this.state),{currData:null})),t&&this.setPostData(+t)}setTemplate(){var t;const{componentId:e}=this,{textInfoStrings:n,contents:s}=this.createPostDataStrings(null===(t=this.state)||void 0===t?void 0:t.currData);return`\n    <div class="detail__page--content" data-component-id=${e}>\n      <ul class="textinfo">${n}</ul>\n      <div class="contents">${s}</div>\n    </div>`}setChildren(){if(this.state&&this.state.errMessage){const{errMessage:t}=this.state;new L(".detail__page--content",{noticeText:t,buttonTexts:{confirm:"목록으로"},clickHandler:{handleConfirmClick:()=>{this.setState(Object.assign(Object.assign({},this.state),{errMessage:void 0}),{isSetEvents:!1}),G({href:"/",componentInfo:{Component:z}})}}})}}setEvents(){}createPostDataStrings(t){var e;const n=[];if(!t)return{textInfoStrings:"",contents:"내용 없음"};const s=Object.keys(t);for(let e=0;e<s.length;e++){if("contents"===s[e])continue;const a=P[s[e]];let i=t[s[e]];"createdDate"===s[e]&&(i=i.toLocaleString()),n.push(`<li><span class="name">${a}</span><span>${null!=i?i:""}</span></li>`)}return{textInfoStrings:n.join(""),contents:null!==(e=t.contents)&&void 0!==e?e:"내용 없음"}}setPostData(t){return e=this,s=void 0,i=function*(){try{const e={method:"GET",id:t},s=yield c({type:"getPost",options:e});if(!s||!s.data)throw new n({name:"DetailPage, GET CONTENT",msgType:"RESPONSE_IS_NULL"});const{message:a,statusCode:i,data:o}=s;if(!(i>=200&&i<400))throw new n({name:"DetailPage, GET CONTENT",customMessage:a});o.createdDate&&(o.createdDate=new Date(o.createdDate)),this.setState(Object.assign(Object.assign({},this.state),{currData:o}))}catch(t){const{message:e}=t;console.error(t),this.setState(Object.assign(Object.assign({},this.state),{errMessage:e}),{isSetEvents:!1})}},new((a=void 0)||(a=Promise))((function(t,n){function o(t){try{c(i.next(t))}catch(t){n(t)}}function r(t){try{c(i.throw(t))}catch(t){n(t)}}function c(e){var n;e.done?t(e.value):(n=e.value,n instanceof a?n:new a((function(t){t(n)}))).then(o,r)}c((i=i.apply(e,s||[])).next())}));var e,s,a,i}};var B=function(t,e,n,s){return new(n||(n=Promise))((function(a,i){function o(t){try{c(s.next(t))}catch(t){i(t)}}function r(t){try{c(s.throw(t))}catch(t){i(t)}}function c(t){var e;t.done?a(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(o,r)}c((s=s.apply(t,e||[])).next())}))};const R=class extends j{setTemplate(){const{componentId:t}=this;return`<div class="edit__page--bottombar" data-component-id=${t}></div>`}setChildren(){const t={isButton:!0,componentInfo:{Component:F},publisherList:[h,b]};new w(".edit__page--bottombar",{name:"goback",text:"뒤로"});const e=Object.assign(Object.assign({},t),{href:"/detail",name:"submitlink",text:"전송",callbackOption:{func:()=>B(this,void 0,void 0,(function*(){return yield this.regsiterEditData()})),runPosition:"beforeRenderPath",options:{isID:!0}}});if(new W(".edit__page--bottombar",e),this.state&&this.state.errMessage){const{errMessage:t}=this.state;new L(".edit__page--bottombar",{noticeText:t,buttonTexts:{confirm:"목록으로"},clickHandler:{handleConfirmClick:()=>{this.setState(Object.assign(Object.assign({},this.state),{errMessage:void 0}),{isSetEvents:!1}),G({href:"/",componentInfo:{Component:z}})}}})}}setEvents(){this.registerEditBottomBarClick()}registerEditBottomBarClick(){var t;null===(t=this.getEventTarget())||void 0===t||t.addEventListener("click",(t=>this.handleEditBottomBarClick(t)))}handleEditBottomBarClick(t){const e=t.target;e.classList.contains("app-button")&&e instanceof HTMLButtonElement&&"goback"===e.name&&window.history.back()}regsiterEditData(){return B(this,void 0,void 0,(function*(){const{editData:t}=b.state,e=Object.keys(t).reduce(((e,n)=>(t[n]&&e++,e)),0);if(!(e>=k.length))return-1;const n=e>k.length;return yield this.requestCreateData(t,n)}))}requestCreateData(t,e){return B(this,void 0,void 0,(function*(){try{const s=e?"edit":"write",a={method:e?"PUT":"POST",body:JSON.stringify(t),headers:{"Content-Type":"application/json"}},i=yield c({type:s,options:a});if(!i||!i.data){const t=`서버에 오류가 있습니다. 글을 ${"edit"===s?"수정":"작성"}할 수 없습니다.`;throw new n({name:`EditPage, ${s.toUpperCase()}`,customMessage:t})}const{message:o,statusCode:r,data:l}=i;if(!(r>=200&&r<400))throw new n({name:`EditPage, ${s.toUpperCase()}`,customMessage:o});return b.setState(Object.assign(Object.assign({},b.state),{editData:f.editData,isEdited:!0})),l>0?l:-1}catch(t){const{message:e}=t;return console.error(t),this.setState(Object.assign(Object.assign({},this.state),{errMessage:e}),{isSetEvents:!1}),-1}}))}},A=class extends j{setTemplate(){const{componentId:t}=this;return`\n    <div class="edit__page--content" data-component-id=${t}>\n      <ul class="editinfo">${this.createEditInfoStrings()}</ul>\n      <div class="editbox"></div>\n    </div>`}setChildren(){var t;const{editData:e}=this.props;["subject","author"].forEach(((t,n)=>{if(!e)return;let s=e[t];"string"!=typeof s&&(s=""),new x(`ul.editinfo li[data-key="${n}"]`,{name:t,type:"text",value:s,placeholder:P[t]})})),new I(".editbox",{name:"contents",value:e&&(null!==(t=e.contents)&&void 0!==t?t:""),isFullSize:!0,placeholder:"하고싶은 말은..?"})}setEvents(){this.registerEditContentsKeyup()}createEditInfoStrings(){return["subject","author"].reduce(((t,e,n)=>{const s=`<li data-key=${n}><span class="name">${P[e]}</span></li>`;return t.push(s),t}),[]).join("")}registerEditContentsKeyup(){var t;null===(t=this.getEventTarget())||void 0===t||t.addEventListener("keyup",(t=>this.handleEditContentsKeyup(t)))}handleEditContentsKeyup(t){const e=t.target,n="TEXTAREA"===e.nodeName&&e.classList.contains("app-textarea");if("INPUT"===e.nodeName&&e.classList.contains("app-input")||n)if(n){const t=e.value,{state:n}=b;b.setState(Object.assign(Object.assign({},n),{editData:Object.assign(Object.assign({},n.editData),{contents:t})}))}else{const t=e.name,n=e.value,{state:s}=b;b.setState(Object.assign(Object.assign({},s),{editData:Object.assign(Object.assign({},s.editData),{[t]:n})}))}}};const K=class extends j{setTemplate(){const{componentId:t}=this;return`\n    <div class="main__page--topbar" data-component-id=${t}>\n      <div class="topbar--box"></div>\n      <div class="topbar--box"></div>\n    </div>`}setChildren(){const{numPostList:t,filterOptions:e}=h.state,{searchWord:n,numPost:s}=e,a=t=>`.main__page--topbar .topbar--box:nth-child(${t})`;new w(a(1),{name:"refrash",text:"새로고침"}),new w(a(1),{name:"init",text:"초기화"}),new W(a(1),{href:"/write",text:"작성",componentInfo:{Component:H},isButton:!0,publisherList:[h,b],callbackOption:{func:()=>b.setState(Object.assign({},f)),runPosition:"beforeRenderPath"}}),new x(a(2),{name:"search_input",type:"text",placeholder:"검색어를 입력해주세요.",value:n}),new $(a(2),{numPostList:t,selectedValue:s})}setEvents(){this.registerMainTopBarClick(),this.registerMainTopBarKeyUp(),this.registerMainTopBarChange()}registerMainTopBarClick(){var t;null===(t=this.getEventTarget())||void 0===t||t.addEventListener("click",(t=>this.handleMainTopBarClick(t)))}handleMainTopBarClick(t){const e=t.target;if(e.closest(".topbar--box")&&e.classList.contains("app-button")&&e instanceof HTMLButtonElement){const t=e.name;"init"===t?this.initMainTopBarElements():"refrash"===t&&this.refrashPostData()}}initMainTopBarElements(){var t,e;const n=null===(t=this.getEventTarget())||void 0===t?void 0:t.querySelector('.topbar--box:nth-child(2) input[name="search_input"]');n&&(n.value="");const{filterOptions:s}=d,a=null===(e=this.getEventTarget())||void 0===e?void 0:e.querySelector(".topbar--box:nth-child(2) .app-selectbox");a&&(a.value=`${s.numPost}`),h.setState(Object.assign(Object.assign({},d),{isInit:!0}))}refrashPostData(){return t=this,e=void 0,s=function*(){try{const{data:t}=yield l();if(!t)return;d.postData=t,h.setState(Object.assign(Object.assign({},h.state),{postData:[...t],isRefresh:!0}))}catch(t){console.error(t)}},new((n=void 0)||(n=Promise))((function(a,i){function o(t){try{c(s.next(t))}catch(t){i(t)}}function r(t){try{c(s.throw(t))}catch(t){i(t)}}function c(t){var e;t.done?a(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(o,r)}c((s=s.apply(t,e||[])).next())}));var t,e,n,s}registerMainTopBarKeyUp(){var t;null===(t=this.getEventTarget())||void 0===t||t.addEventListener("keyup",(t=>this.handleMainTopBarKeyUp(t)))}handleMainTopBarKeyUp(t){const e=t.target;if("search_input"!==e.name||"INPUT"!==e.nodeName)return;const n=e.value,{filterOptions:s}=h.state,a=Object.assign(Object.assign({},s),{searchWord:n});h.setState(Object.assign(Object.assign({},h.state),{filterOptions:a}))}registerMainTopBarChange(){var t;null===(t=this.getEventTarget())||void 0===t||t.addEventListener("change",(t=>this.handleMainTopBarChange(t)))}handleMainTopBarChange(t){const e=t.target;if(!e)return;if("SELECT"!==e.nodeName||!e.classList.contains("app-selectbox"))return;const n=+e.value;if(Number.isNaN(n))return;const{filterOptions:s}=h.state;h.setState(Object.assign(Object.assign({},h.state),{filterOptions:Object.assign(Object.assign({},s),{numPost:n})}))}};const U=class extends j{init(){this.initGetAllPostData(),this.setState(Object.assign(Object.assign({},this.state),{isUpdate:!1}),{noRender:!0})}initSubscriber(){this.registerSubscriberFunction(h,(()=>{const{currKeys:t}=h.recentChangedKeys;if(t.includes("isInit"))return this.execInitMainPageBoard();(t.includes("filterOptions")||t.includes("postData")||t.includes("isRefresh"))&&this.execUpdateMainPageBoard(t.includes("isRefresh"))}))}setBeforeRender(){this.state&&this.state.isUpdate&&this.setState(Object.assign(Object.assign({},this.state),{isUpdate:!1}),{noRender:!0})}setTemplate(){const{componentId:t}=this;return`<div class="main__page--board" data-component-id=${t}></div>`}setChildren(){const{filterOptions:t,postData:e}=h.state,{pageNum:n,numPost:s}=t,a=p({filterOptions:t,postData:e});new _(".main__page--board",{arrPostData:a});const i=p({filterOptions:t,postData:e,isFullData:!0}),o=Math.ceil(i.length/s);if(new T(".main__page--board",{pageNum:n,max:o}),this.state&&this.state.errMessage){const{errMessage:t}=this.state;new L(".main__page--board",{noticeText:t,showButtons:"CANCEL",buttonTexts:{cancel:"닫기"},clickHandler:{handleCancelClick:()=>{this.setState(Object.assign(Object.assign({},this.state),{errMessage:void 0}),{isSetEvents:!1})}}})}}setEvents(){this.registerMainBoardClick()}initGetAllPostData(){return t=this,e=void 0,a=function*(){try{const t="서버에 데이터가 없거나 오류가 있습니다. 게시글 작성을 시도해주세요.",e=yield l(t);if(!e||!e.data||!e.data&&e.message)throw new n({name:"MainPage, GET ALL POST",customMessage:t});d.postData=e.data;const{isEdited:s}=b.state;h.setState(Object.assign(Object.assign({},h.state),{postData:[...e.data]}),{notExec:!!s||void 0}),s&&b.setState(Object.assign(Object.assign({},b.state),{isEdited:!1}),{notExec:!0})}catch(t){const{message:e}=t;console.error(t),this.setState(Object.assign(Object.assign({},this.state),{errMessage:e}),{isSetEvents:!1})}},new((s=void 0)||(s=Promise))((function(n,i){function o(t){try{c(a.next(t))}catch(t){i(t)}}function r(t){try{c(a.throw(t))}catch(t){i(t)}}function c(t){var e;t.done?n(t.value):(e=t.value,e instanceof s?e:new s((function(t){t(e)}))).then(o,r)}c((a=a.apply(t,e||[])).next())}));var t,e,s,a}registerMainBoardClick(){var t;null===(t=this.getEventTarget())||void 0===t||t.addEventListener("click",(t=>this.handleMainBoardClick(t)))}handleMainBoardClick(t){const e=t.target;if("A"===e.nodeName&&e.classList.contains("app-link"))return;const n=e.closest(".app-board"),s=e.closest(".app-pagination");if(n||s)if(n){if(!e.closest("tr"))return;const t="TH"===e.nodeName&&e.classList.contains("createdDate"),n="TD"===e.nodeName&&e.classList.contains("author")&&e.textContent;if(t)return this.execCreatedDateClick();if(n&&e.textContent)return this.execAuthorClick(e.textContent)}else if("LI"===e.nodeName)return this.execPaginationItemClick(e)}execCreatedDateClick(){const{filterOptions:t}=h.state,e=!t.isDesc,n=Object.assign(Object.assign({},t),{isDesc:e});h.setState(Object.assign(Object.assign({},h.state),{filterOptions:n})),this.setState(Object.assign(Object.assign({},this.state),{isUpdate:!0}),{isSetEvents:!1})}execAuthorClick(t){const{filterOptions:e}=h.state,n=Object.assign(Object.assign({},e),{author:t});h.setState(Object.assign(Object.assign({},h.state),{filterOptions:n})),this.setState(Object.assign(Object.assign({},this.state),{isUpdate:!0}),{isSetEvents:!1})}execPaginationItemClick(t){const e=t.classList.contains("prev")||t.classList.contains("next"),{filterOptions:n,postData:s}=h.state;let a=-1;if(e){if(!this.state||t.classList.contains("disabled"))return;const{pageNum:e,numPost:i}=n,o=Math.ceil(s.length/i);a=t.classList.contains("prev")?e-5:e+5,a>o?a=o:a<=0&&(a=1)}else{const e=+`${t.textContent}`;if(Number.isNaN(e))return;a=e}const i=Object.assign(Object.assign({},n),{pageNum:a});h.setState(Object.assign(Object.assign({},h.state),{filterOptions:i}),{notExec:!0}),this.setState(Object.assign(Object.assign({},this.state),{isUpdate:!0}),{isSetEvents:!1})}execInitMainPageBoard(){h.setState(Object.assign(Object.assign(Object.assign({},h.state),d),{isInit:!1}),{notExec:!0}),this.setState(Object.assign(Object.assign({},this.state),{isUpdate:!0}),{isSetEvents:!1})}execUpdateMainPageBoard(t){return t&&h.setState(Object.assign(Object.assign({},h.state),{isRefresh:!1}),{notExec:!0}),this.setState(Object.assign(Object.assign({},this.state),{isUpdate:!0}),{isSetEvents:!1})}},F=class extends j{init(){var t,e;const{search:n}=new URL(window.location.href),s=null===(e=null===(t=V(n))||void 0===t?void 0:t.find((t=>"id"===t.key)))||void 0===e?void 0:e.value;s?this.setState(Object.assign(Object.assign({},this.state),{dataId:s}),{noRender:!0}):G()}setTemplate(){const{componentId:t}=this;return`<div class="detail__page default-page-size" data-component-id=${t}></div>`}setChildren(){var t;const e=null===(t=this.state)||void 0===t?void 0:t.dataId;new M(".detail__page",{dataId:e}),new N(".detail__page",{dataId:e})}},H=class extends j{initSubscriber(){this.registerSubscriberFunction(h,(()=>{const{currKeys:t}=h.recentChangedKeys;t.includes("editId")&&this.registerEditData()}))}setTemplate(){const{componentId:t}=this;return`<div class="edit__page default-page-size" data-component-id=${t}></div>`}setChildren(){const{editData:t}=b.state;new A(".edit__page",{editData:t}),new R(".edit__page")}registerEditData(){const{editId:t,postData:e}=h.state;if(-1===t)return;const n=e.find((({id:e})=>t===e));n&&(b.setState(Object.assign(Object.assign({},b.state),{editData:n})),this.setState(Object.assign(Object.assign({},this.state),{editData:n}),{isSetEvents:!1}))}},z=class extends j{setTemplate(){const{componentId:t}=this;return`<div class="main__page default-page-size" data-component-id=${t}></div>`}setChildren(){new K(".main__page"),new U(".main__page")}},q=class extends j{setTemplate(){const{componentId:t}=this;return`<div class="not-found__page default-page-size" data-component-id=${t}></div>`}setChildren(){new D(".not-found__page",{text:"페이지를 찾을 수 없습니다.",fontSize:36,isBold:!0}),new W(".not-found__page",{text:"메인으로",isButton:!0,href:"/",componentInfo:{Component:z}})}};function G({componentInfo:t,href:e,calledComponentName:s,publisherList:a}={}){try{e||(e=new URL(window.location.href).origin+"/notFound"),window.history.pushState({href:e},"",e);const i=document.querySelector("#root"),o=null!=t?t:{$target:i,Component:q};o.$target||(o.$target=i);let{$target:r,Component:c,props:l}=o;if("string"==typeof r&&(r=document.querySelector(r)),!r)throw new n({msgType:"NOT_FOUND_TARGET",name:null!=s?s:"unknown"});r.innerHTML="",a&&a.forEach((t=>t.clear())),new c(r,l)}catch(t){console.error(t)}}function J({routerInfo:t,href:e,calledComponentName:s,publisherList:a}){var i;try{if(!t)throw new n({msgType:"NOT_FOUND_ROUTER_INFO",name:s});const{pathname:o}=new URL(e),r=null!==(i=t[o])&&void 0!==i?i:t["/notFound"],{Component:c,props:l}=r;let d=r.$target;if("string"==typeof d&&(d=document.querySelector(d)),!d)return;d.innerHTML="",a&&a.forEach((t=>t.clear())),new c(d,l)}catch(t){console.error(t)}}const V=t=>{var e;try{const n=/(?<key>[\w]+)=(?<value>[\w]+)/g,s=null!==(e=Array.from(t.matchAll(n)))&&void 0!==e?e:[];return s&&s.length?s.map((t=>t.groups)):null}catch(t){return null}};const W=class extends j{constructor(t,e){super(t,e),this.$target=t,this.props=e}setTemplate(){if(!this.props)return"";const{componentId:t,props:e}=this,{text:n,isButton:s}=e;return`<a class="app-link ${s?" btn":""}" ${this.createStringAttribute("routerInfo","publisherList","isButton","callbackOption","text")} data-component-id=${t}>${null!=n?n:""}</a>`}setEvents(){this.registerAnchorClick()}registerAnchorClick(){var t;null===(t=this.getEventTarget())||void 0===t||t.addEventListener("click",(t=>this.anchorClickHandler(t)))}anchorClickHandler(t){var e,n,s,a,i;return n=this,s=void 0,i=function*(){null==t||t.preventDefault();const n=null==t?void 0:t.target,s=null==t?void 0:t.currentTarget;if(!s||n!==s)return;let a=s.href;if(!a)return;const{callbackOption:i}=this.props;if((null==i?void 0:i.func)&&"beforeRenderPath"===i.runPosition){const t=yield i.func();if("boolean"==typeof t&&!t)return;if(null===(e=i.options)||void 0===e?void 0:e.isID){if("number"==typeof t&&-1===t)return;a+=`?id=${t}`}}const{componentInfo:o,publisherList:r}=this.props;G({componentInfo:o,href:a,calledComponentName:`${this.constructor.name}(${this.componentId})`,publisherList:r}),(null==i?void 0:i.func)&&"afterRenderPath"===i.runPosition&&i.func()},new((a=void 0)||(a=Promise))((function(t,e){function o(t){try{c(i.next(t))}catch(t){e(t)}}function r(t){try{c(i.throw(t))}catch(t){e(t)}}function c(e){var n;e.done?t(e.value):(n=e.value,n instanceof a?n:new a((function(t){t(n)}))).then(o,r)}c((i=i.apply(n,s||[])).next())}))}};new class extends j{constructor(t){super(t)}init(){this.setAppRouter()}setAppRouter(){const{$target:t}=this;t&&"string"!=typeof t&&new class{constructor(t,e){this.$target=t,this.props=e;try{if(null===t)throw new n({msgType:"NOT_FOUND_TARGET",name:this.constructor.name});this.init()}catch(t){console.error(t)}}init(){this.setPopStateEvent(),this.setCleanUp();const t=window.location.href,{publisherList:e,routerInfo:n}=this.props;J({href:t,calledComponentName:this.constructor.name,routerInfo:n,publisherList:e})}setCleanUp(){const{pathChangeOption:t}=this.props;if(!t||!this.$target)return;const{func:e,pathList:n,isIncludePath:s}=t;new MutationObserver((t=>{return a=this,i=void 0,r=function*(){const t=new URL(document.location.href).pathname;(s?n.includes(t):!n.includes(t))&&(yield e())},new((o=void 0)||(o=Promise))((function(t,e){function n(t){try{c(r.next(t))}catch(t){e(t)}}function s(t){try{c(r.throw(t))}catch(t){e(t)}}function c(e){var a;e.done?t(e.value):(a=e.value,a instanceof o?a:new o((function(t){t(a)}))).then(n,s)}c((r=r.apply(a,i||[])).next())}));var a,i,o,r})).observe(this.$target,{childList:!0,subtree:!0})}setPopStateEvent(){window.addEventListener("popstate",(()=>this.popStateEventHandler()))}popStateEventHandler(t){const e=window.location.href,{publisherList:n,routerInfo:s}=this.props;J({href:e,calledComponentName:this.constructor.name,routerInfo:s,publisherList:n})}}(t,{publisherList:[h,b],routerInfo:{"/":{$target:t,Component:z},"/detail":{$target:t,Component:F},"/edit":{$target:t,Component:H},"/write":{$target:t,Component:H},"/notFound":{$target:t,Component:q}},pathChangeOption:{func:()=>{h.setState(Object.assign(Object.assign({},h.state),{editId:d.editId}),{notExec:!0}),b.setState(Object.assign({},f),{notExec:!0})},pathList:["/edit"],isIncludePath:!1}})}}("#root")})();
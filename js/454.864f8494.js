"use strict";(self["webpackChunkamiyabot_console"]=self["webpackChunkamiyabot_console"]||[]).push([[454],{9620:function(e,t,a){a.r(t),a.d(t,{default:function(){return le}});var n=a(2261),l=(a(6809),a(3417)),s=(a(172),a(1183)),i=(a(1758),a(4143)),o=(a(7437),a(4926)),c=a(1015),d=(a(8474),a(3396)),m=a(7139),r=a(9242);const u=e=>((0,d.dD)("data-v-4db136c2"),e=e(),(0,d.Cn)(),e),f=u((()=>(0,d._)("div",{class:"header"},[(0,d._)("div",{class:"title"}," AmiyaBot Test ")],-1))),p={class:"body"},h=u((()=>(0,d._)("span",null,"对话窗口",-1))),g={class:"card-content"},_={class:"chat-panel",ref:"panel"},v=["src"],w={class:"chat-content"},y={class:"time"},k=["innerHTML"],b=u((()=>(0,d._)("div",{style:{margin:"5px 0"}},null,-1))),W=u((()=>(0,d._)("div",{style:{margin:"5px 0"}},null,-1))),D={class:"selected-images"},V={class:"input-area"},C=(0,d.Uk)("发送"),U=(0,d.Uk)("选择图片..."),x={type:"file",accept:"image/*",style:{display:"none"},multiple:"",ref:"imageSelector"};function I(e,t,a,u,I,S){const $=(0,d.up)("test-config"),L=(0,d.up)("refresh-left"),O=c.gn,j=o.F8,H=i.Kf,R=s.dQ,Z=l.EZ,E=n.mi;return(0,d.wg)(),(0,d.iD)(d.HY,null,[f,(0,d._)("div",p,[(0,d.Wm)($,{ref:"config",onRecv:e.recv},null,8,["onRecv"]),(0,d.Wm)(H,{class:"chat","body-style":{height:"calc(100% - 53px)"}},{header:(0,d.w5)((()=>[h])),default:(0,d.w5)((()=>[(0,d._)("div",g,[(0,d._)("div",_,[((0,d.wg)(!0),(0,d.iD)(d.HY,null,(0,d.Ko)(e.chatList,((t,a)=>((0,d.wg)(),(0,d.iD)("div",{class:(0,m.C_)(["chat-item",t.type]),key:a},[(0,d._)("img",{class:"avatar",src:e.avatar[t.type],alt:"avatar"},null,8,v),(0,d._)("div",w,[(0,d._)("div",null,[(0,d.Uk)((0,m.zw)(t.name)+" ",1),(0,d._)("span",y,(0,m.zw)(t.time),1),"me"===t.type?((0,d.wg)(),(0,d.j4)(O,{key:0,class:"resend",onClick:a=>e.resend(t)},{default:(0,d.w5)((()=>[(0,d.Wm)(L)])),_:2},1032,["onClick"])):(0,d.kq)("",!0)]),(0,d.Wm)(H,{shadow:"always","body-style":{padding:"10px"}},{default:(0,d.w5)((()=>[((0,d.wg)(!0),(0,d.iD)(d.HY,null,(0,d.Ko)(t.content,((e,t)=>((0,d.wg)(),(0,d.iD)("span",{class:"content",innerHTML:e,key:t},null,8,k)))),128)),((0,d.wg)(!0),(0,d.iD)(d.HY,null,(0,d.Ko)(t.images,((e,t)=>((0,d.wg)(),(0,d.iD)(d.HY,{key:t},[b,(0,d.Wm)(j,{style:{height:"100px"},fit:"contain",src:e},null,8,["src"]),W],64)))),128))])),_:2},1024)])],2)))),128))],512),(0,d._)("div",D,[((0,d.wg)(!0),(0,d.iD)(d.HY,null,(0,d.Ko)(e.selectedImages,((t,a)=>((0,d.wg)(),(0,d.iD)("div",{key:a,style:{"padding-right":"15px"}},[(0,d.Wm)(R,{value:a+1,type:"primary"},{default:(0,d.w5)((()=>[(0,d.Wm)(j,{class:"image",src:t,fit:"contain",onClick:t=>e.selectedImages.splice(a,1)},null,8,["src","onClick"])])),_:2},1032,["value"])])))),128))]),(0,d._)("div",V,[(0,d.Wm)(Z,{modelValue:e.message,"onUpdate:modelValue":t[0]||(t[0]=t=>e.message=t),placeholder:"输入对话内容，按回车发送...",onKeyup:(0,r.D2)(e.send,["enter"])},null,8,["modelValue","onKeyup"]),(0,d.Wm)(E,{style:{"margin-left":"10px"},type:"primary",onClick:e.send},{default:(0,d.w5)((()=>[C])),_:1},8,["onClick"]),(0,d.Wm)(E,{style:{"margin-left":"10px"},onClick:t[1]||(t[1]=t=>e.$refs.imageSelector.click())},{default:(0,d.w5)((()=>[U])),_:1})])])])),_:1},8,["body-style"])]),(0,d._)("input",x,null,512)],64)}var S=a(6520),$=a(2748),L=a(8418),O=a(8631),j=(a(7029),a(1955)),H=(a(2064),a(7113),a(1244));a(7219);const R={class:"config"},Z=(0,d.Uk)("连接测试服务"),E=(0,d.Uk)("连接"),T=(0,d.Uk)("断开连接"),Y=(0,d.Uk)("已连接"),K=(0,d.Uk)("未连接"),P=(0,d.Uk)("模拟信息设置"),A=(0,d.Uk)("事件模拟"),J=(0,d.Uk)("发送");function N(e,t,a,s,i,o){const c=H.os,r=l.EZ,u=j.nH,f=n.mi,p=j.ly,h=O.OX;return(0,d.wg)(),(0,d.iD)("div",R,[(0,d.Wm)(c,{"content-position":"left"},{default:(0,d.w5)((()=>[Z])),_:1}),(0,d.Wm)(p,{"label-width":"120px"},{default:(0,d.w5)((()=>[(0,d.Wm)(u,{label:"测试地址"},{default:(0,d.w5)((()=>[(0,d.Wm)(r,{modelValue:e.host,"onUpdate:modelValue":t[0]||(t[0]=t=>e.host=t)},null,8,["modelValue"])])),_:1}),(0,d.Wm)(u,{label:"APP ID"},{default:(0,d.w5)((()=>[(0,d.Wm)(r,{modelValue:e.appid,"onUpdate:modelValue":t[1]||(t[1]=t=>e.appid=t)},null,8,["modelValue"])])),_:1}),(0,d.Wm)(u,null,{default:(0,d.w5)((()=>[e.isConnected?((0,d.wg)(),(0,d.j4)(f,{key:1,type:"danger",onClick:e.clean},{default:(0,d.w5)((()=>[T])),_:1},8,["onClick"])):((0,d.wg)(),(0,d.j4)(f,{key:0,type:"success",onClick:e.connect},{default:(0,d.w5)((()=>[E])),_:1},8,["onClick"])),(0,d._)("span",null,[(0,d._)("i",{class:(0,m.C_)(["state",{ok:e.isConnected}])},null,2),e.isConnected?((0,d.wg)(),(0,d.iD)(d.HY,{key:0},[Y],64)):((0,d.wg)(),(0,d.iD)(d.HY,{key:1},[K],64))])])),_:1})])),_:1}),(0,d.Wm)(c,{"content-position":"left",style:{"margin-top":"50px"}},{default:(0,d.w5)((()=>[P])),_:1}),(0,d.Wm)(p,{"label-width":"120px"},{default:(0,d.w5)((()=>[(0,d.Wm)(u,{label:"用户ID"},{default:(0,d.w5)((()=>[(0,d.Wm)(r,{modelValue:e.form.user_id,"onUpdate:modelValue":t[2]||(t[2]=t=>e.form.user_id=t)},null,8,["modelValue"])])),_:1}),(0,d.Wm)(u,{label:"用户昵称"},{default:(0,d.w5)((()=>[(0,d.Wm)(r,{modelValue:e.form.nickname,"onUpdate:modelValue":t[3]||(t[3]=t=>e.form.nickname=t)},null,8,["modelValue"])])),_:1}),(0,d.Wm)(u,{label:"群组ID"},{default:(0,d.w5)((()=>[(0,d.Wm)(r,{modelValue:e.form.channel_id,"onUpdate:modelValue":t[4]||(t[4]=t=>e.form.channel_id=t)},null,8,["modelValue"])])),_:1}),(0,d.Wm)(u,{label:"消息类型"},{default:(0,d.w5)((()=>[(0,d.Wm)(r,{modelValue:e.form.message_type,"onUpdate:modelValue":t[5]||(t[5]=t=>e.form.message_type=t)},null,8,["modelValue"])])),_:1}),(0,d.Wm)(u,{label:"是否管理员"},{default:(0,d.w5)((()=>[(0,d.Wm)(h,{modelValue:e.form.is_admin,"onUpdate:modelValue":t[6]||(t[6]=t=>e.form.is_admin=t)},null,8,["modelValue"])])),_:1})])),_:1}),(0,d.Wm)(c,{"content-position":"left",style:{"margin-top":"50px"}},{default:(0,d.w5)((()=>[A])),_:1}),(0,d.Wm)(p,{"label-width":"120px"},{default:(0,d.w5)((()=>[(0,d.Wm)(u,{label:"事件名"},{default:(0,d.w5)((()=>[(0,d.Wm)(r,{modelValue:e.event.event_name,"onUpdate:modelValue":t[7]||(t[7]=t=>e.event.event_name=t)},null,8,["modelValue"])])),_:1}),(0,d.Wm)(u,{label:"事件数据"},{default:(0,d.w5)((()=>[(0,d.Wm)(r,{type:"textarea",modelValue:e.event.event_data,"onUpdate:modelValue":t[8]||(t[8]=t=>e.event.event_data=t)},null,8,["modelValue"])])),_:1}),(0,d.Wm)(u,null,{default:(0,d.w5)((()=>[(0,d.Wm)(f,{type:"primary",onClick:e.sendEvent},{default:(0,d.w5)((()=>[J])),_:1},8,["onClick"])])),_:1})])),_:1})])}var B=a(9037),z=function(e,t,a,n){var l,s=arguments.length,i=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,a):n;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)i=Reflect.decorate(e,t,a,n);else for(var o=e.length-1;o>=0;o--)(l=e[o])&&(i=(s<3?l(i):s>3?l(t,a,i):l(t,a))||i);return s>3&&i&&Object.defineProperty(t,a,i),i};async function M(e){return new Promise((t=>{const a=new Image;a.src=e,a.onload=function(){const e=document.createElement("canvas");e.width=a.width,e.height=a.height;const n=e.getContext("2d");n?.drawImage(a,0,0,a.width,a.height);const l=a.src.substring(a.src.lastIndexOf(".")+1).toLowerCase(),s=e.toDataURL("image/"+l);t(s)}}))}let q=class extends S.w3{};q=z([(0,S.Ei)({methods:{connect(){if(!this.isConnected){const e=new WebSocket(`ws://${this.host}/${this.appid}`);e.onopen=()=>{this.client=e,this.isConnected=!0,localStorage.setItem("test-host",this.host),localStorage.setItem("test-appid",this.appid),B.Z.toast("连接成功")},e.onclose=()=>{this.isConnected=!1,this.clean(),B.Z.toast("连接失败","error")},e.onmessage=e=>{this.$emit("recv",JSON.parse(e.data))},e.onerror=e=>{this.clean(),console.log("websocket closed.",e)}}},async send(e,t=[]){const a=[];for(const n of t)a.push(await M(n));this.client.send(JSON.stringify({event:"message",event_id:(new Date).getTime().toString(),event_data:{...this.form,message:e,images:a}}))},sendEvent(){let e=this.event.event_data;try{e=JSON.parse(e)}catch(t){}this.client.send(JSON.stringify({event:this.event.event_name,event_id:(new Date).getTime().toString(),event_data:e}))},clean(){localStorage.removeItem("test-host"),localStorage.removeItem("test-appid"),this.client&&(this.client.close(),this.client=null)}},data(){return{host:localStorage.getItem("test-host")||"127.0.0.1:32001",appid:localStorage.getItem("test-appid")||"test",client:null,isConnected:!1,form:{user_id:"",channel_id:"",message_type:"group",nickname:"User",is_admin:!0},event:{event_name:"",event_data:""}}},mounted(){this.host&&this.appid&&this.connect()}})],q);var F=q,Q=a(89);const X=(0,Q.Z)(F,[["render",N],["__scopeId","data-v-6560bf42"]]);var G=X,ee=function(e,t,a,n){var l,s=arguments.length,i=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,a):n;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)i=Reflect.decorate(e,t,a,n);else for(var o=e.length-1;o>=0;o--)(l=e[o])&&(i=(s<3?l(i):s>3?l(t,a,i):l(t,a))||i);return s>3&&i&&Object.defineProperty(t,a,i),i};let te=class extends S.w3{};te=ee([(0,S.Ei)({components:{TestConfig:G,RefreshLeft:$.Ufu},watch:{chatList:{handler(){this.$nextTick((()=>{this.$refs.panel.scrollTop=this.$refs.panel.scrollHeight}))},deep:!0}},methods:{send(){(""!==this.message||this.selectedImages.length)&&(this.chatList.push({type:"me",name:this.$refs.config.form.nickname||"User",content:""!==this.message?[this.message]:[],images:this.selectedImages,time:L.Z.formatDate(new Date)}),this.$refs.config.send(this.message,this.selectedImages),this.message="",this.selectedImages=[])},resend(e){this.chatList.push({...e,name:this.$refs.config.form.nickname||"User",time:L.Z.formatDate(new Date)}),this.$refs.config.send(e.content[0],e.images)},recv(e){const t=[],a=[];for(const n of e.event_data)switch(n.type){case"text":t.push(n.data.replace(/\n/g,'<div style="margin: 5px 0"></div>'));break;case"face":t.push(`[face${n.data}]`);break;case"image":t.push(`<div style="margin: 5px 0"></div><img class="chat-image" src="${n.data}" alt="image"><div style="margin: 5px 0"></div>`);break;case"voice":a.push(`\n                            <audio controls>\n                                <source src="${n.data}" type="${n.audio_type}">\n                            </audio>\n                        `);break}if(t.length&&this.chatList.push({type:"bot",name:"AmiyaBot",content:t,images:[],time:L.Z.formatDate(new Date)}),a.length)for(const n of a)this.chatList.push({type:"bot",name:"AmiyaBot",content:[n],images:[],time:L.Z.formatDate(new Date)})}},data(){return{message:"",selectedImages:[],chatList:[],avatar:{bot:a(3792),me:a(5571)}}},mounted(){this.$refs.imageSelector.addEventListener("change",(()=>{const{files:e}=this.$refs.imageSelector;for(const t of e)this.selectedImages.push(URL.createObjectURL(t));this.$refs.imageSelector.value=""}))}})],te);var ae=te;const ne=(0,Q.Z)(ae,[["render",I],["__scopeId","data-v-4db136c2"]]);var le=ne},3792:function(e,t,a){e.exports=a.p+"img/bot.3d7138cd.jpg"},5571:function(e,t,a){e.exports=a.p+"img/me.998f4ce6.jpg"},7437:function(e,t,a){a(1758)},7219:function(e,t,a){a(1758)},7029:function(e,t,a){a(1758)}}]);
//# sourceMappingURL=454.864f8494.js.map
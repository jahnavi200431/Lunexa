let prompt=document.querySelector("#prompt")
let chatcontainer=document.querySelector(".chat-container")
let imagebtn=document.querySelector("#image")
let imageinput=document.querySelector("input")
function createchatbox(html,classes){
    let div=document.createElement("div")
    div.innerHTML=html
    div.classList.add(classes)
    return div
}
const api_url="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBT0QvcxDT5zXrZyCjloXJf_hz7yWYWy7Q"
let user={
    message:null,
    file:{
        mime_type:null,
        data:null
    }
}
async function generateresponse(aichatbox){

    let text=aichatbox.querySelector(".ai-chat-area")
    let requestoption={
        method:"POST",
        headers:{'Content-Type': 'application/json'},
         body:JSON.stringify({
            
    "contents": [
      {
        "parts": [
          {
            "text":user.message
          }, (user.file.data?[{"inline_data":user.file}]:[])
        ]
      }
    ]
  
         })
    }
    try{
let response=await fetch(api_url,requestoption)
let data =await response.json()
let apiresponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
text.innerHTML=apiresponse
}
    catch(error){
        console.log(error)
    }
    finally{ 
        chatcontainer.scrollTo({top:chatcontainer.scrollHeight,behaviour:"smooth"})
    }
}
function handlechatResponse(usermessage){
    user.message=usermessage
    let html=`<img src="woman.png" alt="" id="userimage" width="70">
<div class="user-chat-area">${user.message}
${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : " "}
</div>`
prompt.value=""
let userchatbox=createchatbox(html,"user-chat-box")
 chatcontainer.appendChild(userchatbox)
 chatcontainer.scrollTo({top:chatcontainer.scrollHeight,behaviour:"smooth"})
 setTimeout(()=>{
let html=`<img src="chatbot.png" alt="" id="aiimage" width="60">
<div class="ai-chat-area"> <img src="load.png" alt="" class="load" width="60"></div>`


let aichatbox=createchatbox(html,"ai-chat-box")
chatcontainer.appendChild(aichatbox)
generateresponse(aichatbox)
 },600)
}
prompt.addEventListener("keydown",(e)=>{
    if(e.key=="Enter"){
handlechatResponse(prompt.value);
    }
   
})
imageinput.addEventListener("change",()=>{
    const file=imageinput.files[0]
    if(!file) return 
    let reader=newmFileReader()
    reader.onload=(e)=>{
        let base64string=e.target.result.split(",")[1]
user.file={
        mime_type:file.type,
        data:base64string
    }  
  
    }
    imagebtn.innerhtml=`${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : " "}`
    reader.readAsDataURL(file)
})

imagebtn.addEventListener("click",()=>{
    imagebtn.querySelector("input").click()
})
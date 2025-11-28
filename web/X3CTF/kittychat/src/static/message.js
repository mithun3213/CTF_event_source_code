(()=>{
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get("msg");
if (!msg) return;
document.querySelector("#message").innerText = msg + " ";
const path = urlParams.get("path");
if (path) {
	const redirectLink = document.createElement("a");
	redirectLink.classList.add("redirect");
	redirectLink.innerText = "Redirecting..."
	redirectLink.href = document.location.origin + "/" + urlParams.get("path");
	document.querySelector("#message").appendChild(redirectLink);
}
setTimeout(()=>document.querySelector(".redirect").click(), 3000);
})()

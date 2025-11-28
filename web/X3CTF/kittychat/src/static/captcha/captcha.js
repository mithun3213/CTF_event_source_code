function updateCaptchaBtn(checkCaptcha) {
  const hasSelected = document.querySelector(".captcha img.selected");
  const captchaBtn = document.querySelector(".captcha button");
  captchaBtn.onclick = hasSelected ? checkCaptcha : null;
  captchaBtn.classList[hasSelected?"remove":"add"]("disabled");
}

function captcha(cb) {
  document.querySelectorAll("div.captcha").forEach(e=>e.remove());
  const captcha = document.createElement("div");
  captcha.classList.add("captcha");
  const p = document.createElement("p");
  p.innerText = "Select all cats to continue:";
  captcha.appendChild(p);
  const button = document.createElement("button");
  button.innerText = "submit";
  const captchaCount = 9;
  const captchaState = Array(captchaCount).fill(0).map(e=>Math.random()>0.5);
  if (!captchaState.includes(true)) captchaState[parseInt(Math.random()*9)] = true;
  const captchaGrid = document.createElement("div");
  const captchaCats = Array(captchaCount).fill(0).map((e,i)=>`captcha/cat_${i}.webp`).sort( () => .5 - Math.random() );
  const captchaPics = Array(captchaCount).fill(0).map((e,i)=>`captcha/pic_${i}.webp`).sort( () => .5 - Math.random() );
    
  const checkCaptcha = () => {
    const images = document.querySelectorAll(".captcha div img");
    for (let i = 0; i < captchaCount; i++) {
      if (captchaState[i] != images[i].classList.contains("selected")) {
        button.animate(
          [
            { transform: "translateX(-10px)" },
            { transform: "translateX(8px)" },
            { transform: "translateX(-6px)" },
            { transform: "translateX(4px)" },
            { transform: "translateX(-2px)" },
            { transform: "translateX(0)" },
          ],
          {
            fill: "forwards",
            easing: "linear",
            duration: 500,
          },
        );
        return;
      }
    }
    captcha.remove();
    cb();
  };
  const captchaImages = Array(captchaCount).fill(0).map((e,i) => {
    const captchaImage = document.createElement("img");
    captchaImage.onmousedown = () => {
      captchaImage.classList.toggle("selected");
      updateCaptchaBtn(checkCaptcha);
    };
    captchaImage.src = (captchaState[i]?captchaCats:captchaPics)[i];
    captchaImage.setAttribute("draggable", "false")
    captchaGrid.appendChild(captchaImage);
    return captchaImage;
  });
  captcha.appendChild(captchaGrid);
  captcha.appendChild(button);
  document.body.appendChild(captcha);
  updateCaptchaBtn(checkCaptcha);
}

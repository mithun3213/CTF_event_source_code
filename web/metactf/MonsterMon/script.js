const imageMap = {
    'ShadowNinja92': "SparkleDrake",
    'ThunderMuncher': "ThunderPuff",
    'GlimmerGizmo': "FlameWhisk",
    'ZappyZoomer': "AquaBlitz",
    'FuzzyFlash23': "GoldenShiny"
}

document.getElementById('secondary-user').addEventListener('change', ()=> {
    handleSelectorChange(event.target.value)
});

function handleSelectorChange(value) {
    document.getElementById('trade-user-name').innerText = "User: " + value
    document.getElementById("trade-card-title").innerText = imageMap[value]
    document.getElementById("trade-card-image").src = "images/" +imageMap[value].toLowerCase() + ".png"
    fetch("/diff/" + value).then(response => {
        if(!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.message) {
            showError(data.message)
        } else {
            document.getElementById("valueDifference").innerText = "Value Difference: " + data.diff + " Points"
            if (data.diff >= 25) {
                showSmallText()
            } else {
                hideSmallText()
            }
        }
    })
}

handleSelectorChange(document.getElementById('secondary-user').value)


function inspectCard() {
    fetch("/inspect").then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.message) {
            showError(data.message)
        } else {
            showInfo(data.title, data.description)
        }
    })
    .catch(error => {
        throw new Error('Json was bad');
    });
}

function trade() {
    let p = document.getElementById('secondary-user').value;
    showLoading();
    fetch("/trade/" + p).then(response => {
        if(!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.message == "Trade Processing") {
            setTimeout(()=>{
                hidePopup('loadingPopup')
                showError("Trade Rejected!!")
            }, 10000)
        } else {
            hidePopup('loadingPopup')
            showError(data.message);
        }
    })
}

function showInfo(title, description) {
    document.getElementById("popup-info-title").innerHTML = title
    document.getElementById("popup-info-description").innerHTML = description
    showPopup('infoPopup');
    setTimeout(() => hidePopup('infoPopup'), 5000);
}

function showLoading() {
    showPopup('loadingPopup');
}

function showError(message) {
    document.getElementById("popup-error-description").innerHTML = message
    showPopup('errorPopup');
    setTimeout(() => hidePopup('errorPopup'), 3000);
}

function showPopup(popupId) {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById(popupId).style.display = 'block';
}

function hidePopup(popupId) {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById(popupId).style.display = 'none';
}

function showSmallText() {
    document.getElementById('smallText').style.display = 'block';
}

function hideSmallText() {
    document.getElementById('smallText').style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == document.getElementById("errorPopup")) {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById("errorPopup").style.display = "none";
    }
    if (event.target == document.getElementById("infoPopup")) {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById("infoPopup").style.display = "none";
    }
}

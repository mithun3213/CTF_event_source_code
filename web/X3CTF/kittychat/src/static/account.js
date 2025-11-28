user = {}

async function loadUser() {
  user = await (await fetch("/user")).json();
  document.querySelector("#username").innerText = user.username;
}

function updateNotesBtn(updateNotes) {
  const hasText = !!document.querySelector(".notes input").value.length;
  const notesBtn = document.querySelector(".notes button");
  notesBtn.onclick = hasText ? updateNotes() : null;
  notesBtn.classList[hasText?"remove":"add"]("disabled");
}

async function getUserKey() {
  return (await (await fetch("/user")).json()).userkey;
}

function loadPrivateNotes() {
  captcha(async () => {
    const notes = document.createElement("div");
    notes.classList.add("notes");
    const p = document.createElement("p");
    p.innerText = "Private notes:";
    notes.appendChild(p);
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.value = (await (await fetch("/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: await getUserKey() }),
    })).json()).notes;
    input.oninput = () => updateNotesBtn(updateNotes);
    notes.appendChild(input);
    const updateNotes = async () => {
      await (await fetch("/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: await getUserKey(), note: document.querySelector(".notes input").value }),
      })).json();
    }
    const button = document.createElement("button");
    button.innerText = "save";
    notes.appendChild(button);
    document.body.appendChild(notes);
    updateNotesBtn(updateNotes);
  });
}

loadUser();
document.querySelector("#loadPrivate").onclick = () => loadPrivateNotes();

from flask import Flask, render_template_string, request, jsonify
import re

app = Flask(__name__)

disallowed_terms = ["{{", "}}", "_", ".", "[", "]", "os", "popen", "subprocess",
                    "mro", "globals", "locals", "config", "builtins", "import",
                    "application", "class", "dict", "lipsum", "debug", "with",
                    "getitem", "read", "cat","math"]

def check_input(input_string):
    for term in disallowed_terms:
        if term in input_string:
            return False
    return input_string

@app.route('/', methods=['GET', 'POST'])
def main():
    avatar_name = ''

    if request.method == 'POST':
        avatar_name = request.form.get('avatar_name', '')
        avatar_name = check_input(avatar_name)

        if not avatar_name:
            return jsonify({'error': 'Forbidden Words'})

    html_template = '''<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Ready Player Pin — OASIS Ownership</title>
<style>
  body {{
    margin: 0;
    background: radial-gradient(circle,#05020a 0,#0b0320 60%);
    font-family: 'Segoe UI', Roboto, monospace;
    color: #bfefff;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }}
  .card {{
    width: 720px;
    max-width: 95vw;
    background: rgba(255,255,255,0.03);
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 10px 50px rgba(0,0,0,0.6);
    border:1px solid rgba(255,255,255,0.04);
    text-align: center;
  }}
  h1 {{
    color: #ff9adb;
    text-shadow: 0 0 12px rgba(255,154,219,0.3);
    margin-bottom: 8px;
  }}
  p {{
    color: #dfefff;
    margin-bottom: 20px;
  }}
  input[type="text"] {{
    width: 70%;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(0,0,0,0.35);
    color: #bfefff;
    margin-bottom: 12px;
  }}
  button {{
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    background: #ff9adb;
    color: #000;
    cursor: pointer;
    margin-bottom: 12px;
  }}
  canvas {{
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 6px;
    background: rgba(0,0,0,0.2);
    margin-bottom: 12px;
  }}
  .message {{
    color: #ff6b6b;
    margin-top: 10px;
  }}
</style>
</head>
<body>
<div class="card">
  <h1>Ready Player Pin</h1>
  <p>Sign your avatar name to claim ownership of the OASIS vault. Draw your signature below or type it manually.</p>
  
  <canvas id="signature" width="600" height="150"></canvas><br>
  <button id="clear">Clear Canvas</button>
  
  <form method="POST">
    <input type="text" name="avatar_name" placeholder="Type your avatar name here"><br>
    <input type="submit" value="Claim Vault">
  </form>
  
  <p class="message">{}</p>
</div>

<script>
const canvas = document.getElementById('signature');
const ctx = canvas.getContext('2d');
let drawing = false;

canvas.addEventListener('mousedown', e => {{ drawing = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); }});
canvas.addEventListener('mousemove', e => {{ if(drawing) ctx.lineTo(e.offsetX, e.offsetY); ctx.strokeStyle="#ff9adb"; ctx.lineWidth=2; ctx.stroke(); }});
canvas.addEventListener('mouseup', () => {{ drawing = false; }});
canvas.addEventListener('mouseleave', () => {{ drawing = false; }});

document.getElementById('clear').addEventListener('click', () => {{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}});
</script>
</body>
</html>
'''.format(avatar_name)

    return render_template_string(html_template)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
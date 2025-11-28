from flask import Flask, request, render_template_string, send_file
import tempfile
import subprocess
import os
import sys

if not os.getenv("FLAG"):
  print("Missing FLAG. Challenge is broken.")
  sys.exit(1)

app = Flask(__name__)

FORM_HTML = """
<!doctype html>
<html>
  <head><title>Quarkdown to HTML</title></head>
  <body>
    <h1>Quarkdown to HTML</h1>
    <form method="post">
      <textarea name="source" rows="15" cols="80" placeholder="Enter Quarkdown here..."></textarea><br><br>
      <button type="submit">Render HTML</button>
    </form>
  </body>
</html>
"""

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        source = request.form.get("source", "")
        if not source.strip():
            return "No input provided", 400

        with tempfile.TemporaryDirectory() as tmpdir:
            qk_file = os.path.join(tmpdir, "input.qk")
            html_file = os.path.join(tmpdir, "output/index.html")

            with open(qk_file, "w") as f:
                f.write(source)

            subprocess.run(["quarkdown", "c", qk_file, "--out", tmpdir, "--out-name", "output"], check=True)

            return send_file(html_file, as_attachment=True, download_name="output.html")

    return render_template_string(FORM_HTML)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

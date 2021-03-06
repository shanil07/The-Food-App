from flask import Flask, render_template, request, redirect, flash, url_for
from werkzeug.utils import secure_filename
from ds_comp.prediction import *
from flask import jsonify

ALLOWED_EXTENTIONS = {'jpeg', 'jpg', 'png'}

app = Flask(__name__)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENTIONS


@app.route('/test')
def test():
    print(request)
    value = {
        "connection": True
    }
    return value


# @app.route('/')
# def index():
#     return render_template('index.html')


# @app.route('/upload_image/', methods=['POST', 'GET'])
@app.route('/', methods=['POST', 'GET'])
def upload_image():
    if request.method == 'POST':
        # checking for file
        if 'file' not in request.files:
            print('no file')
            return jsonify(filename="Unidentified", prediction="none")

        file = request.files['file']
        if file.filename == '':
            print('no selected file')
            return jsonify(filename="Unidentified", prediction="none")

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)

            obj = Prediction(filename, file)
            prediction = obj.make_pred()

            return jsonify(filename=filename, prediction=prediction)

    return jsonify(filename="Unidentified", prediction="none")


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')

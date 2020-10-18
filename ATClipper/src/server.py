from flask import  Flask, request
from flask_cors import CORS
from PreprocessingFunction import processMappedFile
import os
import json
from ATClipper import ATClipper

app = Flask(__name__)
CORS(app)

@app.route('/query', methods=['POST'])
def query():
    content = request.json

    print(content)
    ## TODO: Add Python script method here
    return content

@app.route('/add', methods=['POST'])
def add():
    form = request.form
    files = request.files

    try:
        jurisdiction = form["jurisdiction"]
        reportDate = form["reportDate"]
        mapping = json.loads(form["mapping"])
        file = files["data"]
    except:
        return {"failure": 'failure'}

    processMappedFile(mapping, file, jurisdiction)
    ## WORKS TIL HERE
    ATClipperObj = ATClipper('credentials.json')
    ATClipperObj.upload('AttorneyObjects.json')

    return {"success": 'success'}

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
    form = request.form
    files = request.files

    try:
        file = files["data"]
        query = form["query"]
        jurisdiction = form["jurisdiction"]
        startDate = form["startDate"]
        endDate = form["endDate"]
        exportSettings = json.loads(form["exportSettings"])

    except:
        return {"response": 'failure'}

    ## TODO: Call query

    ## TODO: Prepare response

    return {"response": "success"}

@app.route('/add', methods=['POST'])
def add():
    form = request.form
    files = request.files

    try:
        file = files["data"]
        settings = json.loads(form["settings"])
        jurisdiction = form["jurisdiction"]
        reportDate = form["reportDate"]
        mapping = json.loads(form["mapping"])
    except:
        return {"response": 'failure'}

    ## TODO: Call process mapped file
    # processMappedFile(mapping, file, jurisdiction)

    ## TODO: Upload to backend
    # ATClipperObj = ATClipper('credentials.json')
    # ATClipperObj.upload('AttorneyObjects.json')

    ## TODO: Prepare response

    return {"response": 'success'}

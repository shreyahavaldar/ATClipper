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
    ## Get the request attributes
    form = request.form
    files = request.files

    try:
        ## Get data from form
        file = files["data"]
        query = form["query"]
        jurisdiction = form["jurisdiction"]
        startDate = form["startDate"]
        endDate = form["endDate"]
        exportSettings = json.loads(form["exportSettings"])

        print(file)
        print(query)
        print(jurisdiction)
        print(startDate)
        print(endDate)
        print(exportSettings)

        ## TODO: Call query

        ## TODO: Prepare response
        
    except:
        return {"response": 'failure'}

    return {"response": "success"}

@app.route('/add', methods=['POST'])
def add():
    ## Get the request attributes
    form = request.form
    files = request.files

    ## Create the variable to store the number of updated lines
    updated = 0

    try:
        ## Get data from form
        file = files["data"]
        settings = json.loads(form["settings"])
        jurisdiction = form["jurisdiction"]
        reportDate = form["reportDate"]
        mapping = json.loads(form["mapping"])

        ## Process the file using the pre-processing script
        processMappedFile(mapping, file, jurisdiction)

        ## Create the credentials object
        ATClipperObj = ATClipper('credentials.json')

        # Upload the request to the backend
        updated = ATClipperObj.parallel_upload('AttorneyObjects.json', 10)
    except:
        return {"response": 'failure'}

    return {"response": 'success', "updated": updated }

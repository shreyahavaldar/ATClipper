from flask import  Flask, request
from flask_cors import CORS
from PreprocessingFunction import processMappedFile
import os
import json
import sys
from ATClipper import ATClipper

import json

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

        items = exportSettings.items()
        toNotExport = []
        for key, value in items:
            if not value:
                toNotExport += [key]

        print(file)
        print(query)
        print(jurisdiction)
        print(startDate)
        print(endDate)
        print(toNotExport)
        print("")

        ATClipperObj = ATClipper('credentials.json')
        importer = ATClipperObj.Import()

        importer.load_csv_string(file)
        result = ATClipperObj.parallel_query(importer,startDate,endDate,num_threads=50,query_type=query)
        result = result.export(toNotExport)
        resultList = result.to_json()

        return {"result": json.loads(resultList), "response": "success"}

    except:
        print("Unexpected error:", sys.exc_info()[0])
        return {"response": 'failure'}

@app.route('/add', methods=['POST'])
def add():
    ## Get the request attributes
    form = request.form
    files = request.files

    try:
        ## Get data from form
        file = files["data"]
        settings = json.loads(form["settings"])
        print(settings)
        jurisdiction = form["jurisdiction"]
        reportDate = form["reportDate"]
        mapping = json.loads(form["mapping"])

        ## Process the file using the pre-processing script
        processMappedFile(mapping, file, jurisdiction)

        ## Create the credentials object
        ATClipperObj = ATClipper('credentials.json')

        # Upload the request to the backend
        ATClipperObj.parallel_upload('AttorneyObjects.json', 10)
    except:
        return {"response": 'failure'}

    return {"response": 'success'}

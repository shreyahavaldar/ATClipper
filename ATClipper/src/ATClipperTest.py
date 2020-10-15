ATClipperObj = ATClipper.src.ATClipper('credentials.json')

#ATClipperObj.upload("AttorneyObjects.json")

importer = ATClipperObj.Import('today','tomorrow')

importer.load_mbox('myInbox.mbox')

matches = ATClipperObj.query(importer)

print(matches)

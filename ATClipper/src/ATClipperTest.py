import ATClipper
ATClipperObj = ATClipper.ATClipper('credentials.json')

#ATClipperObj.upload("../AttorneyObjects.json")

importer = ATClipperObj.Import('today','tomorrow')

#importer.load_mbox('myInbox.mbox')
importer.load_pst("sample2.pst")
print(importer.identifiers)
matches = ATClipperObj.query(importer)

print(matches)
#ATClipperObj.resetdb()
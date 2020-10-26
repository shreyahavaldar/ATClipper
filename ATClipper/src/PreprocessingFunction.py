import pandas as pd
from tkinter import filedialog
import json

# ------------ Minor Helper Functions --------------

def processAddress(columns, df):
    if(isinstance(columns, int)):
        return (dataframe.iloc[:, columns-1])
    else:
        addresses = []
        for x in range(len(dataframe)):
            address_temp = ""
            for c in columns:
                address_temp += str(dataframe.loc[x][c-1]).strip() + " "
            addresses.append(address_temp.strip())
        return addresses

def processName(columns, df):
    if(isinstance(columns, int)):
        return (dataframe.iloc[:, columns-1])
    else:
        names = []
        for x in range(len(dataframe)):
            name_temp = ""
            for c in columns:
                name_temp += str(dataframe.loc[x][dataframe.columns[c-1]]).strip() + " "
            names.append(name_temp)
        return names

def secondaryInfoColumns(mapping, dataframe):
    length = len(dataframe.iloc[0])
    secInfo = []
    for i in range(1, length+1):
        contains = False
        for m in mapping.values():
            if(isinstance(m, int)):
                if(m == i):
                    contains = True
            else:
                if(i in m):
                    contains = True
        if(not contains):
                secInfo.append(i)
    return secInfo

def getExcel():
    global dataframe
    import_file_path = filedialog.askopenfilename()
    dataframe = pd.read_excel(import_file_path)

def retrieveStateNameInput():
    global stateName
    stateName = StateName_Input.get("1.0","end-1c")
    root.destroy()

# ------------ Creating the Frontend --------------

# def createFrontend():
#     global root
#     root = tk.Tk()
#     canvas = tk.Canvas(root, width = 400, height = 400, bg = 'lightsteelblue')
#     canvas.pack()
#
#     #Create Excel File Upload
#     browseButton_Excel = tk.Button(text='Import Excel File', command=getExcel, bg='green', fg='white', font=('helvetica', 12, 'bold'))
#     canvas.create_text(200, 20, fill="darkblue", text="Please Upload the Attorney Data File")
#     canvas.create_window(200, 50, window=browseButton_Excel)
#
#     #Create Statename Input
#     global StateName_Input
#     StateName_Input = tk.Text(root, height=1, width=5)
#     canvas.create_text(175, 250, fill="darkblue", text="Which State's Data is being Uploaded? (2 Letter Abbreviation)")
#     canvas.create_window(365, 250, window=StateName_Input)
#
#     processFileButton = tk.Button(text='Process File', command=retrieveStateNameInput, bg='green', fg='white', font=('helvetica', 12, 'bold'))
#     canvas.create_window(200, 290, window=processFileButton)
#
#     root.mainloop()

# ------------ Reading the Dataframe --------------

def readDataFrame(mapping, dataframe):
    barNumberIndexes = []
    if(mapping["barNum"] != -1):
        for barNum in (dataframe.iloc[:, mapping["barNum"]]):
            barNumberIndexes.append(stateName + "_" + str(barNum))
    else:
        for i in range(len(dataframe)):
            barNumberIndexes.append("0")

    datesOfAdmission = []
    if(mapping["dateOfAdmission"] != -1):
        for x in (dataframe.iloc[:, mapping["dateOfAdmission"]]):
            datesOfAdmission.append(str(x).strip())
    else:
        for i in range(len(dataframe)):
            datesOfAdmission.append("0")

    names = []
    if(mapping["name"] != -1):
        names = processName(mapping["name"], dataframe)
    else:
        for i in range(len(dataframe)):
            names.append("0")

    phones1 = []
    if(mapping["phone1"] != -1):
        for x in (dataframe.iloc[:, mapping["phone1"]]):
            phones1.append(str(x).strip())
    else:
        for i in range(len(dataframe)):
            phones1.append("0")

    phones2 = []
    if(mapping["phone2"] != -1):
        for x in (dataframe.iloc[:, mapping["phone2"]]):
            phones2.append(str(x).strip())
    else:
        for i in range(len(dataframe)):
            phones2.append("0")

    emails1 = []
    if(mapping["email1"] != -1):
        for x in (dataframe.iloc[:, mapping["email1"]]):
            emails1.append(str(x).strip())
    else:
        for i in range(len(dataframe)):
            emails1.append("0")

    emails2 = []
    if(mapping["email2"] != -1):
        for x in (dataframe.iloc[:, mapping["email2"]]):
            emails2.append(str(x).strip())
    else:
        for i in range(len(dataframe)):
            emails2.append("0")

    addresses1 = []
    if(mapping["address1"] != -1):
        addresses1 = processAddress(mapping["address1"], dataframe)
    else:
        for i in range(len(dataframe)):
            addresses1.append("0")

    addresses2 = []
    if(mapping["address2"] != -1):
        addresses2 = processAddress(mapping["address2"], dataframe)
    else:
        for i in range(len(dataframe)):
            addresses2.append("0")

    firms = []
    if(mapping["firm"] != -1):
        for x in (dataframe.iloc[:, mapping["firm"]]):
            firms.append(str(x).strip())
    else:
        for i in range(len(dataframe)):
            firms.append("0")

    faxes = []
    if(mapping["fax"] != -1):
        for x in (dataframe.iloc[:, mapping["fax"]]):
            faxes.append(str(x).strip())
    else:
        for i in range(len(dataframe)):
            faxes.append("0")

    licenses = []
    if(mapping["license"] != -1):
        for x in (dataframe.iloc[:, mapping["license"]]):
            licenses.append(str(x).strip())
    else:
        for i in range(len(dataframe)):
            licenses.append("0")

    statuses = []
    if(mapping["status"] != -1):
        for x in (dataframe.iloc[:, mapping["status"]]):
            statuses.append(str(x).strip())
    else:
        for i in range(len(dataframe)):
            statuses.append("0")

    secInfoColumns = secondaryInfoColumns(mapping, dataframe)
    secondaryInfo = []
    if(len(secInfoColumns) != 0):
        for x in range(len(dataframe)):
            secinfo_temp = "{"
            for c in secInfoColumns:
                secinfo_temp += '"' + dataframe.columns[c-1] + '"' + ": " + '"' + str(dataframe.loc[x][c-1]).strip() + '"' + ", "
            secondaryInfo.append(secinfo_temp[:-2] + "}")
    else:
        for i in range(len(dataframe)):
            secondaryInfo.append("0")

    # JSON output
    class Attorney:
        def __init__(self, BarNumberIndex, DateOfAdmission, Name, Phone1, Phone2, Email1, Email2, Address1, Address2, Firm, Fax, License, Status, SecondaryInfo):
            self.BarNumberIndex = BarNumberIndex
            self.DateOfAdmission = DateOfAdmission
            self.Name = Name
            self.Phone1 = Phone1
            self.Phone2 = Phone2
            self.Email1 = Email1
            self.Email2 = Email2
            self.Address1 = Address1
            self.Address2 = Address2
            self.Firm = Firm
            self.Fax = Fax
            self.License = License
            self.Status = Status
            self.SecondaryInfo = SecondaryInfo

    def obj_dict(obj):
        return obj.__dict__

    Attorneys = []
    for i in range(len(dataframe)):
        temp = Attorney(barNumberIndexes[i], datesOfAdmission[i], names[i], phones1[i], phones2[i], emails1[i], emails2[i], addresses1[i], addresses2[i], firms[i], faxes[i], licenses[i], statuses[i], secondaryInfo[i])
        Attorneys.append(temp)

    json_string = json.dumps(Attorneys, default=obj_dict)

    with open('AttorneyObjects.json', 'w', encoding="utf8") as outfile:
        outfile.write(json_string)
    temp = open('AttorneyObjects.json')
    data = json.load(temp)
    with open("AttorneyObjects.json", 'w') as outfile:
        json.dump(data, outfile, indent = 4)

# ------------ Main Call --------------

# mapping = {
#   "barNum": 1,
#   "dateOfAdmission" : 2,
#   "name" : [5, 4],
#   "phone1" : 15,
#   "phone2" : -1,
#   "email1" : 17,
#   "email2" : -1,
#   "address1" : [7,8,9,10,11,12],
#   "address2" : -1,
#   "firm" : 18,
#   "fax" : 16,
#   "license" : -1,
#   "status" : 6
# }

def processMappedFile(mapping, fileName, jurisdiction):
    global dataframe
    global stateName
    dataframe = pd.read_excel(fileName)
    stateName = jurisdiction
    readDataFrame(mapping, dataframe)

#processMappedFile(mapping)

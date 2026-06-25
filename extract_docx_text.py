from docx import Document
import os
path = 'testdata/Vtiger_Create_Contact_Requirement_Document.docx'
if not os.path.exists(path):
    raise FileNotFoundError(path)
doc = Document(path)
for para in doc.paragraphs:
    text = para.text.strip()
    if text:
        print(text)

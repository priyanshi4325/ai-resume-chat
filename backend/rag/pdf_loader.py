from pypdf import PdfReader

def load_resume(path):
    reader = PdfReader(path)
    text = ""

    for page in reader.pages:
        text += page.extract_text()

    return text
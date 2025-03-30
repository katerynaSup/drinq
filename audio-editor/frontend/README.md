#Set up the backend
```cd backend```
Start virtual environment:
```python -m venv venv```

on mac: ```source venv/bin/activate```
on windows: ```venv\Scripts\activate```

Please check that the venv is in your backend directory.
To deactivate venv:
```deactivate```

Install dependencies:
```pip install -r requirements.txt```

Start the server:
```python app.py```
or
```uvicorn app:app --host 0.0.0.0 --port 5001 --reload```

#Set up the frontend
```cd frontend```

Install dependencies:
```npm install```

#Start backend server
```cd backend```
```python app.py```

#Start frontend server
```cd frontend```
You might need to run ```npm install``` first.
```npm run dev```

Any recordings that you upload on the website are added to backend/uploads directory but are not pushed to the repo.

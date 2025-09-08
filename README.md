From this project, what I really learned is how the backend and frontend work together around data. I took a JSON file and learned how to load it into Django, build models, and then expose that data through an API using Django REST Framework. That’s the foundation of making a backend useful.

On the frontend side, I figured out how to connect React to that API, fetch the data, display it in a table, make edits, and send those edits back to the backend which is CRUD in action. You also learned how to take the same data and turn it into charts, which is the start of data visualization.


So the summary is, this project showed me end-to-end how to handle data, from storage, to serving it, to letting users interact with it in the browser. That’s the core of being a full-stack developer.

### How to run:

from backend run: python manage.py runserver
endpoints to use in browser
  http://127.0.0.1:8000/api/trades/ (list)
  http://127.0.0.1:8000/api/trades/tradecodes/ (dropdown values)
  http://127.0.0.1:8000/api/trades/series/?trade_code=<one-code> (chart data)

from frontend run: npm run dev
open the url vite prints: http://localhost:5173/

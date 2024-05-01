Using Django, please create a simple API which serves quiz content, evaluates answers provided for the quiz questions, and then serves the results.
The quizzes should contain questions with multiple answers to choose from.

Please create two question types:

Single answer - only one answer out of the possible choices is correct.
Multi answer - more than one answer out of the possible choices is correct. (All correct options should be selected to be evaluated as correct)
Select a word(s) - a word or multiple words in a sentence will be the answer of a prompt (correct words not necessarily in order)

The API should send and receive all data in JSON format.

When answers are sent to the API for evaluation, the data should be validated. If the received data passes validation, the answers should be evaluated and a response containing a score should be sent. If the data does not pass validation, an appropriate error message should be sent in the response. (We use Django REST framework serializers for validation).

Please provide mock JSON data with which to test your API. This data should include at least two lessons, with two sets of answers for each lesson. One lesson that should pass and one that should fail validation and trigger the appropriate response. (The content of the questions and answers is not important, you can use https://www.lipsum.com/)

Basic authentication with some mock accounts for testing.

Records of user statistics, displayed on demand. Things like average score, number of quizzes completed, anything else you think is appropriate.

As this is a full-stack role, you should also create a basic front-end for your work. Preferably in React (and preferably in Typescript)).

Please create a public GitHub repo containing your API as well as a hosted production version of your application.
Please provide us the link to both of these so we can test your work and analyse your code.
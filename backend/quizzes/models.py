from django.db import models
from django.contrib.auth.models import User

class Quiz(models.Model):
	author = models.ForeignKey(User, on_delete=models.DO_NOTHING)
	title = models.CharField(max_length=255, default='')
	created_at = models.DateTimeField(auto_now_add=True)
	times_taken = models.IntegerField(default=0, editable=False)

	@property
	def question_count(self):
		return self.questions.count()
	
	class Meta:
		verbose_name_plural = "Quizzes"
		ordering = ['id']

	def __str__(self):
		return self.title

class Question(models.Model):
	quiz = models.ForeignKey(
		Quiz, 
		related_name='questions', # need related name for hyper link related field to work ?!?
		on_delete=models.DO_NOTHING
	)
	prompt = models.CharField(max_length=255, default='')

	class Meta:
		ordering = ['id']

	def __str__(self):
		return self.prompt

class Answer(models.Model):
	question = models.ForeignKey(
		Question, 
		related_name='answers', 
		on_delete=models.DO_NOTHING
	)
	text = models.CharField(max_length=255)
	correct = models.BooleanField(default=False)

	class Meta:
		ordering = ['id']

	def __str__(self):
		return self.text


class UserResponse(models.Model):
	user        = models.ForeignKey(User, on_delete = models.CASCADE)
	quiz        = models.ForeignKey(Quiz, on_delete = models.CASCADE)
	question    = models.ForeignKey(Question, on_delete = models.CASCADE)
	user_answers = models.CharField(max_length = 150)
	submit_id = models.CharField(max_length = 150)
	created_at = models.DateTimeField(auto_now_add=True)
	score = models.IntegerField(default=0)

	def __str__(self):
		return self.user.username + " => " + self.user_answers
	

class UserRecord(models.Model):
	user = models.ForeignKey(User, on_delete = models.CASCADE)
	quiz = models.ForeignKey(Quiz, on_delete = models.CASCADE)
	submit_id = models.CharField(max_length = 150)
	score = models.FloatField(default=0.0)

	def __str__(self):
		return self.user.username + " => " + str(self.score)
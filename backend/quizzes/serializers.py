from rest_framework import serializers

from . import models

class QuizSerializer(serializers.ModelSerializer):
	questions = serializers.HyperlinkedRelatedField(
		many=True,
		read_only=True,
		view_name='apiv2:question-detail'
	)

	def getFullname(self, obj):
		return obj.author.first_name + ' ' + obj.author.last_name

	def getQuestionCount(self, obj):
		return obj.question_count

	author_fullname = serializers.SerializerMethodField("getFullname")
	question_count = serializers.SerializerMethodField("getQuestionCount")

	class Meta:
		fields = [
			'id',
			'title',
			'author',
			'author_fullname',
			'question_count',
			'created_at',
			'questions'
		]
		model = models.Quiz

class AnswerSerializer(serializers.ModelSerializer):
	class Meta:
		fields = [
			'id',
			'text',
			'correct',
		]
		model = models.Answer

class QuestionSerializer(serializers.ModelSerializer):
	answers = AnswerSerializer(
		read_only=True,
		many=True
	)

	class Meta:
		fields = [
			'id',
			'quiz',
			'prompt',
			'answers'
		]
		model = models.Question


def is_response_valid(correct_counts, response_counts):
	if response_counts == 0:
		return serializers.ValidationError('Choose answers')
	if correct_counts == 1:
		if response_counts > 1:
			return serializers.ValidationError('Choose only one answer')
	else:
		if response_counts != correct_counts:
			return serializers.ValidationError('Choose {correct_counts} answers')
	return True


class UserResponseSerializer(serializers.ModelSerializer):
	class Meta:
		fields = '__all__'
		model = models.UserResponse


class RequestSerializer(serializers.Serializer):
	quiz_id = serializers.IntegerField()
	user_response = serializers.IntegerField()

	def validate(self, data):
		quiz_id = data.data['quiz_id']
		user_response = data.data['user_response']
		user = data.user

		quiz = models.Quiz.objects.get(pk=quiz_id)
		user = models.User.objects.get(pk=user)
		answers = models.Answer.objects.filter(question__quiz=quiz)
		questions = quiz.questions.all()

		if len(questions) != len(answers):
			raise serializers.ValidationError('Invalid number of answers')

		for question, answer in zip(questions, answers):
			correct_counts = question.answers.filter(correct=True).count()
			response_counts = len(answer)
			is_val = is_response_valid(correct_counts, response_counts)
			if is_val != True:
				return is_val

		return True
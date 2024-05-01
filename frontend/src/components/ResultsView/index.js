import React from 'react'

import { Header, Menu, Button } from 'semantic-ui-react';

const lightgreen = 'rgba(0,211,0,0.2)'
const lightred = 'rgba(211,0,0,0.2)'

class ResultsView extends React.Component {
	componentDidMount() {
		const { isConfirm } = this.props;

		if (isConfirm === true) {
			this.markQuiz()
		}
	}

	RenderQuestionAndAnswers = () => {
		const {
			allQuestions,
			allEvaluation
		} = this.props;

		return (
			allQuestions.map((question, count) => {
				const answers = question.answers
				return (
					<div 
						style={{ marginBottom: '1.5em'}}
						key={question.id}
					>
						<Header as='h3'>{count + 1}. {question.prompt}</Header>
						{ allEvaluation[count].score === 1 ? 
							<p style={{color: 'green', fontSize: '1em'}}>Correct</p> :
							<p style={{color: 'red', fontSize: '1em'}}>Incorrect</p>
						}
						<Menu vertical fluid style={{maxWidth: '60%', boder: '1px solid red'}}>
							{ answers.map((answer, id) => {
								var backgroundColor = undefined
								backgroundColor = null
								return (
									<Menu.Item key={id} style={{backgroundColor: backgroundColor}}>
										{} {answer.text} 
									</Menu.Item>
								)
							})}
						</Menu>
					</div>
				)
			})			
		)
	}

	markQuiz = () => {
		const { 
			chosenQuizId, 
			allQuestions, 
			userAnswers,
			fetchQuizEvaluation
		} = this.props;
		var user_responses_sync = [];
		for (var i = 0; i < allQuestions.length; i++) {
			var question = allQuestions[i]
			if (userAnswers[i] === undefined) {
				userAnswers[i] = []
			}
			var answer_data = {"question_id": question.id, "answers": userAnswers[i]} 
			user_responses_sync.push(answer_data)
		}

		fetchQuizEvaluation(chosenQuizId, user_responses_sync)
	}

	render() {
		const { 
			allQuestions,
			updateChosenQuizId,
			fetchQuizzes,
			setIsFetchingQuizzes,
			allEvaluation,
			setIsConfirm,
			isConfirm,
		} = this.props;

		return (
			<div style={{maxHeight: '100vh'}}>
				<div style={{height: '80%', width: '100%', padding: '0.5em', overflowY: 'auto'}}>
				{ (allQuestions !== undefined && allQuestions.length > 0 && allEvaluation !== undefined) &&
					<this.RenderQuestionAndAnswers /> }
				</div>
				<div style={{marginTop: '1em'}}>
					<Button
						color='green'
						content='Take another quiz'
						onClick={() => {
							updateChosenQuizId(undefined)
							setIsFetchingQuizzes(true)
							fetchQuizzes()
							setIsConfirm(undefined)
						}}
					/>
				</div>
			</div>
		)
	}
}

export default ResultsView;
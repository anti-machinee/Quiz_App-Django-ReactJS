import React from 'react';
import BottomBar from '../BottomBar';

import { Header, Menu, Modal, Button } from 'semantic-ui-react';

const RenderQuestions = (props) => {
	const { answers, userInput, handleClick } = props;
	const keys = Object.keys(answers);

	return (
		<Menu vertical fluid>
			{ keys.map((key, keyID) => {
				return (
					<Menu.Item
						key={keyID}
						onClick={() => handleClick(key)}
						active={userInput.includes(key)}
					>
						{answers[key]}
					</Menu.Item>
				)
			})}
		</Menu>
	)
}

const ConfirmSubmitModal = ({
	open,
	setOpen,
	totalQuestions,
	userAnswers,
	reviewList,
	chosenQuizId,
	setIsFetchingAllQuestions,
	fetchAllQuestionsUnderQuiz,
	setIsConfirm
}) => {

	// get how many user answers are missing + empty
	function getUnasweredCount() {
		const userAnswerKeys = Object.keys(userAnswers);
		var count = totalQuestions - userAnswerKeys.length;
		Object.entries(userAnswers).forEach(([key, value]) => count += value.length === 0 ? 1 : 0)
		return count;
	}

	const reviewCount = reviewList.length;
	const unansweredCount = getUnasweredCount()

	return (
		<Modal
			onClose={() => setOpen(false)}
			onOpen={() => setOpen(true)}
			open={open}
			size='mini'
		>
			<Modal.Header>Confirm your Submission</Modal.Header>
			<Modal.Content>
				<p>Are you sure you would like to submit your answers?</p>
				{ (unansweredCount > 0 || reviewCount > 0) && 
					<div>
						You have: 
						<ul>
							{unansweredCount > 0 && <li><b>{unansweredCount}</b> questions left unaswered</li>}
							{reviewCount > 0 && <li><b>{reviewCount}</b> questions left for review</li>}
						</ul>
					</div>
				}
			</Modal.Content>
			<Modal.Actions>
				<Button basic color='red' content='Cancel' onClick={() => setOpen(false)} />
				<Button 
					basic 
					color='green' 
					content='Confirm' 
					onClick={() => {
						setIsFetchingAllQuestions(true);	
						fetchAllQuestionsUnderQuiz(chosenQuizId);
						setOpen(false)
						setIsConfirm(true)
					}} 
				/>
			</Modal.Actions>
		</Modal>
	)
}

class QABody extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userInput: [],
			isConfirmModalOpen: false
		}
		this.handleAnswerClick = this.handleAnswerClick.bind(this);
		this.handleMultChoice = this.handleMultChoice.bind(this);
		this.setIsConfirmModalOpen = this.setIsConfirmModalOpen.bind(this);
	}

	// on question change, update local state userInput to Redux store's userAnswers[questionNum]
	componentDidUpdate(prevProps) {
		const { questionBody, userAnswers } = this.props;

		if (prevProps.questionBody !== this.props.questionBody) {
			var previousUserInput = []

			if (userAnswers[questionBody.number - 1]) {
				previousUserInput = userAnswers[questionBody.number - 1]
			}

			this.setState({ 
				userInput: previousUserInput,
			})
		}
	}

	handleMultChoice(inputAnswer) {
		const { userInput } = this.state;
		var newUserInput = []
		newUserInput.push(...userInput);

		// for mult choice if user clicks the same answer, that answer is removed from user input list
		const inputAnswerIndex = newUserInput.indexOf(inputAnswer);
		if (inputAnswerIndex !== -1) {
			newUserInput.splice(inputAnswerIndex, 1);
		} else {
			newUserInput.push(inputAnswer)
		}

		this.setState({
			userInput: newUserInput
		})
	}

	// handle answer item click based on whether single choice Q or multiple choice
	handleAnswerClick(inputAnswer) {
		this.handleMultChoice(inputAnswer)
	}

	setIsConfirmModalOpen(value) {
		this.setState({
			isConfirmModalOpen: value
		})
	}

	render() {
		const { 
			totalQuestions,
			reviewList,
			updateReviewList,
			userAnswers,
			updateUserAnswers,
			chosenQuizId,
			fetchPaginatedQuestion,
			setIsFetchingAllQuestions,
			fetchAllQuestionsUnderQuiz,
			setIsConfirm
		} = this.props;
		const {
			number,
			question,
			answers,
			correct,
			next,
			prev
		} = this.props.questionBody;
		const { 
			userInput, 
			hasMultipleAnsewrs,
			isConfirmModalOpen,
		} = this.state;

		return (
			<div>
				<ConfirmSubmitModal
					open={isConfirmModalOpen}
					setOpen={this.setIsConfirmModalOpen}
					totalQuestions={totalQuestions}
					userAnswers={userAnswers}
					reviewList={reviewList}
					chosenQuizId={chosenQuizId}
					setIsFetchingAllQuestions={setIsFetchingAllQuestions}
					fetchAllQuestionsUnderQuiz={fetchAllQuestionsUnderQuiz}
					setIsConfirm={setIsConfirm}
				/>
				<div id="questionPromptDiv" style={{minHeight: '70px', maxHeight: '70px', overflowY: 'auto'}}>
					<Header as='h3'>
					{number}. {question}
					{ hasMultipleAnsewrs && 
						<Header.Subheader>(Choose {correct.length}.)</Header.Subheader>
					}
					</Header>
				</div>
				<div
					id='QuestionAndMenuDiv'
					style = {{
						marginTop: '0.5em',
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-between',
					}}
				>
					<div style={{minHeight: '210px', maxHeight: '210px', overflowY: 'auto'}}>
						<RenderQuestions 
							number={number} 
							answers={answers} 
							userInput={userInput} 
							handleClick={this.handleAnswerClick} 
						/>							
					</div>

					<BottomBar 
						questionNum={number}
						totalQuestions={totalQuestions}
						reviewList={reviewList}
						updateReviewList={updateReviewList}
						userInput={userInput}
						userAnswers={userAnswers}
						updateUserAnswers={updateUserAnswers}
						nextLink={next}
						prevLink={prev}
						chosenQuizId={chosenQuizId}
						fetchPaginatedQuestion={fetchPaginatedQuestion}
						setIsConfirmModalOpen={this.setIsConfirmModalOpen}
					/>
				</div>
			</div>
		);
	}
}

export default QABody;
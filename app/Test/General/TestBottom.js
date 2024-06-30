const TestBottom = ({showBackButton, testEnded, checkedResult, onNext, onCheck, onBack }) => {

    // const showBackButton = currentTestNum > 0

    const showNextButton = checkedResult || testEnded
    const showCheckButton = !showNextButton
    // const showBackButton = true
    return (
        <div className={"flex flex-row " + (showBackButton ? ' justify-between' : 'justify-end')}>
            {showBackButton && <BackButton onClick={onBack} />}
            {showNextButton && <NextButton testEnded={testEnded} onClick={onNext} />}
            {showCheckButton && <CheckResultButton onClick={onCheck} />}
        </div>)
}


export default TestBottom

export const BackButton = ({ onClick }) => {

    return (
        <div className="flex justify-end">
            <button
                onClick={onClick}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Back
            </button>
        </div>
    )
}

export const NextButton = ({ testEnded, onClick }) => {
    let label = 'Start Test'
    if (!testEnded) {
        label = 'Next'
    } else {
        label = 'End Test'
    }

    return (
        <div className="flex justify-end">
            <button
                onClick={onClick}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                {label}
            </button>
        </div>
    )
}

export const CheckResultButton = ({ onClick, }) => {

    return (
        <div className="flex justify-end">

            <button
                onClick={onClick}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
                Check Result
            </button>
        </div>
    )
}
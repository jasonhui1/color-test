import { useEffect } from "react"

const TestBottom = ({ showBackButton = false, testEnded, checkedResult, onNext, onCheck, onBack, showRetryButton = false, onRetry = null }) => {

    // const showBackButton = currentTestNum > 0

    const showNextButton = checkedResult || testEnded
    const showCheckButton = !showNextButton
    // const showBackButton = true
    return (
        <div className={"flex flex-row " + (showBackButton ? ' justify-between' : 'justify-end')}>
            {showBackButton && <BackButton onClick={onBack} />}
            {showNextButton && <NextButton testEnded={testEnded} onClick={onNext} />}
            {showCheckButton && <CheckResultButton onClick={onCheck} />}
            {showRetryButton && <RetryButton onClick={onRetry} />}
        </div>)
}


export default TestBottom

const Button = ({ label, onClick, color = 'blue-500', hoverColor = 'blue-600', textColor = 'text-white' }) => {

    const bgColor = `bg-${color}`
    const hoverBgColor = `hover:bg-${hoverColor}`
    return (
        <button
            onClick={onClick}
            className={`${bgColor} ${textColor} px-4 py-2 rounded ${hoverBgColor}`}
        >
            {label}
        </button>
    )
}

export const BackButton = ({ onClick }) => {
    return (
        <Button label={'Back'} onClick={onClick} color='slate-200' hoverColor="slate-300" textColor="text-gray-700" />
    )
}

export const RetryButton = ({ onClick }) => {
    return (
        <Button label={'Retry'} onClick={onClick} />
    )
}

export const NextButton = ({ testEnded, onClick }) => {
    let label = 'Start Test'
    if (!testEnded) {
        label = 'Next'
    } else {
        label = 'End Test'
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'w') {
                if (!testEnded) {
                    onClick();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClick]);
    return (

        <div className="flex justify-end">
            <Button label={label} onClick={onClick} />
        </div>
    )
}

export const CheckResultButton = ({ onClick, }) => {

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'w') {
                onClick();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClick]);

    return (
        <div className="flex justify-end">
            <Button label={'Check Result'} onClick={onClick} color="green-500" hoverColor="green-600" />
        </div>
    )
}
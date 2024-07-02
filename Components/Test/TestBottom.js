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

const Button = ({ label, onClick, color = 'bg-blue-500', hoverColor = 'bg-blue-600', textColor = 'text-white' }) => {
    return (
        <button
            onClick={onClick}
            className={`${color} ${textColor} px-4 py-2 rounded hover:${hoverColor}`}
        >
            {label}
        </button>
    )
}

export const BackButton = ({ onClick }) => {
    return (
        <Button label={'Back'} onClick={onClick} />
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
            <Button label={'Check Result'} onClick={onClick} color="bg-green-500" hoverColor="bg-green-600" />
        </div>
    )
}
import { ShortTextInput } from './ShortTextInput'
import { DeleteButton, SendButton } from '@/components/SendButton'
import { isMobile } from '@/utils/isMobileSignal'
import { createSignal, onMount } from 'solid-js'

type Props = {
    placeholder?: string
    backgroundColor?: string
    textColor?: string
    sendButtonColor?: string
    defaultValue?: string
    fontSize?: number
    onSubmit: (value: string) => void
    onDelete: () => void
}

const defaultBackgroundColor = '#ffffff'
const defaultTextColor = '#303235'

export const TextInput = (props: Props) => {
    const [inputValue, setInputValue] = createSignal(props.defaultValue ?? '')
    let inputRef: HTMLInputElement | HTMLTextAreaElement | undefined

    const handleInput = (inputValue: string) => setInputValue(inputValue)

    const checkIfInputIsValid = () => inputValue() !== '' && inputRef?.reportValidity()

    const submit = () => {
        if (checkIfInputIsValid()) props.onSubmit(inputValue())
        setInputValue('')
    }

    const submitWhenEnter = (e: KeyboardEvent) => {
        // Check if IME composition is in progress
        const isIMEComposition = e.isComposing || e.keyCode === 229
        if (e.key === 'Enter' && !isIMEComposition) submit()
    }

    const deleteMsg = () => {
        props.onDelete()
    }

    onMount(() => {
        if (!isMobile() && inputRef) inputRef.focus()
    })

    return (
        <div
            class={'flex items-end justify-between chatbot-input'}
            data-testid='input'
            style={{
                'border-top': '1px solid #eeeeee',
                position: 'absolute',
                left: '20px',
                right: '20px',
                bottom: '90px',
                margin: 'auto',
                "z-index": 1000,
                "background-color": props.backgroundColor ?? defaultBackgroundColor,
                color: props.textColor ?? defaultTextColor
            }}
            onKeyDown={submitWhenEnter}
        >
            <ShortTextInput
                ref={inputRef as HTMLInputElement}
                onInput={handleInput}
                value={inputValue()}
                fontSize={props.fontSize}
                placeholder={props.placeholder ?? 'Type your question'}
            />
            <SendButton sendButtonColor={props.sendButtonColor} type='button' isDisabled={inputValue() === ''} class='my-2 ml-2' on:click={submit}>
                <span style={{ 'font-family': 'Poppins, sans-serif' }}>Send</span>
            </SendButton>
            <DeleteButton sendButtonColor={props.sendButtonColor} type='button' class='my-2 ml-2' on:click={deleteMsg}>
                <span style={{ 'font-family': 'Poppins, sans-serif' }}>Delete</span>
            </DeleteButton>
        </div>
    )
}

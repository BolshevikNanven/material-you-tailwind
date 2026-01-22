import { LogosGoogleIcon } from '../logos/google-icon'
import { Button } from '../ui/button'
import { TextField } from '../ui/text-field'

export default function AuthExample() {
    return (
        <div className='flex h-full w-full items-center justify-center bg-surface-container'>
            <div className='flex w-[940px] max-w-full flex-col rounded-4xl bg-surface p-9'>
                <LogosGoogleIcon className='mb-6 size-10' />
                <div className='grid grid-cols-2 gap-6'>
                    <div className='flex flex-col gap-4'>
                        <h1 className='text-3xl'>Sign in</h1>
                        <p className='text-sm text-on-surface-variant'>
                            with your Account. This account will be available to other Google apps in the browser.
                        </p>
                    </div>
                    <div className='flex flex-col'>
                        <TextField label='Email or phone' />
                        <span className='cursor-pointer self-baseline py-2 text-sm text-primary'>Forgot email?</span>
                        <div className='my-5 text-sm'>
                            Not your computer? Use Guest mode to sign in privately.
                            <a className='cursor-pointer pl-1 text-primary hover:underline'>
                                Learn more about using Guest mode
                            </a>
                        </div>
                        <div className='mt-auto flex flex-row-reverse gap-4 pt-4'>
                            <Button className='px-6'>Next</Button>
                            <Button variant={'text'}>Create Account</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

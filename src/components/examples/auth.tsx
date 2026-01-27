import { SimpleIconsApple } from '../logos/apple'
import { SimpleIconsGithub } from '../logos/github'
import { LogosGoogleIcon } from '../logos/google-icon'
import { Button } from '../ui/button'
import { Chip } from '../ui/chip'
import { TextField } from '../ui/text-field'

export default function AuthExample() {
    return (
        <div className='flex h-full w-full items-center justify-center bg-surface-container'>
            <div className='flex w-[940px] max-w-full flex-col rounded-4xl bg-surface p-9'>
                <LogosGoogleIcon className='mb-6 size-10' />
                <div className='grid grid-cols-2 gap-6'>
                    <div className='flex flex-col'>
                        <h1 className='mb-4 text-3xl'>Sign in</h1>
                        <p className='text-sm text-on-surface-variant'>
                            with your Account. This account will be available to other apps in the browser.
                        </p>
                        <p className='mt-6 mb-2 text-sm text-on-surface-variant'>Or continue with:</p>
                        <div className='flex gap-2'>
                            <Chip className='pl-2'>
                                <SimpleIconsGithub className='size-4.5' />
                                Github
                            </Chip>
                            <Chip className='pl-2'>
                                <SimpleIconsApple className='size-4.5' />
                                Apple
                            </Chip>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <TextField label='Email or phone' className='mb-4' />
                        <TextField type='password' label='Password' />
                        <span className='cursor-pointer self-baseline py-2 text-sm text-primary underline-offset-1 hover:underline'>
                            Forgot password?
                        </span>
                        <div className='mt-auto flex flex-row-reverse gap-4 pt-4'>
                            <Button className='px-6'>Login</Button>
                            <Button variant={'text'}>Create Account</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

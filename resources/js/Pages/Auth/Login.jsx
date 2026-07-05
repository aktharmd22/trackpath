import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout
            title="Welcome back"
            subtitle="Log in to pick up where you left off."
        >
            <Head title="Log in" />

            {status && (
                <div className="mb-6 rounded-field bg-positive-tint px-4 py-3 text-sm font-medium text-positive">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1.5 block w-full"
                        autoComplete="username"
                        placeholder="you@example.com"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1.5 block w-full"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex min-h-tap cursor-pointer items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-muted">
                            Remember me
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-field text-sm font-medium text-muted transition hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <PrimaryButton className="w-full" disabled={processing}>
                    {processing ? 'Logging in…' : 'Log in'}
                </PrimaryButton>
            </form>

            <p className="mt-8 text-center text-sm text-muted">
                New here?{' '}
                <Link
                    href={route('register')}
                    className="font-semibold text-ink underline underline-offset-4 hover:no-underline"
                >
                    Create an account
                </Link>
            </p>
        </GuestLayout>
    );
}

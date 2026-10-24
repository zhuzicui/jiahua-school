"use client";

import { useActionState } from "react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { signIn } from "./actions";

export const SignInForm = ({ labels }: { labels: { password: string; signIn: string; wrongPassword: string } }) => {
    const [state, action, pending] = useActionState(signIn, undefined);
    return (
        <form action={action} className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <Input name="password" type="password" label={labels.password} autoComplete="current-password" isRequired autoFocus />
                {/* Shown as plain text, not as an invalid field, so the browser still lets staff try again. */}
                {state?.error === "wrong" && (
                    <p role="alert" className="text-sm text-error-primary">
                        {labels.wrongPassword}
                    </p>
                )}
            </div>
            <Button type="submit" size="lg" isLoading={pending} showTextWhileLoading>
                {labels.signIn}
            </Button>
        </form>
    );
};

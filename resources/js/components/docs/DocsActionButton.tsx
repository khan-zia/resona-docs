import type { ButtonHTMLAttributes } from 'react';

type DocsActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    fullWidth?: boolean;
};

function classes(...values: Array<string | undefined | false>): string {
    return values.filter(Boolean).join(' ');
}

export default function DocsActionButton({
    className,
    fullWidth = true,
    type = 'button',
    ...props
}: DocsActionButtonProps) {
    return (
        <button
            type={type}
            className={classes(
                'rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20',
                fullWidth && 'w-full',
                className,
            )}
            {...props}
        />
    );
}

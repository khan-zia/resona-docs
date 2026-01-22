import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import type { ComponentType } from 'react';
import { renderToString } from 'react-dom/server';

createServer((page) =>
    createInertiaApp({
        page,
        render: renderToString,
        resolve: (name) => {
            const pages = import.meta.glob<{ default: ComponentType }>('./Pages/**/*.tsx', { eager: true });
            return pages[`./Pages/${name}.tsx`].default;
        },
        setup: ({ App, props }) => <App {...props} />,
    }),
);

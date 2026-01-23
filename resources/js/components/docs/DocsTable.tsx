import React from 'react';

interface DocsTableProps {
    headers: string[];
    rows: Array<Array<string | React.ReactNode>>;
}

export default function DocsTable({ headers, rows }: DocsTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-white/5 bg-slate-900/40">
            <table className="w-full text-left text-sm border-collapse">
                <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                        {headers.map((header, i) => (
                            <th 
                                key={i} 
                                className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {rows.map((row, i) => (
                        <tr key={i} className="group transition-colors hover:bg-white/[0.01]">
                            {row.map((cell, j) => (
                                <td key={j} className="px-4 py-4 text-slate-300 font-medium">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

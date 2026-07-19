import { useState } from 'react';

export function useDownloader() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    async function handleDownload(url, format, quality) {
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch('/api/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, format, quality }),
            });

            if (!response.ok) {
                throw new Error('Download failed');
            }

            const blob = await response.blob();
            const downloadUrl1 = window.URL.createObjectURL(blob);

            const disposition = response.headers.get('Content-Disposition');
            const filenameMatch = disposition && disposition.match(/filename="(.+)"/);
            const filename = filenameMatch ? filenameMatch[1] : `download.${format}`;

            setResult({ filename, downloadUrl: downloadUrl1, format, quality });

            //auto trigger
            const a = document.createElement('a');
            a.href = downloadUrl1;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downloadUrl1);
        } catch (err) {
            console.error(err);
            setError('Something went wrong downloading the file.');
        } finally {
            setLoading(false);
        }
    }

    return { loading, error, result, handleDownload };
}
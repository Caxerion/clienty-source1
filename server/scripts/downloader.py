import sys
import yt_dlp

def download(url, format_type, quality, output_path):
    if format_type == "mp3":
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': output_path,
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
        }
    else:  # for mp4
        height = quality.replace('p', '') if quality != 'best' else None
        if height:
            format_str = (
                f'bestvideo[height<={height}][vcodec^=avc1]+bestaudio[ext=m4a]/'
                f'bestvideo[height<={height}]+bestaudio/'
                f'best[height<={height}]'
            )
        else:
            format_str = (
                'bestvideo[vcodec^=avc1]+bestaudio[ext=m4a]/'
                'bestvideo+bestaudio/'
                'best'
            )
        ydl_opts = {
            'format': format_str,
            'outtmpl': output_path,
            'merge_output_format': 'mp4',
            'postprocessor_args': {
                'FFmpegMerger': ['-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k']
            },
        }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])


if __name__ == "__main__":
    url = sys.argv[1]
    format_type = sys.argv[2]
    quality = sys.argv[3]
    output_path = sys.argv[4]
    download(url, format_type, quality, output_path)
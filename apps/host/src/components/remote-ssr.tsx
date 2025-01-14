import { component$, SSRStream } from '@builder.io/qwik';
import { Readable } from 'stream';

export interface Props {
	name: string;
	path: string;
}

export default component$(({ name, path }: Props) => {
	return (
		<div class='remote-component'>
			<p class="remote-label">{path}</p>
			<SSRStream>
				{async (stream) => {
					const res = await fetch(path);
					const reader = res.body as unknown as Readable;
					reader.setEncoding('utf8');
					reader.on('data', (chunk) => {
						chunk = String(chunk).replace(
							'<link rel="stylesheet" href="/',
							`<link rel="stylesheet" href="${path}/`
						);
						// .replace('q:base="/build/"', `q:base="${path}/build/"`)
						// .replace('src="/', `src="${path}/`)
						// .replace('href="/', `href="${path}/`)

						stream.write(chunk);
					});

					return new Promise((resolve) => {
						reader.on('end', resolve);
					});
				}}
			</SSRStream>
		</div>
	);
});

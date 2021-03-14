import { useLanyard } from "use-lanyard";

export default function Activity() {
	const { data: activity } = useLanyard("291050399509774340");

	return (
		<pre>
			<code>{JSON.stringify(activity, null, 2)}</code>
		</pre>
	);
}

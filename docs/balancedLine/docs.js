(function () {
    const ver = BASE.version || "balanced";
    const preMap = {};

    preMap.balanced = `
	<h4>Balanced lines</h4>
	<p>In the balanced line, all processes have the same average capacity,
	so we would expect similar throughput in each line.
	This simulation tests that expectation.</p>
<ul><li>Run the <a href="index.html?ver=capped">Capped line</a> instead.</li>
</ul>`;
    preMap.capped = `
	<h4>Capped lines</h4>
	<p>In the capped line, all processes have the same average capacity,
	but the first operation's capacity is tied to the actual throughput of the
	last operation. That is, only enough material is released to the first process to replace 
    what the line actually outputs. This has the effect of maintaining the work-in-process,
    since the number of units started matches the number of units completed.
	This simulation tests the effect of limiting WIP in this way.</p>
    <ul><li>Run the <a href="index.html?ver=balanced">Balanced line</a> instead.</li>
</ul>`;


    const postMap = {};
    postMap.balanced = `
		<p>In practice, the later operations always perform worse than the first ones.
		Even though the average capacity is the same, operations can still be
		delayed by a lack of work. This never happens to the first operation, which takes
		directly from the raw material store. But it is possible with the other
		operations. And any delay tends to impact operations down the line. So the last
		operation is affected not only by its own delays, but also by the delays of
		all the upstream operations that feed it.
		</p>
	`;
    postMap.capped = `
		<p>Controlling the level of WIP also controls the variable costs of the lines.
		So even though the throughput may be slightly less, and the efficiencies of the
		operations is much worse, the net profit is almost always much better.
		</p>
	`;
    BASE.getEl('#preamble').innerHTML = preMap[ver];
    BASE.getEl('#postamble').innerHTML = postMap[ver];
}());

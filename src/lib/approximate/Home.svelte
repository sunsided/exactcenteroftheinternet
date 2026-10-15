<!--
	approximatecenteroftheinternet.com: a joke on exactcenteroftheinternet.com.
	Same page, give or take.
-->
{@html `<!-- YOU PEEPED UNDER THE INTERNET'S SKIRT, MORE OR LESS. THE INTERNET IS MILDLY UNHAPPY. THIS ONE USES CSS. ROUGHLY. -->`}

<main>
	<p class="message">
		this dot here below is approximately the center of the internet.<br />
		<br />
		go ahead, click somewhere around it. close enough is fine.
	</p>

	<img class="arrow" src="/arrow.jpg" width="52" height="92" alt="" />

	<a class="zone" href="/thankyou.htm" aria-label="approximately the center of the internet">
		<span class="dot"></span>
	</a>
</main>

<!-- Nudge things a little on every visit, so the center is never quite where you left it. -->
{@html `<script>
	(function () {
		var r = function (n) { return Math.round((Math.random() * 2 - 1) * n); };
		var s = document.documentElement.style;
		s.setProperty('--dx', r(28) + 'px');
		s.setProperty('--dy', r(14) + 'px');
		s.setProperty('--tilt', r(14) + 'deg');
	})();
</script>`}

<style>
	main {
		padding-top: 5em;
		text-align: center;
		font-family: Arial, Helvetica, sans-serif;
	}

	.message {
		display: inline-block;
		margin: 0 0 1em;
		max-width: 30em;
		text-align: left;
		font-size: 17px;
		line-height: 1.2;
		color: #000;
		/* hand-set, slightly crooked */
		transform: rotate(-0.6deg) translateX(9px);
	}

	.arrow {
		display: block;
		margin: 0 auto;
		transform: rotate(var(--tilt, 9deg));
		transform-origin: 50% 0;
	}

	.zone {
		position: relative;
		display: block;
		width: 96px;
		height: 48px;
		margin: 0 auto;
	}

	.dot {
		position: absolute;
		left: calc(50% + var(--dx, 11px));
		top: calc(50% + var(--dy, -5px));
		width: 3px;
		height: 3px;
		border-radius: 50%;
		background: #000;
		box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.35);
		transform: translate(-50%, -50%);
	}
</style>

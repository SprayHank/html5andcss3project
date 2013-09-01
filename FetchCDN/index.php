<?PHP
$JS = array(
	array(
		'http://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js',
		'CDN GreenSock JS',
	),
	//	array(
	//		'http://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js',
	//		'CDN GreenSock JS'
	//	),
);
function exportjs($script) {
	GLOBAL $JS;
	$config = dirname(__FILE__).'/Config.php';
	include $config;
	foreach($JS as $js) {
		if(substr($js[0], -strlen($script)) === $script) {
			if((($time = time()) - $UPDATETIME[$script]) > (7 * 24 * 60 * 60) /*7 days; 24 hours; 60 mins; 60secs*/) {
				$_JS = file_get_contents($js[0]);
				file_put_contents('Static/JavaScript/'.$script, $_JS);

				$string = file_get_contents($config);
				$pattern = '/^(<\?PHP[\s\S]*?'.addcslashes($script,'.').'.*?)(\d+)([\s\S]*)$/i';
				$replacement = '${1}'.$time.'$3';
				$string = preg_replace($pattern, $replacement, $string);
				file_put_contents($config, $string);
			}
			echo '<script src="Static/JavaScript/'.$script.'">//'.$js[1].'</script>
';
		}
	}
}

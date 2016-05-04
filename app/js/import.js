var srcFiles = [
	'js/modules/Admin/controllers/FormaPgtController.js',
	'js/modules/Admin/services/FormaPagamentoService.js'
]
$(document).ready(function () {
	$('input').on('input', function(e) {
			var $input = $(e.target),
					maxlength = $input.attr('max').trim().length;
			if ($input.val().length > maxlength) {
				$input.val($input.val().slice(0,maxlength));
			}
	});
});
$(function(){
	// for (var i = 0; i < srcFiles.length; i++) {
	// 	var imported = document.createElement('script');
	// 	imported.src = srcFiles[i];
	// 	document.head.appendChild(imported);
	// };
});


$(function() {

	var filesTab = $('.files-tab'),
		textTab = $('.text-tab'),
		textTabContainer = $('.text-tab-container'),
		filesTabContainer = $('.files-tab-container'),
		compressButton = $('#compress-js-button');

	var compressText = textTab.hasClass('active');

	$('.files-tab').click(function() {
		textTabContainer.addClass('hidden');
		textTab.removClass('active');
		filesTabContainer.removeClass('hidden');
		filesTab.addClass('active');
	});
	$('.text-tab').click(function() {
		filesTabContainer.addClass('hidden');
		filesTab.removeClass('active');
		textTabContainer.removeClass('hidden');
		textTab.addClass('active');
	});

	compressButton.click(function() {
		if (compressText)
			compressJsText();
		else
			compressJsFiles();
	});

	function compressJsText() {
		var formData = new FormData();
		formData.append('jsInput', $('#js-input').val());

		$.ajax({
			url: '/compress-text',
			type: 'POST',
			data: formData,
			contentType: false,
			processData: false
		}).success(function(res) {
			alert(res);
		}).error(function(e) {
			alert(e);
		});
	}

	function compressJsFiles() {

	}

});
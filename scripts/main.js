
$(function() {

	var filesTab = $('.files-tab'),
		textTab = $('.text-tab'),
		textTabContainer = $('.text-tab-container'),
		filesTabContainer = $('.files-tab-container'),
		compressTextButton = $('#compress-text'),
		compressFilesButton = $('#compress-files');

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

	compressTextButton.click(function() {
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
	});

	compressFilesButton.click(function() {

	});

});
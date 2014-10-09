
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
		var jsText = $('textarea.js-input').val();
		$.ajax({
			type: 'post',
			url: '/compress-text',
			data: {
				jsText: jsText
			}
		}).success(function(compressedObj) {
			alert(compressedObj);
		}).error(function(e){
			alert(JSON.stringify(e));
		});
	});

	compressFilesButton.click(function() {

	});

});
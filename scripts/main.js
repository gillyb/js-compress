
$(function() {

	var filesTab = $('.files-tab'),
		textTab = $('.text-tab'),
		textTabContainer = $('.text-tab-container'),
		filesTabContainer = $('.files-tab-container'),
		compressButton = $('#compress-js-button'),
		outputDetails = $('.output-details');

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
		formData.append('jsCompressor', $('input[name=compressor-type]:checked').val());

		$.ajax({
			url: '/compress-text',
			type: 'POST',
			data: formData,
			contentType: false,
			processData: false
		}).success(function(res) {
			//res.compressor, res.prev_data_size, res.new_data_size
			outputDetails.append(createResultTemplate(res[0].compressor, res[0].prev_data_size, res[0].new_data_size));
			$('#js-input').val(res[0].compressed);œ
		}).error(function(e) {
			alert(e);
		});
	}

	function compressJsFiles() {

	}

	function createResultTemplate(compressor, prev_size, new_size) {
		function createFieldValue(field, value) {
			var f = $('<span/>').addClass('label').html(field);
			var v = $('<span/>').addClass('value').html(value);
			return $('<div/>').append(f).append(v);
		}

		var wrappingDiv = $('<div/>').addClass('output-result');
		wrappingDiv.append(createFieldValue('Compressor : ', compressor));
		wrappingDiv.append(createFieldValue('original size : ', prev_size));
		wrappingDiv.append(createFieldValue('compressed size : ', new_size));

		return wrappingDiv;
	}

});
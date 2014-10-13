
$(function() {

    var filesTab = $('.files-tab'),
        textTab = $('.text-tab'),
        textTabContainer = $('.text-tab-container'),
        filesTabContainer = $('.files-tab-container'),
        compressButton = $('#compress-js-button'),
        outputDetails = $('.output-details .output');

    var compressText = textTab.hasClass('active');

    $('.files-tab').click(function() {
        textTabContainer.addClass('hidden');
        textTab.removeClass('active');
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

            outputDetails.html('');

            var originalFileSize = res[0].prev_data_size.withCommas() + 'bytes';
            var originalSizeDiv = $('<div/>')
                .addClass('original-size')
                .html('Original file size : ' + originalFileSize);
            outputDetails.append(originalSizeDiv);

            var mostCompressed = 0;
            var smallest = res[0].prev_data_size;
            for (var i=0; i<res.length; i++) {
                outputDetails.append(createResultTemplate(res[i].compressor, res[i].prev_data_size, res[i].new_data_size));
                if (res[0].new_data_size < smallest) {
                    smallest = res[0].new_data_size;
                    mostCompressed = i;
                }
            }

            $('#js-input').val(res[mostCompressed].compressed);
        }).error(function(e) {
            alert(e);
        });
    }

    function compressJsFiles() {

    }

    function createResultTemplate(compressor, original_size, new_size) {

        var wrappingDiv = $('<div/>').addClass('output-result');

        var compressedSize = new_size.withCommas();
        var compressedPercent = parseInt(((original_size - new_size) / original_size) * 100);

        wrappingDiv.append($('<span/>').addClass('compressor').html(compressor + ' : '));
        wrappingDiv.append($('<span/>')
            .addClass('new-size')
            .html(compressedSize + ' (' + compressedPercent + '%)'));

        return wrappingDiv;
    }

});
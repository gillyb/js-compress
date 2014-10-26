
$(function() {

    var filesTab = $('.files-tab'),
        textTab = $('.text-tab'),
        textTabContainer = $('.text-tab-container'),
        filesTabContainer = $('.files-tab-container'),
        compressButton = $('#compress-js-button'),
        outputDetails = $('.output-details .output');

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
        if (textTab.hasClass('active'))
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
            displayOutputResults(res);
        }).error(function(e) {
            alert('An error occurred while trying to compress javascript text.');
        });
    }

    function compressJsFiles() {
        var jsFiles = [];
        filesTabContainer.find('.file-container .filename').each(function() {
            jsFiles.push($(this).data('full-name'));
        });

        $.ajax({
            type: 'POST',
            url: '/compress-files',
            data: {
                pageHash: $('#page-hash').attr('value'),
                jsCompressor: $('input[name=compressor-type]:checked').val(),
                jsFiles: JSON.stringify(jsFiles)
            }
        }).success(function(res) {
            displayOutputResults(res, true);
        }).error(function(ex) {
            //alert(JSON.stringify(ex));
            alert('Sorry, but an error occurred while trying to compress the uploaded javascript files.');
        });
    }

    function createResultTemplate(compressor, original_size, new_size) {
        var wrappingDiv = $('<div/>').addClass('output-result');

        var compressedSize = new_size.withCommas() + 'bytes';
        var compressedPercent = parseInt(((original_size - new_size) / original_size) * 100);

        wrappingDiv.append($('<span/>').addClass('compressor').html(compressor + ' : '));
        wrappingDiv.append($('<span/>')
            .addClass('new-size')
            .html(compressedSize + ' (' + compressedPercent + '%)'));

        return wrappingDiv;
    }

    function displayOutputResults(outputResponse, isFiles) {
        outputDetails.html('');

        var originalFileSize = outputResponse[0].prev_data_size.withCommas() + 'bytes';
        var originalSizeDiv = $('<div/>')
            .addClass('original-size')
            .html('Original file size : ' + originalFileSize);
        outputDetails.append(originalSizeDiv);

        var mostCompressed = 0;
        var smallest = outputResponse[0].prev_data_size;
        for (var i=0; i<outputResponse.length; i++) {
            outputDetails.append(createResultTemplate(outputResponse[i].compressor, outputResponse[i].prev_data_size, outputResponse[i].new_data_size));
            if (outputResponse[0].new_data_size < smallest) {
                smallest = outputResponse[0].new_data_size;
                mostCompressed = i;
            }
            if (isFiles) {
                var date = new Date();
                var linkDir = 'output/' + date.getFullYear() + (date.getMonth()+1) + date.getDate();
                    linkDir += '/' + $('#page-hash').attr('value');
                var downloadLink = $('<div/>')
                    .addClass('download-link')
                    .html('<a href=\"' + linkDir + '/' + outputResponse[i].file + '.js\">Download</a>');
                outputDetails.append(downloadLink);
            }
        }
        $('#js-input').val(outputResponse[mostCompressed].compressed);
    }

    $(document).on('click', '.file-container .delete', function() {
        var fileContainer = $(this).parents('.file-container');
        var filename = fileContainer.find('.filename').data('full-name');
        var pageHash = $('#page-hash').attr('value');
        $.ajax({
            url: '/delete-file',
            type: 'post',
            data: {
                filename: filename,
                pageHash: pageHash
            }
        }).success(function() {
            fileContainer.remove();
        }).error(function(ex) {
            alert('Oh, this is embarrassing!\nAn error occurred while trying to delete the uploaded file.');
        });
    });

    window.clearAll = function() {
        if (window.confirm('Are you sure you want to delete all files ?')) {
            var pageHash = $('#page-hash').attr('value');
            $('.file-container').each(function() {
                var fileContainer = $(this);
                $.ajax({
                    url: '/delete-file',
                    type: 'post',
                    data: {
                        filename: fileContainer.find('.filename').data('full-name'),
                        pageHash: pageHash
                    }
                }).success(function() {
                    fileContainer.remove();
                }).error(function() {
                    alert('Houston, we have a problem!\nAn error occurred while trying to remove all uploaded files.\nJust refresh this page and try again. Sorry.');
                });
            });
        }
    };




    // COMPRESSOR RADIO BUTTONS //

    var allCompressorsRadios = $('.actions input[type=radio]'),
        allCompressorsDisplay = $('.actions .check'),
        compressorYuiRadio = $('#compressor-yui'),
        compressorYuiDisplay = $('.actions .compressor-yui .check'),
        compressorYuiLabel = $('.actions label[for=compressor-yui]'),
        compressorJsMinRadio = $('#compressor-jsmin'),
        compressorJsMinDisplay = $('.actions .compressor-jsmin .check'),
        compressorJsMinLabel = $('.actions label[for=compressor-jsmin]'),
        compressorUglifyRadio = $('#compressor-uglify'),
        compressorUglifyDisplay = $('.actions .compressor-uglify .check'),
        compressorUglifyLabel = $('.actions label[for=compressor-uglify]'),
        compressorAllRadio = $('#compressor-all'),
        compressorAllDisplay = $('.actions .compressor-all .check'),
        compressorAllLabel = $('.actions label[for=compressor-all]');

    function deSelectAll() {
        allCompressorsRadios.removeAttr('selected');
        allCompressorsDisplay.removeClass('selected');
    }

    function chooseYui() {
        deSelectAll();
        compressorYuiRadio.attr('selected', 'selected');
        compressorYuiDisplay.addClass('selected');
    }
    function chooseJsMin() {
        deSelectAll();
        compressorJsMinRadio.attr('selected', 'selected');
        compressorJsMinDisplay.addClass('selected');
    }
    function chooseUglify() {
        deSelectAll();
        compressorUglifyRadio.attr('selected', 'selected');
        compressorUglifyDisplay.addClass('selected');
    }
    function chooseAll() {
        deSelectAll();
        compressorAllRadio.attr('selected', 'selected');
        compressorAllDisplay.addClass('selected');
    }

    compressorYuiDisplay.click(chooseYui);
    compressorYuiLabel.click(chooseYui);

    compressorJsMinDisplay.click(chooseJsMin);
    compressorJsMinLabel.click(chooseJsMin);

    compressorUglifyDisplay.click(chooseUglify);
    compressorUglifyLabel.click(chooseUglify);

    compressorAllDisplay.click(chooseAll);
    compressorAllLabel.click(chooseAll);

});
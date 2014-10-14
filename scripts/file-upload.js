
var holder = $('#holder'),
    tests = { // check for compatibility
        filereader: typeof(FileReader) != 'undefined',
        dnd: 'draggable' in document.createElement('span'),
        formdata: !!window.FormData,
        progress: "upload" in new XMLHttpRequest
    },
    support = { // check support for certain html5 elements
        filereader: $('#filereader'),
        formdata: $('#formdata'),
        progress: $('#progress')
    },
    acceptedTypes = { // types we can accept
        'image/png': true, // TODO: change this to js/css only!
        'image/jpeg': true,
        'image/gif': true
    },
    progress = $('#uploadprogress'),
    fileupload = $('#upload');

['filereader', 'formdata', 'progress'].forEach(function (api) {
    if (tests[api] === false) {
        support[api].addClass('fail');
    } else {
        support[api].addClass('hidden');
    }
});

function previewfile(file) {
    if (tests.filereader === true) {

        $('#holder .placeholder').remove();

        var reader = new FileReader();

        (function(filename) {
            reader.onload = function (e) {
                var fileContainer = $('<div/>').addClass('file-container');
                var fileName = $('<span/>')
                    .addClass('filename')
                    .html(filename.truncateFilename());

                var delButton = $('<span/>').addClass('delete').html('X');

                fileContainer
                    .append(fileName)
                    .append(delButton);

                holder.append(fileContainer);
            };
        })(file.name);

        reader.readAsDataURL(file);
    } else {
        holder.html(holder.html() + '<p>Uploaded ' + file.name + ' ' + (file.size ? (file.size / 1024 | 0) + 'K' : ''));
        console.log(file);
    }
}

function readfiles(files) {
    // TODO: make sure files are only *.js

    var formData = tests.formdata ? new FormData() : null;
    for (var i = 0; i < files.length; i++) {
        if (tests.formdata)
            formData.append('file', files[i]);
        previewfile(files[i]);
    }

    // now post a new XHR request
    if (tests.formdata) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/upload');
        xhr.onload = function () {
            progress.value = progress.innerHTML = 100;
        };

        if (tests.progress) {
            xhr.upload.onprogress = function (event) {
                if (event.lengthComputable) {
                    var complete = (event.loaded / event.total * 100 | 0);
                    progress.value = progress.innerHTML = complete;
                }
            }
        }

        xhr.send(formData);
    }
}

if (tests.dnd) {
    holder.on('dragover', function () {
        $(this).addClass('hover');
        return false;
    });
    holder.on('dragend', function () {
        $(this).removeClass('hover');
        return false;
    });
    holder.on('drop', function (e) {
        $(this).removeClass('hover');
        e.preventDefault();
        e.stopPropagation();

        readfiles(e.originalEvent.dataTransfer.files);
    });
}
else {
    fileupload.addClass('hidden');
    fileupload.find('input').on('change', function () {
        readfiles(this.files);
    });
}
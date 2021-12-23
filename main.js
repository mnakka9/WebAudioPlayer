// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
// Write your JavaScript code.
jQuery(document).ready(() => {

    const fileSelect = document.getElementById("fileSelect"),
        fileElem = document.getElementById("fileElem"),
        fileList = document.getElementById("fileList");

    fileSelect.addEventListener("click", function (e) {
        if (fileElem) {
            fileElem.click();
        }
        e.preventDefault(); // prevent navigation to "#"
    }, false);

    fileElem.addEventListener("change", handleFiles, false);

    function handleFiles() {
        if (!this.files.length) {
            fileList.innerHTML = "<p>No files selected!</p>";
        } else {
            var audioFile = this.files[0];
            var srcUrl = URL.createObjectURL(audioFile);
            fileList.innerHTML = "";
            const list = document.createElement("ul");
            fileList.appendChild(list);
            const li = document.createElement("li");
            li.innerHTML = audioFile.name;
            list.appendChild(li);
            var audio = document.getElementById("audioPlayer");
            var source = document.getElementById('audioSource');
            source.src = srcUrl;
            audio.load();
            $("#AddBookmark").prop("disabled", "");
            audio.play();
            URL.revokeObjectURL(audioFile);
            $("#bookmarksul").empty();
            $("#btnExport").prop("disabled", "");
            $("#txtJson").prop("disabled", "");
            $("#btnImport").prop("disabled", "");
        }
    }

    $("#AddBookmark").click(() => {
        var audio = document.getElementById("audioPlayer");
        if (audio) {
            audio.play();
            var time = audio.currentTime;
            var timeInString = getTime(time);
            var li = `<li><button class="btn btn-info" value=${time} onclick="PlayBookMark(${time})"><span class="glyphicon glyphicon-bookmark"></span> ${timeInString}</button></li>`;
            var ul = document.getElementById("bookmarksul");
            $(ul).append(li);
        }
    });

    window.PlayBookMark = function PlayBookMark(time) {
        var audio = document.getElementById("audioPlayer");
        if (audio) {
            audio.play();
            audio.currentTime = time;
        }
    }

    window.getTime = function display(seconds) {
        const format = val => `0${Math.floor(val)}`.slice(-2)
        const hours = seconds / 3600
        const minutes = (seconds % 3600) / 60

        return [hours, minutes, seconds % 60].map(format).join(':')
    }

    window.exportBookmarks = function () {
        var audio = document.getElementById("audioPlayer");
        if (audio) {
            let bookmarksJson = [];
            $("#bookmarksul").find("li").each((index, element) => {
                let time = $(element).find('button').attr('value');
                if (time) {
                    bookmarksJson.push(time);
                }
            });

            let exportJson = JSON.stringify(bookmarksJson);
            saveTemplateAsFile("bookmarks.json", exportJson);
        }
    }

    window.importBookmarks  = function importBookmarks() {
        var audio = document.getElementById("audioPlayer");
        if (audio) {
            let json = $("#txtJson").val();
            if (json) {
                let bookmarks = JSON.parse(json);
                $("#bookmarksul").empty();
                bookmarks.forEach(time => {
                    time = parseFloat(time);
                    var timeInString = getTime(time);
                    var li = `<li><button class="btn-light" value=${time} onclick="PlayBookMark(${time})">${timeInString}</button></li>`;
                    var ul = document.getElementById("bookmarksul");
                    $(ul).append(li);
                });
                $("#txtJson").val('');
            }
        }
    }

    const saveTemplateAsFile = (filename, jsonToWrite) => {
        const blob = new Blob([jsonToWrite], { type: "text/json" });
        const link = document.createElement("a");

        link.download = filename;
        link.href = window.URL.createObjectURL(blob);
        link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

        const evt = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
        });

        link.dispatchEvent(evt);
        link.remove()
    };
});
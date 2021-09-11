$(function () {
    $("#dayplanner-left").sortable({
        connectWith: ".connectedSortable"
    }).disableSelection();
    $("#dayplanner-right").sortable({
        connectWith: ".connectedSortable",
        update: function (event, ui) {
            //console.log(ui.item.attr('data-id'))
            let image = []
            $(this).find('li').each(function (i) {
                image.push($(this).data('id'));
            });
            console.log(image)
            let url = 'https://dayplanner-service.nullzueins.com/pdf?' + $.param({
                'image': image
            }, true);
            $('#download').attr('href', url)
        }
    }).disableSelection();

    $(document).dblclick(".ui-state-default", function () {
        $("[contenteditable]", this).focus()
    });


    $('#cmd').click(function () {
        let image = []
        $('#dayplanner-right')
            .find('li')
            .each(function () {
                image.push($(this).attr('data-id'))
            })
        console.log(image)
        $.get("https://dayplanner-service.nullzueins.com/pdf?image=1&image=2", {
            image
        },
            function (data, status) {
                console.log("Data: " + data + "\nStatus: " + status + " \nof " + $(ui.item).attr('data-id') + " \nwith " + $(ui.item).attr('newRating'));
            }
        );
    });
});

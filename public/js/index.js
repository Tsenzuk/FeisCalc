jQuery(function ($) {
    var Roots = {
        fesiList: $("#fc-feises")
    }
    var feises = [];

    function feisesList() {
        Roots.fesiList.find("option").not(".default").remove();
        feises.forEach(function (f, id) {
            if (f) {
                Roots.fesiList.append($("<option></option>").val(id).text(f.name).data("feis", f));
            }
        })
    }

    Roots.fesiList.change(function () {
        var leftPanel = $(".tab-pane.active").find(".left-panel");
        var feis = Roots.fesiList.find("option:selected").data("feis");
        $.getJSON("/feises/" + Roots.fesiList.val() + "/participants", function (ret) {
            feis.participants = ret;
            leftPanel.find(".list-group").html("").append(feis.participants.map(function (p, index) {
                return ((p) ? $("<li></li>")
                    .addClass("list-group-item")
                    .append(
                        $("<a></a>")
                        .attr("href", "/users/" + index + "/")
                        .text(p.name + " " + p.lastName)
                    ) : undefined)
            }))
        })
    });

    $.getJSON("/feises/", function (ret) {
        feises = ret;
        feisesList();
    });


});
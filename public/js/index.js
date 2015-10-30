/**
 * jQuery plugins
 */
jQuery(function ($) {
    $.fn.fillForm = function (obj) {
        this.children("fieldset").remove();
        return this.append($("<fieldset></fieldset>").append(
            Object.keys(obj).map(function (k) {
                var rerObj;
                var cover = $("<div></div>")
                    .addClass("form-group")
                    .append(
                        $("<label></label>")
                        .addClass("col-sm-2 control-label")
                        .attr("for", k)
                        .text(k)
                    )
                var inputCover = $("<div></div>")
                    .addClass("col-sm-10")
                    .appendTo(cover);

                switch (typeof obj[k]) {
                case "object":
                    {
                        break;
                    }
                case "boolean":
                    {
                        rerObj = cover;
                        cover.find("label").remove();
                        inputCover
                            .addClass("col-sm-offset-2")
                            .append(
                                $("<div></div>")
                                .addClass("checkbox")
                                .append(
                                    $("<label></label>")
                                    .append(
                                        $("<input />")
                                        .attr("name", k)
                                        .attr("type", "checkbox")
                                        .val(obj[k])
                                    )
                                    .append(
                                        k
                                    )
                                )
                            )
                        break;
                    }
                default:
                    {
                        switch (k) {
                        case "date":
                            {
                                var d = new Date(obj[k]);
                                var date = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).substr(-2) + "-" + ("0" + d.getDate()).substr(-2);
                                rerObj = cover;
                                inputCover.append(
                                    $("<input />")
                                    .addClass("form-control")
                                    .attr("name", k)
                                    .attr("type", "date")
                                    .val(date)
                                    .datepicker({
                                        format: "yyyy-mm-dd"
                                    })
                                )
                                break;
                            }
                        default:
                            {
                                rerObj = cover;
                                inputCover.append(
                                    $("<input />")
                                    .addClass("form-control")
                                    .attr("name", k)
                                    .val(obj[k])
                                );
                            }
                        }
                    }
                }
                return rerObj;
            })
        ));
    }
});

/**
 * Initial code
 */
jQuery(function ($) {
    var Roots = {
        feisList: $("#fc-feises"),
        usersTab: $("#users"),
        feisSettings: $("#fc-feis-settings"),
        userSettings: $("#fc-user-settings")
    }
    var feises = [];
    var users = [];

    function feisesList() {
        Roots.feisList.find("option").not(".default").remove();
        feises.forEach(function (f, id) {
            if (f) {
                Roots.feisList.append($("<option></option>").val(id).text(f.name).data("feis", f));
            }
        })
    }

    function showUser() {
        var $this = $(this);
        var id = $this.data("id");
        Roots.userSettings.fillForm(users[id]);
    }

    function usersList() {
        Roots.usersTab.find(".list-group").html("").append(users.map(function (u, i) {
            if (u) {
                return $("<li></li>")
                    .addClass("list-group-item")
                    .append(
                        $("<a></a>")
                        .attr("href", "#")
                        .text(u.name + " " + u.lastName)
                        .data("id", i)
                        .click(showUser)
                        .append(
                            $("<i></i>")
                            .addClass("glyphicon glyphicon-chevron-right pull-right")
                        )
                    )
            }
        }));
    }
    /**
    * Default behavior
    */
    Roots.feisSettings.submit(function(){
        var $this = $(this);
        var formData = $this.serialize();
        var method = $this.attr("method") || "GET";
        var path = "/feises/" + Roots.feisList.val();//$this.attr("action") || window.location.pathname;
        $.ajax({
            method:method,
            url:path,
            data:formData,
            success:function(){
                window.location.reload();
            }
        });
        return false;
    })
    Roots.feisList.change(function () {
        var leftPanel = $(".tab-pane.active").find(".left-panel");
        var feisId = Roots.feisList.val();

        $.getJSON("/feises/" + feisId, function (ret) {
            feises[feisId] = $.extend(feises[feisId], ret);

            Roots.feisSettings.fillForm(feises[feisId])
        });
        $.getJSON("/feises/" + feisId + "/participants", function (ret) {
            feises[feisId].participants = ret;
            leftPanel.find(".list-group").html("").append(feises[feisId].participants.map(function (p, index) {
                return ((p) ? $("<li></li>")
                    .addClass("list-group-item")
                    .append(
                        $("<a></a>")
                        .attr("href", "/users/" + index + "/")
                        .attr("target", "_blank")
                        .text(p.name + " " + p.lastName)
                    ) : undefined)
            }))
        });
    });

    /**
    * Startup
    */
    $.getJSON("/feises/", function (ret) {
        feises = ret;
        feisesList();
    });

    $.getJSON("/users/", function (ret) {
        users = ret;
        usersList();
    });
});
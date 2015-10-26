jQuery(function ($) {
    $(".edit-record").click(function () {
        var $this = $(this);
        $this.parent().find(".modal").modal("show");
    });
    $("form").submit(function () {
        var $this = $(this);
        var formData = $this.serialize();
        var method = $this.attr("method") || "GET";
        var path = $this.attr("action") || window.location.pathname;
        $.ajax({
            method:method,
            url:path,
            data:formData,
            success:function(){}
        });
        window.location.reload();
        return false;
    }).find(".delete").click(function(){
        var $this = $(this).closest("form");
        var method = "DELETE";
        var path = $this.attr("action") || window.location.pathname;
        $.ajax({
            method:method,
            url:path,
            success:function(){}
        });
        window.location.reload();
        return false;
    })
})
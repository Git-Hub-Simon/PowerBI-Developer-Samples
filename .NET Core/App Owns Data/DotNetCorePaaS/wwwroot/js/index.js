$(function () {
    var models = window["powerbi-client"].models;
    var reportContainer = $("#report-container").get(0);
    
    // Initialize iframe for embedding report
    powerbi.bootstrap(reportContainer, { type: "report" });
    
    $.ajax({
        type: "GET",
        url: "/embedinfo/getembedinfo",
        success: function (data) {
            embedData = $.parseJSON(data);
            reportLoadConfig = {
                type: "report",
                tokenType: models.TokenType.Embed,
                accessToken: embedData.accessToken,
                embedUrl: embedData.embedUrl
            };

            // Use the token expiry to regenerate Embed token for seamless end user experience
            // Refer https://aka.ms/RefreshEmbedToken
            tokenExpiry = embedData.embedTokenExpiry;
            
            // Embed Power BI report when Access token and Embed URL are available
            var report = powerbi.embed(reportContainer, reportLoadConfig);
            
            // Clear any other loaded handler events
            report.off("loaded");

            // Triggers when a report schema is successfully loaded
            report.on("loaded", function () {
                console.log("Report load successful");
            });

            // Clear any other rendered handler events
            report.off("rendered");

            // Triggers when a report is successfully embedded in UI
            report.on("rendered", function () {
                console.log("Report render successful");
            });

            // Clear any other error handler events
            report.off("error");
            
            // Handle embed errors
            report.on("error", function (event) {
                var errorMsg = event.detail;
            
                // Use errorMsg variable to log error in any destination of choice
                console.error(errorMsg);
                return;
            });
        },
        error: function (err) {
            
            // Show error container
            var errorContainer = $(".error-container");
            $(".embed-container").hide();
            errorContainer.show();
            
            // Format error message
            var errMessageHtml = "<strong> Error Details: </strong> <br/>" + err.responseText;
            errMessageHtml = errMessageHtml.split("\n").join("<br/>");

            // Show error message on UI
            errorContainer.append(errMessageHtml);
        }
    });
});